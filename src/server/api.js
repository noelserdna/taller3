// API JSON compartida (D-PA-001): middleware estilo connect, usado por Vite (configureServer) y por server.js.
import { apuntar, cambiarPlazas, darDeBaja } from '../domain/taller.js';
import { textoResultado } from '../messages.js';
import { storeDesdeEntorno } from './store.js';

function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    let datos = '';
    req.on('data', (trozo) => {
      datos += trozo;
      if (datos.length > 10_000) reject(new Error('cuerpo demasiado grande'));
    });
    req.on('end', () => {
      try { resolve(datos === '' ? {} : JSON.parse(datos)); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function responder(res, estado, codigo, resultado) {
  const cuerpo = {
    plazas: estado.plazas,
    apuntados: estado.apuntados,
    espera: estado.espera,
    resultado: resultado ? { ...resultado, mensaje: textoResultado(resultado) } : null,
  };
  res.statusCode = codigo;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(cuerpo));
}

const rechazos = new Set(['vacio', 'plazas-minimo', 'plazas-invalido']);

export function crearApi(obtenerStore) {
  return async function api(req, res, next) {
    const ruta = new URL(req.url, 'http://x').pathname;
    if (!ruta.startsWith('/api/')) return next();
    const store = obtenerStore();
    if (ruta === '/api/taller' && req.method === 'GET') return responder(res, store.leer(), 200, null);

    const operaciones = {
      '/api/apuntar': (actual, cuerpo) => apuntar(actual, cuerpo.nombre),
      '/api/baja': (actual, cuerpo) => darDeBaja(actual, cuerpo.nombre),
      '/api/plazas': (actual, cuerpo) => cambiarPlazas(actual, cuerpo.plazas),
    };
    if (!operaciones[ruta] || req.method !== 'POST') {
      res.statusCode = 404;
      return res.end();
    }
    let cuerpo;
    try { cuerpo = await leerCuerpo(req); } catch { return responder(res, store.leer(), 400, null); }
    if (cuerpo === null || typeof cuerpo !== 'object') return responder(res, store.leer(), 400, null);
    // Síncrono desde aquí: leer, decidir y guardar sin cesión (D-PA-006).
    const actual = store.leer();
    const { estado: nuevo, resultado } = operaciones[ruta](actual, cuerpo);
    if (nuevo !== actual) store.escribir(nuevo);
    return responder(res, nuevo, rechazos.has(resultado.tipo) ? 400 : 200, resultado);
  };
}

let storeCompartido;
const api = crearApi(() => (storeCompartido ??= storeDesdeEntorno()));
export default api;
