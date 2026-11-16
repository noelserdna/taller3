# API-taller

| Field | Value |
|---|---|
| Module | API-001 (operaciones `API-001-NN`) |
| Style | operations |
| Auth | Not applicable — Organización abierta, sin cuentas (RN-002, ADR-003) |
| Refs | REQ-F-001..009, REQ-C-002; UC-001..UC-005; WF-001; ADR-001, ADR-002 |
| Errors | catálogo en `domain/03-VALUE-OBJECTS.md` § Catálogo de errores |
| Transport | ver `design/OPERATION-MAPPING.md` |

## Operaciones

| ID | Operación | Actor | Entrada (VO) | Efecto / post (INV) | Errores de dominio | UC |
|---|---|---|---|---|---|---|
| API-001-01 | verTaller | Persona, Organizadora | — | devuelve plazas, apuntados y espera con puestos; no cambia el estado (INV-TAL-005, INV-STO-001) | `E_SERVIDOR_NO_DISPONIBLE` | UC-001, UC-004 |
| API-001-02 | apuntar | Persona | nombre: Nombre (VO-001) | confirmada al final de apuntados, o espera con puesto, o duplicado sin cambios (INV-TAL-001..005, INV-TAL-201, RN-003) | `E_NOMBRE_VACIO`, `E_SOLICITUD_INVALIDA`, `E_SERVIDOR_NO_DISPONIBLE` | UC-002 |
| API-001-03 | darDeBaja | Persona, Organizadora | nombre: Nombre (VO-001) | nombre fuera de ambas listas; promueve a la primera de la espera; renumera; repetir no cambia nada (INV-TAL-004, INV-TAL-005, INV-TAL-008, RN-004) | `E_SOLICITUD_INVALIDA`, `E_SERVIDOR_NO_DISPONIBLE` | UC-003 |
| API-001-04 | cambiarPlazas | Organizadora | plazas: Plazas (VO-002) | plazas guardadas y promoción hasta llenarlas; mismo valor sin cambios (INV-TAL-004, INV-TAL-006, INV-TAL-007, RN-001, RN-006, RN-007) | `E_PLAZAS_INVALIDO`, `E_PLAZAS_BAJO_APUNTADOS`, `E_SOLICITUD_INVALIDA`, `E_SERVIDOR_NO_DISPONIBLE` | UC-005 |

Cada operación que escribe devuelve el estado completo del taller y un `Resultado` (VO-004); lee, decide y guarda sin cesión (INV-STO-002). Entrada mayor que `CUERPO_MAX_CHARS` → `E_SOLICITUD_INVALIDA`.

## Errores

| Código | Operaciones | Condición | Mensaje (VO) |
|---|---|---|---|
| `E_NOMBRE_VACIO` | 02 | nombre vacío o solo espacios | VO-006 |
| `E_PLAZAS_INVALIDO` | 04 | plazas no numéricas, decimales o 0 | VO-006 |
| `E_PLAZAS_BAJO_APUNTADOS` | 04 | plazas menores que las personas apuntadas | VO-006 |
| `E_SOLICITUD_INVALIDA` | 02, 03, 04 | entrada mal formada o mayor que `CUERPO_MAX_CHARS` | VO-006 |
| `E_SERVIDOR_NO_DISPONIBLE` | 01, 02, 03, 04 | el servidor o el almacén no responde | VO-006 |
