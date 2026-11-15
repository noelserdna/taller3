import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = fileURLToPath(new URL('.', import.meta.url));
const dist = join(raiz, 'dist');
const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const apiRuta = join(raiz, 'src/server/api.js');
const api = existsSync(apiRuta) ? (await import(pathToFileURL(apiRuta).href)).default : null;

function estatico(req, res) {
  const ruta = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  let fichero = join(dist, ruta);
  if (!fichero.startsWith(dist)) { res.statusCode = 403; return res.end(); }
  if (!existsSync(fichero) || statSync(fichero).isDirectory()) fichero = join(dist, 'index.html');
  res.setHeader('Content-Type', tipos[extname(fichero)] ?? 'application/octet-stream');
  res.end(readFileSync(fichero));
}

const servidor = createServer((req, res) => {
  if (api) return api(req, res, () => estatico(req, res));
  estatico(req, res);
});

servidor.listen(Number(process.env.PORT ?? 5173), process.env.HOST ?? '0.0.0.0');
