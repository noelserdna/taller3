import { defineConfig } from 'vite';
import api from './src/server/api.js';

// El mismo manejador de la API sirve en desarrollo (aquí) y en producción (server.js).
export default defineConfig({
  plugins: [
    {
      name: 'taller-api',
      configureServer(servidor) {
        servidor.middlewares.use(api);
      },
      configurePreviewServer(servidor) {
        servidor.middlewares.use(api);
      },
    },
  ],
});
