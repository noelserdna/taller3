import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const fuentes = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const ruta = join(dir, n);
    return statSync(ruta).isDirectory() ? fuentes(ruta) : ruta.endsWith('.js') ? [ruta] : [];
  });

describe('restricciones', () => {
  // REQ-C-002 AC1: "a static check reads package.json (vite, vitest) and the source, and fails if the shared data is read or written in localStorage/sessionStorage/IndexedDB or if any request goes to a host other than the application's own"
  test('REQ-C-002 AC1 Vite + Vitest, listas solo en el servidor y sin otros hosts', () => {
    const paquete = JSON.parse(readFileSync('package.json', 'utf8'));
    const deps = { ...paquete.dependencies, ...paquete.devDependencies };
    expect(deps).toHaveProperty('vite');
    expect(deps).toHaveProperty('vitest');
    for (const fichero of fuentes('src')) {
      const codigo = readFileSync(fichero, 'utf8');
      expect(codigo, fichero).not.toMatch(/sessionStorage|indexedDB/i);
      expect(codigo, fichero).not.toMatch(/https?:\/\/(?!x['"/])/);
      for (const m of codigo.matchAll(/localStorage\.(?:get|set)Item\(([^)]*)\)/g)) {
        expect(m[1], `${fichero}: ${m[0]}`).toMatch(/^CLAVE\b/);
      }
      for (const m of codigo.matchAll(/\bfetch\(\s*([^,)]*)/g)) {
        expect(m[1].trim(), `${fichero}: fetch(${m[1]}`).toMatch(/^(ruta|base \+ ruta|'\/api\/)/);
      }
    }
    const ui = readFileSync('src/ui/main.js', 'utf8');
    expect(ui).toMatch(/JSON\.stringify\(\{ nombre, estado \}\)/);
  });
});
