import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { crearStore, storeDesdeEntorno } from '../src/server/store.js';

const ficheroTemporal = () => join(mkdtempSync(join(tmpdir(), 'taller-')), 'taller.json');

describe('store', () => {
  test('el estado inicial es de 10 plazas y listas vacías', () => {
    expect(crearStore().leer()).toEqual({ plazas: 10, apuntados: [], espera: [] });
  });
  test('TALLER_PLAZAS=2 fija 2 plazas iniciales', () => {
    const s = storeDesdeEntorno({ TALLER_PLAZAS: '2', TALLER_DATA: ficheroTemporal() });
    expect(s.leer().plazas).toBe(2);
  });
  test('el estado se guarda en el fichero y se recarga', () => {
    const fichero = ficheroTemporal();
    crearStore({ fichero }).escribir({ plazas: 3, apuntados: ['Marta'], espera: ['Lucía'] });
    expect(crearStore({ fichero }).leer()).toEqual({ plazas: 3, apuntados: ['Marta'], espera: ['Lucía'] });
  });
});
