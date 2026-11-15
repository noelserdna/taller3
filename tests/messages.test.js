import { describe, expect, test } from 'vitest';
import { etiquetas, formatear, mensajes, textoResultado } from '../src/messages.js';

const esperados = {
  confirmada: 'Plaza confirmada para {nombre}',
  espera: '{nombre}, estás en la lista de espera en el puesto {posicion}',
  duplicado: '{nombre} ya está en el taller',
  baja: 'Baja registrada para {nombre}',
  vacio: 'Escribe un nombre para apuntarte',
  plazasMinimo: 'No se pueden reducir las plazas por debajo de {n} personas apuntadas',
  plazasInvalido: 'Indica un número de plazas de 1 o más',
  sinEspera: 'Nadie en la lista de espera',
};

const textos = [...Object.values(mensajes), ...Object.values(etiquetas)];
// "confirmada" y "registrada" concuerdan con los sustantivos "plaza" y "baja", no con la persona (ver feedback IF-0-001).
const concuerdaConSustantivo = new Set(['confirmada', 'registrada']);

describe('catálogo de textos', () => {
  // REQ-NF-001 AC1: "GIVEN the full catalog of messages ("Plaza confirmada para Marta", "Álex, estás en la lista de espera en el puesto 2", "Baja registrada para Pablo") WHEN scanned for words ending in -ado/-ada/-ido/-ida and "o/a" forms THEN none is found"
  test('REQ-NF-001 AC1 ningún mensaje tiene formas de género hacia la persona', () => {
    for (const texto of textos) {
      const palabras = texto.match(/[\p{L}]+/gu) ?? [];
      const generadas = palabras.filter((p) => /(ado|ada|ido|ida)$/i.test(p) && !concuerdaConSustantivo.has(p.toLowerCase()));
      expect(generadas, texto).toEqual([]);
      expect(texto, texto).not.toMatch(/\b\w+o\/a\b|\b\w+a\/o\b|@/i);
    }
  });

  // REQ-NF-001 AC2: "GIVEN the same messages for names "Marta" and "Pablo" WHEN rendered THEN the text around the name is identical"
  test('REQ-NF-001 AC2 el texto alrededor de "Marta" y de "Pablo" es idéntico', () => {
    for (const plantilla of Object.values(mensajes)) {
      const marta = formatear(plantilla, { nombre: 'Marta', posicion: 2, n: 2 });
      const pablo = formatear(plantilla, { nombre: 'Pablo', posicion: 2, n: 2 });
      expect(marta.replaceAll('Marta', '{x}')).toBe(pablo.replaceAll('Pablo', '{x}'));
    }
    expect(textoResultado({ tipo: 'confirmada', nombre: 'Marta' })).toBe('Plaza confirmada para Marta');
    expect(textoResultado({ tipo: 'espera', nombre: 'Álex', puesto: 2 })).toBe('Álex, estás en la lista de espera en el puesto 2');
    expect(textoResultado({ tipo: 'baja', nombre: 'Pablo' })).toBe('Baja registrada para Pablo');
  });

  // REQ-C-001: "All interface texts SHALL be in Spanish"
  test('REQ-C-001 el catálogo es igual a los mensajes esperados en español', () => {
    expect(mensajes).toEqual(esperados);
    expect(etiquetas.titulo).toBe('Taller de cerámica');
  });
});
