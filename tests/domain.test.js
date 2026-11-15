import { describe, expect, test } from 'vitest';
import { apuntar, cambiarPlazas, darDeBaja, estadoInicial } from '../src/domain/taller.js';

const taller = (plazas, apuntados = [], espera = []) => ({ plazas, apuntados, espera });

describe('apuntar', () => {
  test('un nombre repetido (sin distinguir mayúsculas ni espacios) deja un solo "Marta"', () => {
    const uno = apuntar(estadoInicial(2), 'Marta');
    const dos = apuntar(uno.estado, '  marta ');
    expect(dos.resultado.tipo).toBe('duplicado');
    expect(dos.estado.apuntados).toEqual(['Marta']);
  });
  test('repetir "Lucía" en la espera mantiene el puesto 1', () => {
    const lleno = taller(2, ['Marta', 'Pablo'], ['Lucía']);
    const r = apuntar(lleno, 'Lucía');
    expect(r.resultado.tipo).toBe('duplicado');
    expect(r.estado.espera).toEqual(['Lucía']);
  });
  test('con el taller lleno el puesto es el siguiente de la espera', () => {
    const lleno = taller(2, ['Marta', 'Pablo'], ['Lucía']);
    expect(apuntar(lleno, 'Álex').resultado).toEqual({ tipo: 'espera', nombre: 'Álex', puesto: 2 });
  });
  test('un nombre en blanco no apunta a nadie y no cambia el estado', () => {
    const antes = taller(2, ['Marta']);
    const r = apuntar(antes, '   ');
    expect(r.resultado.tipo).toBe('vacio');
    expect(r.estado).toEqual(antes);
  });
});

describe('darDeBaja', () => {
  const base = () => taller(2, ['Marta', 'Pablo'], ['Lucía', 'Álex']);
  test('la baja de "Álex" deja en la espera solo a Lucía en el puesto 1', () => {
    expect(darDeBaja(base(), 'Álex').estado.espera).toEqual(['Lucía']);
  });
  test('la baja de un apuntado promociona al primero de la espera y renumera', () => {
    const r = darDeBaja(base(), 'Pablo');
    expect(r.estado.apuntados).toEqual(['Marta', 'Lucía']);
    expect(r.estado.espera).toEqual(['Álex']);
  });
  test('la baja es idempotente', () => {
    const una = darDeBaja(taller(2, ['Marta', 'Pablo']), 'Marta');
    const dos = darDeBaja(una.estado, 'Marta');
    expect(una.estado.apuntados).toEqual(['Pablo']);
    expect(dos.estado).toEqual(una.estado);
  });
});

describe('cambiarPlazas', () => {
  const lleno = () => taller(2, ['Marta', 'Pablo'], ['Lucía', 'Álex']);
  test('ampliar a 3 promociona a "Lucía" a la tercera plaza', () => {
    const r = cambiarPlazas(lleno(), 3);
    expect(r.estado.apuntados).toEqual(['Marta', 'Pablo', 'Lucía']);
    expect(r.estado.espera).toEqual(['Álex']);
  });
  test('no se puede bajar de las personas apuntadas', () => {
    const r = cambiarPlazas(lleno(), 1);
    expect(r.resultado).toEqual({ tipo: 'plazas-minimo', n: 2 });
    expect(r.estado).toEqual(lleno());
  });
  test('"abc", 0 y negativos se rechazan', () => {
    for (const valor of ['abc', 0, '0', '-1', '', '2.5']) {
      const r = cambiarPlazas(taller(2), valor);
      expect(r.resultado.tipo).toBe('plazas-invalido');
      expect(r.estado.plazas).toBe(2);
    }
  });
  test('el mismo valor no cambia nada', () => {
    const antes = lleno();
    expect(cambiarPlazas(antes, '2').estado).toEqual(antes);
  });
});
