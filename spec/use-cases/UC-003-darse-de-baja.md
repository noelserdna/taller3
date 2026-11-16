# UC-003 — Darse de baja

| Field | Value |
|---|---|
| Version | 1.0 / 2026-11-16 |
| Refs | REQ-F-005 (primary), REQ-F-006 (promoción); WF-001 pasos 1-8; API-001-03; INV-TAL-001, INV-TAL-002, INV-TAL-004, INV-TAL-005, INV-TAL-008, INV-STO-001, INV-STO-002; RN-004, RN-008; SM-001; BDD-UC-003 |
| Actors | Primary: Persona. Secondary: almacén compartido (ENT-002) |
| Trigger | La persona pulsa "Darse de baja" junto a un nombre de apuntados o de la lista de espera |
| Priority / Status | Must / Approved |

Cualquier persona quita un nombre de las listas y ve la baja registrada con las listas ya ajustadas.

## Input / Output

```typescript
interface DarDeBajaInput  { nombre: Nombre /* VO-001, RN-003 */ }
interface DarDeBajaOutput { resultado: Resultado /* VO-004: tipo 'baja' */; taller: Taller /* ENT-001 */ }
```

## Preconditions
1. El taller cumple INV-TAL-001..008.

## Postconditions
- Success: el nombre no figura en ninguna lista (INV-TAL-002); si salió de apuntados y había espera, la primera persona pasa a apuntados (INV-TAL-004, SM-001); la espera queda numerada desde 1 (INV-TAL-005); resultado `baja`.
- Failure: el estado guardado no cambia (INV-STO-001); error según la tabla.

## Main flow
1. Persona: pulsa "Darse de baja" junto a un nombre de la lista de espera.
2. System: comprueba que la petición trae un nombre (WF-001 paso 2).
3. System: lee el estado, quita el nombre comparando según RN-003 y renumera la espera (INV-TAL-005).
4. System: guarda y devuelve `baja` con las listas actualizadas (INV-STO-002).
5. System: muestra el mensaje de baja y las listas.

## Extensions
- 3a. El nombre estaba en la lista de espera con otras personas detrás → cada una avanza un puesto. (AC-003-02)
- 3b. El nombre estaba en apuntados y hay espera → la primera persona de la espera pasa a apuntados y se anota su aviso de plaza (RN-008); resume en 4. (AC-003-03)

## Exceptions & errors

| # | Step | Condition | Error code | Effect | AC |
|---|---|---|---|---|---|
| E1 | 2 | Petición sin nombre de texto o mayor que `CUERPO_MAX_CHARS` | `E_SOLICITUD_INVALIDA` | Estado intacto; se muestra el mensaje de red | AC-003-05 |
| E2 | 4 | El servidor no responde | `E_SERVIDOR_NO_DISPONIBLE` | Estado intacto; la persona puede repetir | AC-003-06 |
| E3 | 3 | Dos bajas simultáneas del mismo nombre | — | Se aplican una tras otra (INV-STO-002); ambas devuelven `baja` | AC-003-07 |
| E4 | 3 | Replay: el nombre ya no está (RN-004) | — | Sin cambios; mismo resultado `baja` (INV-TAL-008) | AC-003-04 |
