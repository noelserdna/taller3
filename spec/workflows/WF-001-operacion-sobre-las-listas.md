# WF-001 — Ciclo de una operación sobre las listas compartidas

| Field | Value |
|---|---|
| Trigger | la persona o la organizadora envía un formulario, pulsa "Darse de baja" o abre la página |
| Actors | Persona, Organizadora, servidor de la aplicación |
| Refs | REQ-F-001..009, REQ-C-002; UC-001..UC-005; API-001-01..04; INV-STO-001, INV-STO-002; ADR-001, ADR-002 |

## Steps

| # | Name | Type | On failure | Used by |
|---|---|---|---|---|
| 1 | recibir la petición | sync | `E_SERVIDOR_NO_DISPONIBLE` → se muestra "No se pudo contactar con el servidor" | UC-001..005 |
| 2 | validar la entrada | sync | `E_SOLICITUD_INVALIDA`, `E_NOMBRE_VACIO`, `E_PLAZAS_INVALIDO`: estado intacto | UC-002, UC-003, UC-005 |
| 3 | leer el estado compartido | sync | `E_SERVIDOR_NO_DISPONIBLE` | UC-001..005 |
| 4 | aplicar la regla del taller | sync | `E_PLAZAS_BAJO_APUNTADOS`: estado intacto; duplicado y baja repetida: sin cambios | UC-002, UC-003, UC-005 |
| 5 | promover desde la espera | sync | — | UC-003, UC-005 |
| 6 | guardar el estado | sync | `E_SERVIDOR_NO_DISPONIBLE` | UC-002, UC-003, UC-005 |
| 7 | devolver estado y resultado | sync | — | UC-001..005 |
| 8 | mostrar el mensaje en pantalla | sync | — | UC-001..005 |

Pasos 3 a 6 forman una sola unidad sin cesión: dos peticiones simultáneas se aplican una tras otra (INV-STO-002). Si una escritura simultánea consumió la última plaza, la segunda persona entra en la lista de espera y ve su puesto (INV-TAL-004).

## Error scenarios

| Error | Step | Action | Result state |
|---|---|---|---|
| `E_SERVIDOR_NO_DISPONIBLE` | 1, 3, 6 | abortar | listas sin cambios |
| `E_SOLICITUD_INVALIDA` | 2 | abortar | listas sin cambios |
| `E_NOMBRE_VACIO` | 2 | abortar | listas sin cambios |
| `E_PLAZAS_INVALIDO` | 2 | abortar | listas sin cambios |
| `E_PLAZAS_BAJO_APUNTADOS` | 4 | abortar | listas sin cambios |
