# Especificaciones derivadas

> Artefactos que no se trazan literalmente a un REQ. Tier 1 = comportamiento nuevo visible (necesita REQ o aceptación explícita). Tier 2 = detalle técnico derivado de un REQ existente.

| Métrica | Valor | Umbral | Estado |
|---|---|---|---|
| Tier 1 pendientes de REQ | 2 | ≤ 3 | PASS |
| Tier 1 aceptados sin REQ | 1 (RN-003) | — | Advisory |
| Tier 2 registrados | 9 | — | Info |

## Derivadas del ingeniero de especificaciones

| Artefacto | Tipo | Derivado de | Tier | Justificación | Estado |
|---|---|---|---|---|---|
| INV-TAL-001..008 | Invariante | REQ-F-002, REQ-F-003, REQ-F-005, REQ-F-008 | 2 | formaliza listas, puestos y plazas | Registrado |
| INV-TAL-101 | Invariante | REQ-F-006 | 2 | aviso solo tras una promoción (RN-008) | Registrado |
| INV-TAL-201 | Invariante | REQ-F-003 | 2 | el puesto es el tamaño de la espera | Registrado |
| INV-STO-001, INV-STO-002 | Invariante | REQ-C-002, REQ-F-009 | 2 | datos solo en servidor; operación sin cesión | Registrado |
| RN-001, RN-002, RN-004..RN-008 | Regla | REQ-F-005..008 | 2 | concretan comportamiento ya pedido | Registrado |
| `E_SERVIDOR_NO_DISPONIBLE`, `E_SOLICITUD_INVALIDA` (filas E de UC-001..005) | Flujo de excepción | REQ-C-002 | 2 | fallo del servidor o petición mal formada | Registrado |
| Escenarios de escritura simultánea (AC-002-10, AC-003-07, AC-005-07) | Excepción | REQ-F-002, REQ-F-005, REQ-F-008 | 2 | consumo simultáneo de la última plaza (INV-STO-002) | Registrado |
| RN-003 / resultado `duplicado` | Regla + resultado | REQ-F-002 AC3, REQ-F-003 AC3 | 1 | criterio de igualdad de nombres | ACEPTADA (RN-003) |
| Aviso con nombre recordado que ya no figura en ninguna lista | Comportamiento | REQ-F-006 | 1 | ningún REQ lo cubre; no especificado | **[PENDING REQ]** |
| Organización con cero apuntados | Mensaje | REQ-F-007 | 1 | sin literal en los REQ; no especificado | **[PENDING REQ]** |

## Derivadas por auditoría
None.

## Registro de resolución
None.
