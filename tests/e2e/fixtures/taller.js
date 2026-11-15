// Preparación del estado compartido con la API pública: se vacían las listas y se parte de 2 plazas.
export async function reiniciar(request) {
  const estado = await (await request.get('/api/taller')).json();
  for (const nombre of [...estado.espera, ...estado.apuntados]) await request.post('/api/baja', { data: { nombre } });
  await request.post('/api/plazas', { data: { plazas: 2 } });
}

// Apunta en orden: con 2 plazas, los dos primeros quedan apuntados y el resto en la espera.
export async function dado(request, nombres, plazas = 2) {
  await reiniciar(request);
  if (plazas !== 2) await request.post('/api/plazas', { data: { plazas } });
  for (const nombre of nombres) await request.post('/api/apuntar', { data: { nombre } });
}

export async function apuntarse(page, nombre) {
  await page.getByLabel('Nombre').fill(nombre);
  await page.getByRole('button', { name: 'Apuntarme' }).click();
}

export async function cambiarPlazas(page, valor) {
  await page.getByLabel('Plazas').fill(valor);
  await page.getByRole('button', { name: 'Cambiar plazas' }).click();
}

export async function darDeBaja(page, nombre) {
  await page.locator('#principal li').filter({ hasText: nombre }).getByRole('button', { name: 'Darse de baja' }).click();
}
