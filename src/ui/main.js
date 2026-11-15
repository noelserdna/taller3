// Pantallas del taller: principal (participantes) y Organización. Las listas viven en el servidor (REQ-F-009);
// el navegador solo recuerda { nombre, estado } de quien se apuntó (D-PA-004).
import { etiquetas, formatear, mensajes, textoResultado } from '../messages.js';

const CLAVE = 'taller:participante';

const el = (etiqueta, props = {}, ...hijos) => {
  const nodo = Object.assign(document.createElement(etiqueta), props);
  nodo.append(...hijos);
  return nodo;
};

async function pedir(ruta, cuerpo) {
  const opciones = cuerpo === undefined
    ? {}
    : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) };
  const respuesta = await fetch(ruta, opciones);
  return respuesta.json();
}

function recordado() {
  try { return JSON.parse(localStorage.getItem(CLAVE)); } catch { return null; }
}
function recordar(nombre, estado) {
  localStorage.setItem(CLAVE, JSON.stringify({ nombre, estado }));
}
const mismo = (a, b) => a.trim().toLocaleLowerCase('es') === b.trim().toLocaleLowerCase('es');

function titulos(estado) {
  return {
    apuntados: formatear(etiquetas.apuntados, { n: estado.apuntados.length, plazas: estado.plazas }),
    espera: formatear(etiquetas.espera, { n: estado.espera.length }),
  };
}

function lista(nombres, conBaja, alDarDeBaja) {
  return el('ul', {}, ...nombres.map((nombre, i) => {
    const li = el('li', {}, el('span', { textContent: `${i + 1}. ${nombre}` }));
    if (conBaja) {
      li.append(' ', el('button', { type: 'button', textContent: etiquetas.darseDeBaja, onclick: () => alDarDeBaja(nombre) }));
    }
    return li;
  }));
}

function pintarPrincipal(raiz, estado, mensaje, acciones) {
  const t = titulos(estado);
  const campo = el('input', { id: 'nombre', name: 'nombre', type: 'text', autocomplete: 'off' });
  const formulario = el('form', { onsubmit: (e) => { e.preventDefault(); acciones.apuntar(campo.value); } },
    el('label', { htmlFor: 'nombre', textContent: etiquetas.nombre }), ' ', campo, ' ',
    el('button', { type: 'submit', textContent: etiquetas.apuntarme }));
  raiz.replaceChildren(
    el('h1', { textContent: etiquetas.titulo }),
    el('p', {}, el('a', { href: '#organizacion', textContent: etiquetas.organizacion })),
    formulario,
    el('p', { id: 'mensaje', role: 'status', textContent: mensaje }),
    el('h2', { textContent: t.apuntados }),
    lista(estado.apuntados, true, acciones.darDeBaja),
    el('h2', { textContent: t.espera }),
    estado.espera.length === 0 ? el('p') : lista(estado.espera, true, acciones.darDeBaja),
  );
}

function pintarOrganizacion(raiz, estado, error, acciones) {
  const t = titulos(estado);
  const campo = el('input', { id: 'plazas', name: 'plazas', type: 'text', inputMode: 'numeric', autocomplete: 'off' });
  const formulario = el('form', { onsubmit: (e) => { e.preventDefault(); acciones.cambiarPlazas(campo.value); } },
    el('label', { htmlFor: 'plazas', textContent: etiquetas.plazas }), ' ', campo, ' ',
    el('button', { type: 'submit', textContent: etiquetas.cambiarPlazas }));
  raiz.replaceChildren(
    el('h2', { textContent: etiquetas.organizacion }),
    formulario,
    el('p', { id: 'error-plazas', role: 'alert', textContent: error }),
    el('h3', { textContent: t.apuntados }),
    lista(estado.apuntados, false),
    el('h3', { textContent: t.espera }),
    estado.espera.length === 0
      ? el('p', { textContent: mensajes.sinEspera })
      : lista(estado.espera, false),
  );
}


export async function iniciar(principal, organizacion) {
  let estado = await pedir('/api/taller');
  let mensaje = '';
  let error = '';

  const pintar = () => {
    pintarPrincipal(principal, estado, mensaje, acciones);
    pintarOrganizacion(organizacion, estado, error, acciones);
  };
  const aplicar = (respuesta) => {
    estado = { plazas: respuesta.plazas, apuntados: respuesta.apuntados, espera: respuesta.espera };
    return respuesta.resultado;
  };

  const acciones = {
    async apuntar(nombre) {
      const resultado = aplicar(await pedir('/api/apuntar', { nombre }));
      mensaje = textoResultado(resultado);
      error = '';
      if (resultado.tipo === 'confirmada') recordar(resultado.nombre, 'apuntado');
      if (resultado.tipo === 'espera') recordar(resultado.nombre, 'espera');
      pintar();
    },
    async darDeBaja(nombre) {
      const resultado = aplicar(await pedir('/api/baja', { nombre }));
      mensaje = textoResultado(resultado);
      error = '';
      pintar();
    },
    async cambiarPlazas(valor) {
      const resultado = aplicar(await pedir('/api/plazas', { plazas: valor }));
      error = ['plazas-minimo', 'plazas-invalido'].includes(resultado.tipo) ? textoResultado(resultado) : '';
      mensaje = '';
      pintar();
    },
  };

  // Al abrir: si quien se apuntó pasó de la espera a una plaza, se le avisa; si sigue esperando, ve su puesto.
  const guardado = recordado();
  if (guardado?.nombre) {
    const puesto = estado.espera.findIndex((n) => mismo(n, guardado.nombre)) + 1;
    const apuntado = estado.apuntados.find((n) => mismo(n, guardado.nombre));
    if (apuntado && guardado.estado === 'espera') {
      mensaje = textoResultado({ tipo: 'confirmada', nombre: apuntado });
      recordar(guardado.nombre, 'apuntado');
    } else if (puesto > 0) {
      mensaje = textoResultado({ tipo: 'espera', nombre: estado.espera[puesto - 1], puesto });
    } else if (!apuntado) {
      localStorage.removeItem(CLAVE);
    }
  }
  pintar();
}

if (typeof document !== 'undefined' && document.getElementById('principal')) {
  iniciar(document.getElementById('principal'), document.getElementById('organizacion'));
}
