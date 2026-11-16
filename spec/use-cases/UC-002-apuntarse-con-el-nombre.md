# UC-002 — Apuntarse con el nombre

| Field | Value |
|---|---|
| Version | 1.0 / 2026-11-16 |
| Refs | REQ-F-002 (primary), REQ-F-003, REQ-F-004; WF-001 steps 1–8; API-001-02; INV-TAL-001, INV-TAL-002, INV-TAL-003, INV-TAL-004, INV-TAL-005, INV-TAL-201, INV-STO-001, INV-STO-002; RN-003; ADR-001, ADR-004; SM-001; BDD-UC-002 |
| Actors | Primary: Persona. Secondary: almacén compartido (ENT-002) |
| Trigger | La persona escribe su nombre y pulsa "Apuntarme" |
| Priority / Status | Must / Approved |

La persona obtiene plaza confirmada, o puesto en la lista de espera si el taller está lleno; si su nombre ya está en el taller, se le informa sin duplicarlo.

## Input / Output

```typescript
interface ApuntarInput  { nombre: string /* VO-001, tras recortar: INV-TAL-003; longitud total ≤ CUERPO_MAX_CHARS */ }
interface ApuntarOutput { resultado: Resultado /* VO-004: confirmada | espera | duplicado | vacio */; taller: Taller /* ENT-001 */ }
```

## Preconditions
1. El almacén compartido contiene un taller válido (INV-TAL-001, INV-TAL-004).

## Postconditions
- Success: el nombre queda al final de apuntados (confirmada) o de la espera (espera) y aparece una sola vez (INV-TAL-002, INV-TAL-005); se devuelve el resultado y el taller actualizado.
- Duplicado: listas sin cambios (INV-TAL-002); resultado `duplicado` con el nombre ya guardado (RN-003).
- Failure: listas sin cambios (INV-STO-001); error según la tabla.

## Main flow
1. Persona: escribe un nombre en "Nombre" y pulsa "Apuntarme".
2. System: recibe la petición y valida la entrada (WF-001 1–2; INV-TAL-003).
3. System: lee el taller compartido (WF-001 3; INV-STO-002).
4. System: si el nombre no está en ninguna lista y apuntados < plazas, lo añade al final de apuntados; resultado `confirmada` (RN-003, INV-TAL-001). (AC-002-01, AC-002-02)
5. System: guarda y devuelve resultado y taller (WF-001 6–7).
6. System: muestra el mensaje y las listas (WF-001 8; ADR-004).

## Extensions
- 4a. Nombre no repetido y apuntados = plazas → alta al final de la espera, puesto = posición + 1; resultado `espera` (INV-TAL-005, INV-TAL-201). (AC-002-04, AC-002-05)
- 4b. Nombre ya presente en apuntados o espera (RN-003) → sin cambios; resultado `duplicado`; resume at 6. (AC-002-03, AC-002-06)

## Exceptions & errors

| # | Step | Condition | Error code | Effect | AC |
|---|---|---|---|---|---|
| E1 | 2 | Nombre vacío o solo espacios | `E_NOMBRE_VACIO` | Listas sin cambios (INV-TAL-003); se pide un nombre | AC-002-07 |
| E2 | 2 | Entrada mal formada o mayor que `CUERPO_MAX_CHARS` | `E_SOLICITUD_INVALIDA` | Listas sin cambios; la persona puede reintentar | AC-002-08 |
| E3 | 3 | Servidor o almacén no accesible | `E_SERVIDOR_NO_DISPONIBLE` | Listas sin cambios; la persona puede reintentar | AC-002-09 |
| E4 | 4 | Dos peticiones simultáneas por la última plaza | `—` | Se aplican una tras otra (INV-STO-002): la primera queda `confirmada`, la segunda `espera` en el puesto 1 | AC-002-10 |
| E5 | 4 | Replay: mismo nombre enviado de nuevo | `—` | Resultado `duplicado`; no se añade segunda entrada (INV-TAL-002) | AC-002-03, AC-002-06 |

## Open questions
None.
