# FASE 0: Taller completo con listas compartidas

> **Estado:** Implementable
> **Incremento:** Cualquiera abre la web, se apunta o entra en la espera, se da de baja, y la organizadora gestiona plazas; todos ven las mismas listas
> **Requisitos:** REQ-F-001, REQ-F-002, REQ-F-003, REQ-F-004, REQ-F-005, REQ-F-006, REQ-F-007, REQ-F-008, REQ-F-009, REQ-NF-001, REQ-C-001, REQ-C-002
> **Escenarios:** REQ-F-001 AC1, REQ-F-001 AC2, REQ-F-002 AC1, REQ-F-002 AC2, REQ-F-002 AC3, REQ-F-003 AC1, REQ-F-003 AC2, REQ-F-003 AC3, REQ-F-004 AC1, REQ-F-005 AC1, REQ-F-005 AC2, REQ-F-005 AC3, REQ-F-006 AC1, REQ-F-006 AC2, REQ-F-006 AC3, REQ-F-006 AC4, REQ-F-007 AC1, REQ-F-007 AC2, REQ-F-008 AC1, REQ-F-008 AC2, REQ-F-008 AC3, REQ-F-008 AC4, REQ-F-009 AC1, REQ-F-009 AC2, REQ-F-009 AC3, REQ-NF-001 AC1, REQ-NF-001 AC2
> **Workflows:** —
> **Necesidades:** N-001, N-002, N-003, N-004, N-005, N-006, N-007, N-008, N-009, N-010
> **Dependencias:** Ninguna (fase inicial)

---

## Objetivo

Permitir que una **persona** vea el taller, se apunte o espere y se dé de baja, y que la **organizadora** vea las listas y cambie las plazas, con las mismas listas en todos los dispositivos. Un solo bloque serial.

## Criterios de Éxito

### Participante
- [ ] Portada con título y «Apuntados (n de p plazas)», «Lista de espera (n)» (REQ-F-001 AC1, REQ-F-001 AC2)
- [ ] Con plazas libres confirma la plaza y no duplica nombres (REQ-F-002 AC1, REQ-F-002 AC2, REQ-F-002 AC3)
- [ ] Con el taller lleno da puesto de espera y no duplica (REQ-F-003 AC1, REQ-F-003 AC2, REQ-F-003 AC3)
- [ ] Nombre vacío no apunta a nadie (REQ-F-004 AC1)
- [ ] Baja de apuntado o de espera, renumera, es idempotente (REQ-F-005 AC1, REQ-F-005 AC2, REQ-F-005 AC3)
- [ ] La baja de un apuntado promociona al primero de la espera y se le avisa al volver (REQ-F-006 AC1, REQ-F-006 AC2, REQ-F-006 AC3, REQ-F-006 AC4)

### Organización
- [ ] Muestra apuntados y espera en orden (REQ-F-007 AC1, REQ-F-007 AC2)
- [ ] Cambia plazas con validación; ampliar promociona; mismo valor no cambia nada (REQ-F-008 AC1, REQ-F-008 AC2, REQ-F-008 AC3, REQ-F-008 AC4)

### Transversal
- [ ] Dos navegadores independientes ven las mismas listas (REQ-F-009 AC1, REQ-F-009 AC2, REQ-F-009 AC3)
- [ ] Ningún mensaje con género (REQ-NF-001 AC1, REQ-NF-001 AC2)
- [ ] Textos en español y stack Vite sin servicios externos (REQ-C-001, REQ-C-002)

## Specs a Leer

| Documento | Sección / ids | Para |
|-----------|---------------|------|
| `requirements/REQUIREMENTS.md` | REQ-F-001..009, REQ-NF-001, REQ-C-001..002 | criterios y mensajes exactos |
| `requirements/CUSTOMER-NEEDS.md` | N-001..N-010 | necesidades y fuera de alcance |
| `plan/PLAN.md` | §2, §3 (D-PA-001..006) | decisiones técnicas |

## Invariantes Aplicables

Sin invariantes formales (especificaciones omitidas). Restricciones: REQ-C-001 (catálogo de textos), REQ-C-002 (sin almacenamiento local para listas ni hosts externos).

## Módulos y Conjuntos de Escritura

| Bloque | Módulo / directorio | Escribe (write-set) | No escribe | Depende de |
|--------|---------------------|---------------------|------------|------------|
| base | — | `package.json`, `vite.config.js`, `vitest.config.js`, `index.html` | — | — |
| A | todo `src/` | `src/domain/**`, `src/server/**`, `src/ui/**`, `src/messages.js`, `tests/**` | `requirements/**` | base |

## Contratos Resultantes

| Contrato | Firma / Ruta | Descripción |
|----------|--------------|-------------|
| D-PA-001 | `GET /api/taller` | Estado `{plazas, apuntados, espera}` |
| D-PA-001 | `POST /api/apuntar {nombre}` | `resultado`: confirmada · espera(puesto) · duplicado · vacío |
| D-PA-001 | `POST /api/baja {nombre}` | Quita, promociona, renumera; idempotente |
| D-PA-001 | `POST /api/plazas {plazas}` | Valida (entero ≥ 1, ≥ apuntados), promociona al ampliar |

## Entregables de UI

| Ruta | Componente | Requisitos | Descripción |
|------|------------|------------|-------------|
| `/` | `src/ui/main.js` · sección principal | REQ-F-001..006 | Listas, formulario «Nombre»/«Apuntarme», «Darse de baja» |
| `/#organizacion` | sección Organización | REQ-F-007, REQ-F-008 | Listas en orden, «Plazas»/«Cambiar plazas» |

## Verificación

```bash
npm test                                   # unitarios, API y catálogo en verde
npx vitest run tests/api.test.js --maxWorkers=2   # dos clientes ven lo mismo (REQ-F-009)
npx vite --host 127.0.0.1 --port 5173      # arranca y sirve / y /api/taller
```

## Demo

> Desde un checkout limpio: `npm install` · `npx vite --host 127.0.0.1 --port 5173` (datos iniciales: 10 plazas; para la demo con 2 plazas, `TALLER_PLAZAS=2`).

| # | Acción | Resultado esperado | Escenario |
|---|--------|--------------------|-----------|
| 1 | Abrir `/` | «Taller de cerámica», «Apuntados (0 de 2 plazas)», «Lista de espera (0)» | REQ-F-001 AC1, REQ-F-001 AC2 · N-001 |
| 2 | Apuntar «Marta» y «Pablo» | «Plaza confirmada para Marta», «1. Marta», «Apuntados (2 de 2 plazas)» | REQ-F-002 AC1, REQ-F-002 AC2 · N-002, N-003 |
| 3 | Apuntar «Lucía» y «Álex»; repetir «Lucía» | «Lucía, estás en la lista de espera en el puesto 1»; «Lucía ya está en el taller» | REQ-F-003 AC1, REQ-F-003 AC2, REQ-F-003 AC3 · N-004 |
| 4 | Enviar nombre en blanco | «Escribe un nombre para apuntarte» | REQ-F-004 AC1 · N-002 |
| 5 | En otro navegador abrir `#organizacion` | «1. Marta», «2. Pablo», «1. Lucía», «2. Álex» | REQ-F-007 AC1, REQ-F-009 AC1 · N-007, N-010 |
| 6 | Darse de baja «Pablo»; Lucía reabre la página | «Baja registrada para Pablo»; «Plaza confirmada para Lucía» | REQ-F-005 AC1, REQ-F-006 AC1 · N-005, N-006 |
| 7 | Baja de «Álex» | «Baja registrada para Álex» | REQ-F-005 AC1 · N-005 |
| 8 | Organización: plazas 1; luego «abc»; luego 3 | Errores de plazas; «Apuntados (3 de 3 plazas)» | REQ-F-008 AC2, REQ-F-008 AC3, REQ-F-008 AC1 · N-008 |

## Alcance

| Incluye | Excluye |
|---------|---------|
| Todos los REQ-F, REQ-NF-001 y las restricciones | Cuentas, autenticación, avisos externos (fuera de alcance del cliente) |

---

## Plan de la FASE

### Test Coverage Map

| Source File | Type | Test File | Priority |
|-------------|------|-----------|----------|
| `src/domain/taller.js` | logic | `tests/domain.test.js` (A) | HIGH |
| `src/server/store.js` | service | `tests/store.test.js` (A) | HIGH |
| `src/server/api.js` | service | `tests/api.test.js` (A) | HIGH |
| `src/messages.js` | logic | `tests/messages.test.js` (A) | HIGH |
| `src/ui/main.js` | page | `tests/ui.test.js` (A) | MEDIUM |
| `vite.config.js` + `package.json` | infrastructure | `tests/constraints.test.js` (A) | MEDIUM |

**Exclusions (no unit test needed):**

| File | Reason |
|------|--------|
| `index.html` | estructura estática; cubierta por `tests/ui.test.js` |

### Notas de implementación

- `taller.js`: `apuntar`, `darDeBaja`, `cambiarPlazas` puras sobre `{plazas, apuntados[], espera[]}`; devuelven nuevo estado y `resultado`. Promoción al quitar apuntado o ampliar plazas.
- `store.js`: carga/guarda `data/taller.json` (o `TALLER_DATA`); estado inicial 10 plazas (o `TALLER_PLAZAS`).
- `api.js`: middleware de Vite (`configureServer`), JSON, errores 400 con `resultado`; `vite.config.js` lo registra.
- `ui/main.js`: `fetch` solo al mismo origen; `localStorage` solo `{nombre, estado}`.
- Tests de dos clientes: dos instancias de `fetch` sin estado común contra la misma app (REQ-F-009).

Puertos con doble: ninguno (sin sistemas externos).
