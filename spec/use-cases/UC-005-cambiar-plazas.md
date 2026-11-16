# UC-005 — Cambiar el número de plazas

| Field | Value |
|---|---|
| Version | 1.0 / 2026-11-16 |
| Refs | REQ-F-008 (primary), REQ-F-006 (promoción); WF-001 pasos 1-8; API-001-04; INV-TAL-001, INV-TAL-004, INV-TAL-005, INV-TAL-006, INV-TAL-007, INV-STO-001, INV-STO-002; RN-001, RN-002, RN-006, RN-007, RN-008; SM-001; BDD-UC-005 |
| Actors | Primary: Organizadora. Secondary: almacén compartido (ENT-002) |
| Trigger | La organizadora escribe un valor en "Plazas" y pulsa "Cambiar plazas" en Organización |
| Priority / Status | Must / Approved |

La organizadora fija el número de plazas; si hay más plazas libres, entran por orden las personas de la lista de espera.

## Input / Output

```typescript
interface CambiarPlazasInput  { plazas: unknown /* texto o número; válido si Plazas (VO-002), RN-006 */ }
interface CambiarPlazasOutput { resultado: Resultado /* VO-004: 'plazas' | 'plazas-invalido' | 'plazas-minimo' */; taller: Taller }
```

## Preconditions
1. El taller cumple INV-TAL-001..008; Organización está abierta (RN-002).

## Postconditions
- Success: `plazas` guardadas (INV-TAL-006, INV-TAL-007); mientras haya plazas libres y espera, la primera persona pasa a apuntados (INV-TAL-004, SM-001) y se anota su aviso de plaza (RN-008); la espera se renumera (INV-TAL-005).
- Failure: plazas, apuntados y espera no cambian (INV-STO-001); error según la tabla.

## Main flow
1. Organizadora: escribe las plazas y pulsa "Cambiar plazas".
2. System: valida que son un entero ≥ `PLAZAS_MINIMAS` (RN-006, INV-TAL-006).
3. System: lee el estado y comprueba `plazas ≥ apuntados` (RN-001, INV-TAL-007).
4. System: guarda las plazas y promueve desde la espera hasta llenarlas (INV-TAL-001, INV-STO-002).
5. System: devuelve `plazas` y muestra apuntados, puesto y espera actualizados en Organización.

## Extensions
- 3a. El valor es igual a las plazas actuales (RN-007) → sin cambios en las listas; resume en 5. (AC-005-04)

## Exceptions & errors

| # | Step | Condition | Error code | Effect | AC |
|---|---|---|---|---|---|
| E1 | 2 | Texto no numérico, decimal o 0 | `E_PLAZAS_INVALIDO` | Estado intacto; se muestra el estado actual | AC-005-03 |
| E2 | 3 | Valor menor que el número de apuntados (RN-001) | `E_PLAZAS_BAJO_APUNTADOS` | Estado intacto; nadie pierde su plaza | AC-005-02 |
| E3 | 1 | Petición sin valor o mayor que `CUERPO_MAX_CHARS` | `E_SOLICITUD_INVALIDA` | Estado intacto; mensaje de red | AC-005-05 |
| E4 | 4 | El servidor no responde | `E_SERVIDOR_NO_DISPONIBLE` | Estado intacto; puede repetir | AC-005-06 |
| E5 | 3 | Un apuntarse y una reducción simultáneos | `E_PLAZAS_BAJO_APUNTADOS` si ya no caben | Se aplican una tras otra (INV-STO-002); se valida contra los apuntados vigentes | AC-005-07 |
