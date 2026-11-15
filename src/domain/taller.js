// Reglas puras del taller (D-PA-003): estado { plazas, apuntados[], espera[] } -> { estado, resultado }.
const clave = (nombre) => nombre.trim().toLocaleLowerCase('es');

export function estadoInicial(plazas = 10) {
  return { plazas, apuntados: [], espera: [] };
}

function promover(estado) {
  const apuntados = [...estado.apuntados];
  const espera = [...estado.espera];
  while (apuntados.length < estado.plazas && espera.length > 0) apuntados.push(espera.shift());
  return { plazas: estado.plazas, apuntados, espera };
}

export function apuntar(estado, nombreEntrada) {
  const nombre = String(nombreEntrada ?? '').trim();
  if (nombre === '') return { estado, resultado: { tipo: 'vacio' } };
  const k = clave(nombre);
  const existente = [...estado.apuntados, ...estado.espera].find((n) => clave(n) === k);
  if (existente !== undefined) return { estado, resultado: { tipo: 'duplicado', nombre: existente } };
  if (estado.apuntados.length < estado.plazas) {
    return {
      estado: { ...estado, apuntados: [...estado.apuntados, nombre] },
      resultado: { tipo: 'confirmada', nombre },
    };
  }
  const espera = [...estado.espera, nombre];
  return { estado: { ...estado, espera }, resultado: { tipo: 'espera', nombre, puesto: espera.length } };
}

export function darDeBaja(estado, nombreEntrada) {
  const nombre = String(nombreEntrada ?? '').trim();
  const k = clave(nombre);
  const fuera = (n) => clave(n) !== k;
  const sinNombre = {
    plazas: estado.plazas,
    apuntados: estado.apuntados.filter(fuera),
    espera: estado.espera.filter(fuera),
  };
  const nuevo = promover(sinNombre);
  const cambio = sinNombre.apuntados.length !== estado.apuntados.length || sinNombre.espera.length !== estado.espera.length;
  return { estado: cambio ? nuevo : estado, resultado: { tipo: 'baja', nombre } };
}

export function cambiarPlazas(estado, valor) {
  const texto = String(valor ?? '').trim();
  const plazas = /^\d+$/.test(texto) ? Number(texto) : 0;
  if (!Number.isSafeInteger(plazas) || plazas < 1) return { estado, resultado: { tipo: 'plazas-invalido' } };
  if (plazas < estado.apuntados.length) {
    return { estado, resultado: { tipo: 'plazas-minimo', n: estado.apuntados.length } };
  }
  if (plazas === estado.plazas) return { estado, resultado: { tipo: 'plazas', plazas } };
  return { estado: promover({ ...estado, plazas }), resultado: { tipo: 'plazas', plazas } };
}
