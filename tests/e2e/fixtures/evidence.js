// Evidencias: una imagen por criterio (evidencias/FASE-N/REQ-F-NNN-ACn.png) y un vídeo por test.
import { test as base, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const fase = process.env.SDD_FASE ?? '0';
export const evidenceDir = path.resolve(process.env.SDD_EVIDENCE_DIR ?? 'evidencias', `FASE-${fase}`);

// `ve`: los textos de la línea «Se ve:» del criterio, con los datos del GIVEN; se comprueban visibles antes de capturar.
export async function captura(page, testInfo, criterio, { ve = [] } = {}) {
  for (const texto of ve) await expect(page.getByText(texto, { exact: false }).first()).toBeVisible();
  mkdirSync(evidenceDir, { recursive: true });
  const id = criterio.replace(/\s+/g, '-');
  const fichero = path.join(evidenceDir, `${id}.png`);
  await page.screenshot({ path: fichero, fullPage: true });
  const sha256 = 'sha256:' + createHash('sha256').update(readFileSync(fichero)).digest('hex');
  writeFileSync(path.join(evidenceDir, `${id}.json`), JSON.stringify({
    criterio, test: testInfo.titlePath.slice(1).join(' › '), titulo: testInfo.title,
    ve, url: page.url(), imagen: `${id}.png`, sha256, at: new Date().toISOString(),
  }, null, 1));
  await testInfo.attach(criterio, { path: fichero, contentType: 'image/png' });
}
export const captureCriterion = captura;

// Un vídeo por test, con el nombre de su flujo: FASE-N (la entrega no define flujos WF).
export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await use(page);
    const video = page.video();
    if (!video) return;
    await page.close();
    mkdirSync(evidenceDir, { recursive: true });
    const id = `FASE-${fase}-${testInfo.title.slice(0, 40).replace(/[^A-Za-z0-9-]+/g, '-')}`;
    const fichero = path.join(evidenceDir, `${id}.webm`);
    await video.saveAs(fichero);
    await testInfo.attach(id, { path: fichero, contentType: 'video/webm' });
  },
});
export { expect };
