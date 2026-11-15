import { defineConfig, devices } from '@playwright/test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const datos = join(tmpdir(), `taller-e2e-${process.pid}.json`);

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['junit', { outputFile: '.sdd/junit/playwright.xml' }]],
  outputDir: 'test-results',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    screenshot: 'off',
    video: 'on',
    trace: 'off',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'npm run build && npm start',
    url: 'http://127.0.0.1:5173/',
    reuseExistingServer: false,
    timeout: 120000,
    env: { PORT: '5173', HOST: '127.0.0.1', TALLER_PLAZAS: '2', TALLER_DATA: datos },
  },
});
