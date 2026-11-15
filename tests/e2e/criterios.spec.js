import { captura, expect, test } from './fixtures/evidence.js';
import { apuntarse, cambiarPlazas, darDeBaja, dado, reiniciar } from './fixtures/taller.js';

// Un test por criterio de cada REQ-F: GIVEN con la API pública, WHEN en pantalla, THEN sobre el elemento que lo muestra.
const principal = (page) => page.locator('#principal');
const organizacion = (page) => page.locator('#organizacion');
const apuntados = (page) => principal(page).locator('h2').nth(0);
const espera = (page) => principal(page).locator('h2').nth(1);
const mensaje = (page) => page.locator('#mensaje');
const listaApuntados = (page) => principal(page).locator('ul').nth(0);
const listaEspera = (page) => principal(page).locator('ul').nth(1);

test.beforeEach(async ({ request }) => reiniciar(request));

test.describe('Participante', () => {
  test('REQ-F-001 AC1 portada con título y apuntados', async ({ page, request }, testInfo) => {
    await dado(request, [], 10);
    await page.goto('/');
    // REQ-F-001 AC1: "GIVEN a workshop with 10 plazas and nobody registered WHEN a person opens the page THEN the user sees the heading "Taller de cerámica" and "Apuntados (0 de 10 plazas)""
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Taller de cerámica');
    await expect(apuntados(page)).toHaveText('Apuntados (0 de 10 plazas)');
    await captura(page, testInfo, 'REQ-F-001 AC1', { ve: ['Taller de cerámica', 'Apuntados (0 de 10 plazas)'] });
  });

  test('REQ-F-001 AC2 portada con lista de espera', async ({ page, request }, testInfo) => {
    await dado(request, [], 10);
    await page.goto('/');
    // REQ-F-001 AC2: "GIVEN a workshop with 10 plazas and nobody on the waiting list WHEN a person opens the page THEN the user sees "Lista de espera (0)""
    await expect(espera(page)).toHaveText('Lista de espera (0)');
    await captura(page, testInfo, 'REQ-F-001 AC2', { ve: ['Lista de espera (0)'] });
  });

  test('REQ-F-002 AC1 Marta confirma su plaza', async ({ page }, testInfo) => {
    await page.goto('/');
    await apuntarse(page, 'Marta');
    // REQ-F-002 AC1: "GIVEN 2 plazas and nobody registered WHEN "Marta" writes "Marta" in "Nombre" and presses "Apuntarme" THEN the user sees "Plaza confirmada para Marta" and "1. Marta" in the apuntados"
    await expect(mensaje(page)).toHaveText('Plaza confirmada para Marta');
    await expect(listaApuntados(page)).toContainText('1. Marta');
    await captura(page, testInfo, 'REQ-F-002 AC1', { ve: ['Plaza confirmada para Marta', '1. Marta'] });
  });

  test('REQ-F-002 AC2 Pablo confirma su plaza', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta']);
    await page.goto('/');
    await apuntarse(page, 'Pablo');
    // REQ-F-002 AC2: "GIVEN 2 plazas and "Marta" already apuntada WHEN "Pablo" writes "Pablo" and presses "Apuntarme" THEN the user sees "Plaza confirmada para Pablo" and "Apuntados (2 de 2 plazas)""
    await expect(mensaje(page)).toHaveText('Plaza confirmada para Pablo');
    await expect(apuntados(page)).toHaveText('Apuntados (2 de 2 plazas)');
    await captura(page, testInfo, 'REQ-F-002 AC2', { ve: ['Plaza confirmada para Pablo', 'Apuntados (2 de 2 plazas)'] });
  });

  test('REQ-F-002 AC3 Marta repetida no se duplica', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta']);
    await page.goto('/');
    await apuntarse(page, 'Marta');
    // REQ-F-002 AC3: "GIVEN "Marta" apuntada WHEN the form is submitted again with "Marta" THEN the user sees "Apuntados (1 de 2 plazas)" and the list keeps one single "Marta""
    await expect(mensaje(page)).toHaveText('Marta ya está en el taller');
    await expect(apuntados(page)).toHaveText('Apuntados (1 de 2 plazas)');
    await expect(listaApuntados(page).locator('li')).toHaveText(['1. Marta Darse de baja']);
    await captura(page, testInfo, 'REQ-F-002 AC3', { ve: ['Apuntados (1 de 2 plazas)', 'Marta ya está en el taller'] });
  });

  test('REQ-F-003 AC1 Lucía entra en la espera en el puesto 1', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta', 'Pablo']);
    await page.goto('/');
    await apuntarse(page, 'Lucía');
    // REQ-F-003 AC1: "GIVEN 2 plazas filled by "Marta" and "Pablo" WHEN "Lucía" writes "Lucía" and presses "Apuntarme" THEN the user sees "Lucía, estás en la lista de espera en el puesto 1""
    await expect(mensaje(page)).toHaveText('Lucía, estás en la lista de espera en el puesto 1');
    await captura(page, testInfo, 'REQ-F-003 AC1', { ve: ['Lucía, estás en la lista de espera en el puesto 1'] });
  });

  test('REQ-F-003 AC2 Álex entra en la espera en el puesto 2', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta', 'Pablo', 'Lucía']);
    await page.goto('/');
    await apuntarse(page, 'Álex');
    // REQ-F-003 AC2: "GIVEN 2 plazas filled and "Lucía" at puesto 1 WHEN "Álex" writes "Álex" and presses "Apuntarme" THEN the user sees "Álex, estás en la lista de espera en el puesto 2" and "Lista de espera (2)""
    await expect(mensaje(page)).toHaveText('Álex, estás en la lista de espera en el puesto 2');
    await expect(espera(page)).toHaveText('Lista de espera (2)');
    await captura(page, testInfo, 'REQ-F-003 AC2', { ve: ['Álex, estás en la lista de espera en el puesto 2', 'Lista de espera (2)'] });
  });

  test('REQ-F-003 AC3 Lucía repetida conserva su puesto 1', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta', 'Pablo', 'Lucía']);
    await page.goto('/');
    await apuntarse(page, 'Lucía');
    // REQ-F-003 AC3: "GIVEN "Lucía" at puesto 1 WHEN the form is submitted again with "Lucía" THEN the user sees "Lucía ya está en el taller" and the waiting list keeps one single "Lucía" at puesto 1"
    await expect(mensaje(page)).toHaveText('Lucía ya está en el taller');
    await expect(espera(page)).toHaveText('Lista de espera (1)');
    await expect(listaEspera(page).locator('li')).toHaveText(['1. Lucía Darse de baja']);
    await captura(page, testInfo, 'REQ-F-003 AC3', { ve: ['Lucía ya está en el taller', 'Lista de espera (1)'] });
  });

  test('REQ-F-004 AC1 un nombre en blanco no apunta a nadie', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta']);
    await page.goto('/');
    await apuntarse(page, '   ');
    // REQ-F-004 AC1: "GIVEN 2 plazas and "Marta" apuntada WHEN "   " is submitted as "Nombre" THEN the user sees "Escribe un nombre para apuntarte" and "Apuntados (1 de 2 plazas)""
    await expect(mensaje(page)).toHaveText('Escribe un nombre para apuntarte');
    await expect(apuntados(page)).toHaveText('Apuntados (1 de 2 plazas)');
    await captura(page, testInfo, 'REQ-F-004 AC1', { ve: ['Escribe un nombre para apuntarte', 'Apuntados (1 de 2 plazas)'] });
  });

  test('REQ-F-005 AC1 baja de Álex en la espera', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta', 'Pablo', 'Lucía', 'Álex']);
    await page.goto('/');
    await darDeBaja(page, 'Álex');
    // REQ-F-005 AC1: "GIVEN "Marta" and "Pablo" apuntados and "Lucía" 1 and "Álex" 2 on the waiting list WHEN someone presses "Darse de baja" next to "Álex" THEN the user sees "Baja registrada para Álex" and "Lista de espera (1)" and "Lucía" stays at puesto 1"
    await expect(mensaje(page)).toHaveText('Baja registrada para Álex');
    await expect(espera(page)).toHaveText('Lista de espera (1)');
    // REQ-F-005 AC1 cláusula: ""Lucía" stays at puesto 1"
    await expect(listaEspera(page).locator('li')).toHaveText(['1. Lucía Darse de baja']);
    await captura(page, testInfo, 'REQ-F-005 AC1', { ve: ['Baja registrada para Álex', 'Lista de espera (1)'] });
  });

  test('REQ-F-005 AC2 baja de Lucía renumera la espera', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta', 'Pablo', 'Lucía', 'Álex']);
    await page.goto('/');
    await darDeBaja(page, 'Lucía');
    // REQ-F-005 AC2: "GIVEN "Lucía" 1 and "Álex" 2 on the waiting list and the workshop full WHEN someone presses "Darse de baja" next to "Lucía" THEN the user sees "Baja registrada para Lucía" and "Álex" now at puesto 1"
    await expect(mensaje(page)).toHaveText('Baja registrada para Lucía');
    await expect(listaEspera(page).locator('li')).toHaveText(['1. Álex Darse de baja']);
    await captura(page, testInfo, 'REQ-F-005 AC2', { ve: ['Baja registrada para Lucía', '1. Álex'] });
  });

  test('REQ-F-005 AC3 la baja repetida de Marta no cambia nada', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta', 'Pablo']);
    await page.goto('/');
    await darDeBaja(page, 'Marta');
    await expect(mensaje(page)).toHaveText('Baja registrada para Marta');
    await page.reload();
    await request.post('/api/baja', { data: { nombre: 'Marta' } });
    await page.reload();
    // REQ-F-005 AC3: "GIVEN "Marta" was just removed from 2 apuntados and 2 plazas WHEN the page is reloaded and the removal is requested again for "Marta" THEN the user sees "Apuntados (1 de 2 plazas)" and no "Marta" in any list"
    await expect(apuntados(page)).toHaveText('Apuntados (1 de 2 plazas)');
    // REQ-F-005 AC3 cláusula: "no "Marta" in any list"
    await expect(page.locator('body')).not.toContainText('Marta');
    await captura(page, testInfo, 'REQ-F-005 AC3', { ve: ['Apuntados (1 de 2 plazas)'] });
  });

  test('REQ-F-006 AC1 Lucía ve su plaza confirmada al volver', async ({ page, request, browser }, testInfo) => {
    await dado(request, ['Marta', 'Pablo']);
    await page.goto('/');
    await apuntarse(page, 'Lucía');
    await expect(mensaje(page)).toHaveText('Lucía, estás en la lista de espera en el puesto 1');
    const otro = await (await browser.newContext()).newPage();
    await otro.goto('/');
    await darDeBaja(otro, 'Pablo');
    await expect(otro.locator('#mensaje')).toHaveText('Baja registrada para Pablo');
    await page.reload();
    // REQ-F-006 AC1: "GIVEN "Marta" and "Pablo" apuntados, "Lucía" puesto 1 who registered on this device WHEN "Pablo" is removed and "Lucía" reopens the page THEN the user sees "Plaza confirmada para Lucía" and "Apuntados (2 de 2 plazas)""
    await expect(mensaje(page)).toHaveText('Plaza confirmada para Lucía');
    await expect(apuntados(page)).toHaveText('Apuntados (2 de 2 plazas)');
    await captura(page, testInfo, 'REQ-F-006 AC1', { ve: ['Plaza confirmada para Lucía', 'Apuntados (2 de 2 plazas)'] });
    await otro.context().close();
  });

  test('REQ-F-006 AC2 Álex ve su plaza confirmada al volver', async ({ page, request, browser }, testInfo) => {
    await dado(request, ['Marta', 'Pablo']);
    await page.goto('/');
    await apuntarse(page, 'Álex');
    await expect(mensaje(page)).toHaveText('Álex, estás en la lista de espera en el puesto 1');
    const otro = await (await browser.newContext()).newPage();
    await otro.goto('/');
    await darDeBaja(otro, 'Marta');
    await expect(otro.locator('#mensaje')).toHaveText('Baja registrada para Marta');
    await page.reload();
    // REQ-F-006 AC2: "GIVEN "Marta" and "Pablo" apuntados, "Álex" puesto 1 who registered on this device WHEN "Marta" is removed and "Álex" reopens the page THEN the user sees "Plaza confirmada para Álex""
    await expect(mensaje(page)).toHaveText('Plaza confirmada para Álex');
    await captura(page, testInfo, 'REQ-F-006 AC2', { ve: ['Plaza confirmada para Álex'] });
    await otro.context().close();
  });

  test('REQ-F-006 AC3 la espera se renumera al quedar una plaza libre', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta', 'Pablo', 'Lucía', 'Álex']);
    await page.goto('/');
    await darDeBaja(page, 'Pablo');
    // REQ-F-006 AC3: "GIVEN "Lucía" puesto 1 and "Álex" puesto 2 WHEN an apuntado is removed THEN the user sees "Álex" now at puesto 1 and "Lista de espera (1)""
    await expect(listaEspera(page).locator('li')).toHaveText(['1. Álex Darse de baja']);
    await expect(espera(page)).toHaveText('Lista de espera (1)');
    await captura(page, testInfo, 'REQ-F-006 AC3', { ve: ['1. Álex', 'Lista de espera (1)'] });
  });

  test('REQ-F-006 AC4 Lucía en el puesto 2 lo ve al volver sin bajas', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta', 'Pablo', 'Álex']);
    await page.goto('/');
    await apuntarse(page, 'Lucía');
    await expect(mensaje(page)).toHaveText('Lucía, estás en la lista de espera en el puesto 2');
    await page.reload();
    // REQ-F-006 AC4: "GIVEN "Lucía" at puesto 2 who registered on this device WHEN she reopens the page without any removal THEN the user sees "Lucía, estás en la lista de espera en el puesto 2""
    await expect(mensaje(page)).toHaveText('Lucía, estás en la lista de espera en el puesto 2');
    await captura(page, testInfo, 'REQ-F-006 AC4', { ve: ['Lucía, estás en la lista de espera en el puesto 2'] });
  });
});

test.describe('Organización', () => {
  test('REQ-F-007 AC1 la organizadora ve apuntados y espera en orden', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta', 'Pablo', 'Lucía', 'Álex']);
    await page.goto('/#organizacion');
    // REQ-F-007 AC1: "GIVEN "Marta" and "Pablo" apuntados and "Lucía" 1 and "Álex" 2 waiting WHEN the organizer opens "Organización" THEN the user sees "1. Marta", "2. Pablo" and "1. Lucía", "2. Álex""
    await expect(organizacion(page).locator('li')).toHaveText(['1. Marta', '2. Pablo', '1. Lucía', '2. Álex']);
    await captura(page, testInfo, 'REQ-F-007 AC1', { ve: ['1. Marta', '2. Pablo', '1. Lucía', '2. Álex'] });
  });

  test('REQ-F-007 AC2 sin nadie en espera', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta']);
    await page.goto('/#organizacion');
    // REQ-F-007 AC2: "GIVEN nobody waiting WHEN the organizer opens "Organización" THEN the user sees "Nadie en la lista de espera""
    await expect(organizacion(page)).toContainText('Nadie en la lista de espera');
    await captura(page, testInfo, 'REQ-F-007 AC2', { ve: ['Nadie en la lista de espera'] });
  });

  test('REQ-F-008 AC1 ampliar a 3 plazas promociona a Lucía', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta', 'Pablo', 'Lucía', 'Álex']);
    await page.goto('/#organizacion');
    await cambiarPlazas(page, '3');
    // REQ-F-008 AC1: "GIVEN 2 plazas full and "Lucía" 1, "Álex" 2 waiting WHEN the organizer sets "Plazas" to 3 and presses "Cambiar plazas" THEN the user sees "Apuntados (3 de 3 plazas)", "3. Lucía" and "Lista de espera (1)""
    await expect(organizacion(page).locator('h3').nth(0)).toHaveText('Apuntados (3 de 3 plazas)');
    await expect(organizacion(page).locator('li').nth(2)).toHaveText('3. Lucía');
    await expect(organizacion(page).locator('h3').nth(1)).toHaveText('Lista de espera (1)');
    await captura(page, testInfo, 'REQ-F-008 AC1', { ve: ['Apuntados (3 de 3 plazas)', '3. Lucía', 'Lista de espera (1)'] });
  });

  test('REQ-F-008 AC2 no se bajan las plazas de las personas apuntadas', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta', 'Pablo']);
    await page.goto('/#organizacion');
    await cambiarPlazas(page, '1');
    // REQ-F-008 AC2: "GIVEN 2 apuntados and 2 plazas WHEN the organizer sets "Plazas" to 1 THEN the user sees "No se pueden reducir las plazas por debajo de 2 personas apuntadas" and "Apuntados (2 de 2 plazas)""
    await expect(page.locator('#error-plazas')).toHaveText('No se pueden reducir las plazas por debajo de 2 personas apuntadas');
    await expect(organizacion(page).locator('h3').nth(0)).toHaveText('Apuntados (2 de 2 plazas)');
    await captura(page, testInfo, 'REQ-F-008 AC2', { ve: ['No se pueden reducir las plazas por debajo de 2 personas apuntadas', 'Apuntados (2 de 2 plazas)'] });
  });

  test('REQ-F-008 AC3 "abc" y 0 se rechazan', async ({ page }, testInfo) => {
    await page.goto('/#organizacion');
    // REQ-F-008 AC3: "GIVEN 2 plazas WHEN the organizer sets "Plazas" to "abc" or 0 THEN the user sees "Indica un número de plazas de 1 o más" and "Apuntados (0 de 2 plazas)""
    for (const valor of ['abc', '0']) {
      await cambiarPlazas(page, valor);
      await expect(page.locator('#error-plazas')).toHaveText('Indica un número de plazas de 1 o más');
      await expect(organizacion(page).locator('h3').nth(0)).toHaveText('Apuntados (0 de 2 plazas)');
    }
    await captura(page, testInfo, 'REQ-F-008 AC3', { ve: ['Indica un número de plazas de 1 o más', 'Apuntados (0 de 2 plazas)'] });
  });

  test('REQ-F-008 AC4 repetir 3 plazas no cambia nada', async ({ page, request }, testInfo) => {
    await dado(request, ['Marta', 'Pablo', 'Lucía', 'Álex']);
    await page.goto('/#organizacion');
    await cambiarPlazas(page, '3');
    await expect(organizacion(page).locator('h3').nth(0)).toHaveText('Apuntados (3 de 3 plazas)');
    const antes = await (await request.get('/api/taller')).json();
    await cambiarPlazas(page, '3');
    // REQ-F-008 AC4: "GIVEN plazas set to 3 WHEN the same value 3 is submitted again THEN the user sees "Apuntados (3 de 3 plazas)" and the lists do not change"
    await expect(organizacion(page).locator('h3').nth(0)).toHaveText('Apuntados (3 de 3 plazas)');
    // REQ-F-008 AC4 cláusula: "the lists do not change"
    await expect(organizacion(page).locator('li')).toHaveText(['1. Marta', '2. Pablo', '3. Lucía', '1. Álex']);
    expect(await (await request.get('/api/taller')).json()).toEqual(antes);
    await expect(organizacion(page).locator('h3').nth(1)).toHaveText('Lista de espera (1)');
    await captura(page, testInfo, 'REQ-F-008 AC4', { ve: ['Apuntados (3 de 3 plazas)'] });
  });
});

test.describe('Dos navegadores independientes', () => {
  test('REQ-F-009 AC1 lo que apunta A lo ve B en Organización', async ({ page, browser }, testInfo) => {
    await page.goto('/');
    await apuntarse(page, 'Marta');
    await expect(mensaje(page)).toHaveText('Plaza confirmada para Marta');
    const b = await (await browser.newContext()).newPage();
    await b.goto('/#organizacion');
    // REQ-F-009 AC1: "GIVEN 2 plazas and nobody registered, and two separate browsers A and B WHEN "Marta" registers in browser A and browser B opens "Organización" THEN the user sees "1. Marta" in browser B"
    await expect(organizacion(b).locator('li').first()).toHaveText('1. Marta');
    await captura(b, testInfo, 'REQ-F-009 AC1', { ve: ['1. Marta'] });
    await b.context().close();
  });

  test('REQ-F-009 AC2 B amplía las plazas y A recarga y ve a Lucía apuntada', async ({ page, request, browser }, testInfo) => {
    await dado(request, ['Marta', 'Pablo']);
    await page.goto('/');
    await apuntarse(page, 'Lucía');
    await expect(mensaje(page)).toHaveText('Lucía, estás en la lista de espera en el puesto 1');
    const b = await (await browser.newContext()).newPage();
    await b.goto('/#organizacion');
    await cambiarPlazas(b, '3');
    await expect(organizacion(b).locator('h3').nth(0)).toHaveText('Apuntados (3 de 3 plazas)');
    await page.reload();
    // REQ-F-009 AC2: "GIVEN "Marta" and "Pablo" apuntados and "Lucía" registered in browser A on the waiting list WHEN the organizer in browser B sets "Plazas" to 3 and browser A reloads the page THEN the user sees "Apuntados (3 de 3 plazas)" and "3. Lucía" in browser A"
    await expect(apuntados(page)).toHaveText('Apuntados (3 de 3 plazas)');
    await expect(listaApuntados(page).locator('li').nth(2)).toContainText('3. Lucía');
    await captura(page, testInfo, 'REQ-F-009 AC2', { ve: ['Apuntados (3 de 3 plazas)', '3. Lucía'] });
    await b.context().close();
  });

  test('REQ-F-009 AC3 un navegador sin datos locales ve a Marta una sola vez', async ({ page, browser }, testInfo) => {
    await page.goto('/');
    await apuntarse(page, 'Marta');
    await expect(mensaje(page)).toHaveText('Plaza confirmada para Marta');
    const b = await (await browser.newContext({ storageState: { cookies: [], origins: [] } })).newPage();
    await b.goto('/');
    // REQ-F-009 AC3: "GIVEN "Marta" apuntada from browser A WHEN browser B's local storage is empty and it opens the page THEN the user sees "Apuntados (1 de 2 plazas)" and the list keeps one single "Marta""
    await expect(apuntados(b)).toHaveText('Apuntados (1 de 2 plazas)');
    await expect(listaApuntados(b).locator('li')).toHaveText(['1. Marta Darse de baja']);
    await captura(b, testInfo, 'REQ-F-009 AC3', { ve: ['Apuntados (1 de 2 plazas)', '1. Marta'] });
    await b.context().close();
  });
});
