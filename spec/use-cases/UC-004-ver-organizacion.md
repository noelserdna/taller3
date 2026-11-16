# UC-004 — Ver apuntados y espera (Organización)

| Field | Value |
|---|---|
| Version | 1.0 / 2026-11-16 |
| Refs | REQ-F-007 (primary), REQ-F-009; WF-001 steps 1, 3, 7, 8; API-001-01; INV-TAL-005, INV-STO-001; RN-002; ADR-003; BDD-UC-004 |
| Actors | Primary: Organizadora. Secondary: Almacén compartido (ENT-002) |
| Trigger | La organizadora abre la sección Organización |
| Priority / Status | Must / Approved |

La organizadora ve de un vistazo apuntados y lista de espera en orden, también cuando alguien se apuntó desde otro dispositivo.

## Input / Output

```typescript
interface VerOrganizacionInput  { /* sin datos; sin credenciales (RN-002) */ }
interface VerOrganizacionOutput { apuntados: Nombre[]; espera: Nombre[] /* puesto = índice + 1, INV-TAL-005 */ }
```

## Preconditions
1. El almacén compartido es accesible (INV-STO-001).

## Postconditions
- Success: la sección muestra ambas listas en orden con `{posicion}. {nombre}`; el estado compartido queda intacto.
- Failure: no se muestran listas; estado intacto (INV-STO-001); error según Exceptions.

## Main flow
1. Organizadora: abre la sección Organización.
2. System: lee el estado compartido (API-001-01, RN-002).
3. System: muestra apuntados y lista de espera, cada nombre con su posición (INV-TAL-005).

## Extensions
- 2a. Un cambio vino de otro dispositivo → se muestra el último estado guardado. (AC-004-03)
- 3a. Lista de espera sin nombres → muestra `Nadie en la lista de espera`. (AC-004-02)

## Exceptions & errors

| # | Step | Condition | Error code | Effect | AC |
|---|---|---|---|---|---|
| E1 | 2 | El servidor no responde | `E_SERVIDOR_NO_DISPONIBLE` | No se muestran listas; la organizadora puede reabrir la sección | AC-004-04 |
