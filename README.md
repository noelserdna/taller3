# Taller de cerámica

Web para apuntarse a un taller con plazas limitadas, con lista de espera y una sección de Organización.

## Instalar
```
npm install
npx playwright install chromium
```

## Probar
```
npm test            # unitarios (Vitest)
npm run test:e2e    # recorrido en navegador (Playwright)
```

## Arrancar
```
npm run build && npm start
```
Variables: `PORT` (5173 por defecto), `HOST` (0.0.0.0), `TALLER_PLAZAS` (plazas iniciales, 10) y `TALLER_DATA` (fichero JSON con las listas, `data/taller.json`).
En desarrollo: `npx vite --host 127.0.0.1 --port 5173`.
