// Catálogo único de textos de la interfaz (REQ-C-001, REQ-NF-001). Frases neutras: no suponen el género de la persona.
export const mensajes = {
  confirmada: 'Plaza confirmada para {nombre}',
  espera: '{nombre}, estás en la lista de espera en el puesto {posicion}',
  duplicado: '{nombre} ya está en el taller',
  baja: 'Baja registrada para {nombre}',
  vacio: 'Escribe un nombre para apuntarte',
  plazasMinimo: 'No se pueden reducir las plazas por debajo de {n} personas apuntadas',
  plazasInvalido: 'Indica un número de plazas de 1 o más',
  sinEspera: 'Nadie en la lista de espera',
};

// Etiquetas fijas de las pantallas.
export const etiquetas = {
  titulo: 'Taller de cerámica',
  apuntados: 'Apuntados ({n} de {plazas} plazas)',
  espera: 'Lista de espera ({n})',
  nombre: 'Nombre',
  apuntarme: 'Apuntarme',
  darseDeBaja: 'Darse de baja',
  organizacion: 'Organización',
  plazas: 'Plazas',
  cambiarPlazas: 'Cambiar plazas',
  errorRed: 'No se pudo contactar con el servidor',
};

export function formatear(plantilla, valores = {}) {
  return plantilla.replace(/\{(\w+)\}/g, (_, clave) => String(valores[clave] ?? ''));
}

// Texto de un resultado del dominio: { tipo, nombre?, puesto?, n? }
export function textoResultado(resultado) {
  if (!resultado) return '';
  const { tipo, nombre, puesto, n } = resultado;
  const plantilla = {
    confirmada: mensajes.confirmada,
    espera: mensajes.espera,
    duplicado: mensajes.duplicado,
    baja: mensajes.baja,
    vacio: mensajes.vacio,
    'plazas-minimo': mensajes.plazasMinimo,
    'plazas-invalido': mensajes.plazasInvalido,
  }[tipo];
  return plantilla ? formatear(plantilla, { nombre, posicion: puesto, n }) : '';
}
