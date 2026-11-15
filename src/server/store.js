// Almacén de las listas compartidas (D-PA-005, D-PA-006): un proceso, operaciones síncronas y volcado a disco.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { estadoInicial } from '../domain/taller.js';

export function crearStore({ fichero, plazasIniciales = 10 } = {}) {
  let estado = estadoInicial(plazasIniciales);
  if (fichero && existsSync(fichero)) {
    estado = JSON.parse(readFileSync(fichero, 'utf8'));
  }
  return {
    leer: () => estado,
    escribir(nuevo) {
      estado = nuevo;
      if (fichero) {
        mkdirSync(dirname(fichero), { recursive: true });
        writeFileSync(fichero, JSON.stringify(estado, null, 2));
      }
    },
  };
}

export function storeDesdeEntorno(env = process.env) {
  const plazas = Number.parseInt(env.TALLER_PLAZAS ?? '', 10);
  return crearStore({
    fichero: env.TALLER_DATA || 'data/taller.json',
    plazasIniciales: Number.isInteger(plazas) && plazas >= 1 ? plazas : 10,
  });
}
