# UC-001 — Ver el taller y sus listas

| Field | Value |
|---|---|
| Version | 1.0 / 2026-11-16 |
| Refs | REQ-F-001 (primary), REQ-F-006 (aviso al reabrir), REQ-F-009; WF-001 steps 1, 3, 7, 8; API-001-01; INV-TAL-005, INV-TAL-101, INV-STO-001; RN-005, RN-008; ADR-001, ADR-005; ENT-003; BDD-UC-001 |
| Actors | Primary: Persona. Secondary: Almacén compartido (ENT-002), Dispositivo (ENT-003) |
| Trigger | La persona abre o recarga la página principal |
| Priority / Status | Must / Approved |

La persona ve el título, las plazas y las dos listas tal como quedaron tras el último cambio desde cualquier dispositivo; si fue promovida desde la espera, ve el aviso de plaza.

## Input / Output

```typescript
interface VerTallerInput  { /* sin datos: el nombre recordado nunca se envía */ }
interface VerTallerOutput { taller: Taller /* ENT-001 */ }
// Aviso de plaza: se decide en el dispositivo con ENT-003 (RN-008)
```

## Preconditions
1. El almacén compartido es accesible (INV-STO-001); sin estado previo, `plazas` = `PLAZAS_INICIALES` (RN-005).

## Postconditions
- Success: la pantalla muestra título, plazas, apuntados y lista de espera con su puesto (INV-TAL-005); si hubo promoción, el aviso de plaza; ENT-003 guarda el último estado visto.
- Failure: el estado compartido y ENT-003 quedan sin cambios (INV-STO-001); error según Exceptions.

## Main flow
1. Persona: abre o recarga la página principal.
2. System: lee el estado compartido (API-001-01, INV-STO-001).
3. System: muestra título, `Apuntados ({n} de {plazas} plazas)` y `Lista de espera ({n})` con sus nombres.
4. System: compara ENT-003 con las listas (RN-008, INV-TAL-101).
5. System: guarda en ENT-003 el estado actual del nombre recordado.

## Extensions
- 4a. El nombre recordado estaba en espera y ahora figura en apuntados → muestra el aviso de plaza; sigue en 5. (AC-001-03, AC-001-04)
- 4b. El nombre recordado sigue en la lista de espera → muestra su puesto; sigue en 5. (AC-001-05)
- 4c. El nombre recordado ya estaba en apuntados → sin aviso. (AC-001-06)
- 2a. Otro dispositivo cambió las plazas o las listas → se muestran los valores más recientes. (AC-001-07)
- 2b. El dispositivo no tiene datos locales → se muestran las mismas listas. (AC-001-08)
- 3a. Lista de espera sin nombres → muestra `Lista de espera (0)`. (AC-001-02)

## Exceptions & errors

| # | Step | Condition | Error code | Effect | AC |
|---|---|---|---|---|---|
| E1 | 2 | El servidor no responde | `E_SERVIDOR_NO_DISPONIBLE` | No se muestran listas; ENT-003 intacto; la persona puede recargar | AC-001-09 |

## Open questions
<!-- [NEEDS CLARIFICATION] NC-101: ¿el aviso de plaza se vuelve a mostrar en reaperturas posteriores o solo una vez? -->
