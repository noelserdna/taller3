import { expect, test } from './fixtures/evidence.js';
import { apuntarse, cambiarPlazas, darDeBaja, reiniciar } from './fixtures/taller.js';

// Recorrido de la demo de la FASE-0 (tabla `## Demo`), con 2 plazas y dos navegadores independientes.
test('FASE-0 journey', async ({ page, request, browser }) => {
  await reiniciar(request);
  const mensaje = page.locator('#mensaje');
  const apuntados = page.locator('#principal h2').nth(0);
  const espera = page.locator('#principal h2').nth(1);

  // 1. Abrir /
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Taller de cerámica');
  await expect(apuntados).toHaveText('Apuntados (0 de 2 plazas)');
  await expect(espera).toHaveText('Lista de espera (0)');

  // 2. Apuntar «Marta» y «Pablo»
  await apuntarse(page, 'Marta');
  await expect(mensaje).toHaveText('Plaza confirmada para Marta');
  await expect(page.locator('#principal ul').nth(0)).toContainText('1. Marta');
  await apuntarse(page, 'Pablo');
  await expect(apuntados).toHaveText('Apuntados (2 de 2 plazas)');

  // 3. «Lucía» y «Álex»; repetir «Lucía» (Lucía usa su propio navegador, que recuerda su nombre)
  const lucia = await (await browser.newContext()).newPage();
  await lucia.goto('/');
  await apuntarse(lucia, 'Lucía');
  await expect(lucia.locator('#mensaje')).toHaveText('Lucía, estás en la lista de espera en el puesto 1');
  await apuntarse(page, 'Álex');
  await expect(mensaje).toHaveText('Álex, estás en la lista de espera en el puesto 2');
  await apuntarse(lucia, 'Lucía');
  await expect(lucia.locator('#mensaje')).toHaveText('Lucía ya está en el taller');

  // 4. Nombre en blanco
  await apuntarse(page, '   ');
  await expect(mensaje).toHaveText('Escribe un nombre para apuntarte');

  // 5. Otro navegador abre #organizacion
  const otro = await (await browser.newContext()).newPage();
  await otro.goto('/#organizacion');
  await expect(otro.locator('#organizacion li')).toHaveText(['1. Marta', '2. Pablo', '1. Lucía', '2. Álex']);

  // 6. Baja de «Pablo»; Lucía reabre la página
  await page.reload();
  await darDeBaja(page, 'Pablo');
  await expect(mensaje).toHaveText('Baja registrada para Pablo');
  await lucia.reload();
  await expect(lucia.locator('#mensaje')).toHaveText('Plaza confirmada para Lucía');

  // 7. Baja de «Álex»
  await darDeBaja(page, 'Álex');
  await expect(mensaje).toHaveText('Baja registrada para Álex');

  // 8. Organización: plazas 1, luego «abc», luego 3
  await page.goto('/#organizacion');
  const error = page.locator('#error-plazas');
  await cambiarPlazas(page, '1');
  await expect(error).toHaveText('No se pueden reducir las plazas por debajo de 2 personas apuntadas');
  await cambiarPlazas(page, 'abc');
  await expect(error).toHaveText('Indica un número de plazas de 1 o más');
  await cambiarPlazas(page, '3');
  // La demo dice «Apuntados (3 de 3 plazas)», pero tras las bajas de Pablo y Álex solo quedan Marta y Lucía: ver IF-0-002.
  await expect(page.locator('#organizacion h3').nth(0)).toHaveText('Apuntados (2 de 3 plazas)');
  await otro.context().close();
  await lucia.context().close();
});
