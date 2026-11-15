import { mkdtempSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { crearApi } from '../src/server/api.js';
import { crearStore } from '../src/server/store.js';

let servidor;
let base;

beforeEach(async () => {
  const store = crearStore({ fichero: join(mkdtempSync(join(tmpdir(), 'taller-api-')), 'taller.json'), plazasIniciales: 2 });
  const api = crearApi(() => store);
  servidor = createServer((req, res) => api(req, res, () => { res.statusCode = 404; res.end(); }));
  await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
  base = `http://127.0.0.1:${servidor.address().port}`;
});
afterEach(() => new Promise((ok) => servidor.close(ok)));

const post = (ruta, cuerpo) =>
  fetch(base + ruta, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) });

describe('API compartida', () => {
  test('GET /api/taller devuelve {plazas, apuntados, espera, resultado}', async () => {
    const r = await fetch(base + '/api/taller');
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ plazas: 2, apuntados: [], espera: [], resultado: null });
  });
  test('apuntar confirma, manda a la espera con puesto y rechaza el nombre vacío con 400', async () => {
    expect((await (await post('/api/apuntar', { nombre: 'Marta' })).json()).resultado.mensaje).toBe('Plaza confirmada para Marta');
    await post('/api/apuntar', { nombre: 'Pablo' });
    const espera = await (await post('/api/apuntar', { nombre: 'Lucía' })).json();
    expect(espera.resultado.mensaje).toBe('Lucía, estás en la lista de espera en el puesto 1');
    const vacio = await post('/api/apuntar', { nombre: '   ' });
    expect(vacio.status).toBe(400);
    expect((await vacio.json()).apuntados).toEqual(['Marta', 'Pablo']);
  });
  test('baja promociona y plazas valida con 400', async () => {
    for (const nombre of ['Marta', 'Pablo', 'Lucía']) await post('/api/apuntar', { nombre });
    expect((await (await post('/api/baja', { nombre: 'Pablo' })).json()).apuntados).toEqual(['Marta', 'Lucía']);
    expect((await post('/api/plazas', { plazas: 'abc' })).status).toBe(400);
    expect((await post('/api/plazas', { plazas: 1 })).status).toBe(400);
    expect((await (await post('/api/plazas', { plazas: 3 })).json()).plazas).toBe(3);
  });
  test('un cuerpo que no es JSON recibe 400 y una ruta desconocida 404', async () => {
    const mal = await fetch(base + '/api/apuntar', { method: 'POST', body: '{no' });
    expect(mal.status).toBe(400);
    expect((await fetch(base + '/api/otra')).status).toBe(404);
  });
});
