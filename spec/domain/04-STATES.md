# 04 — Máquinas de estado

## SM-001: Persona en el taller (por nombre)

| Estado | Inicial | Final | Descripción |
|---|---|---|---|
| fuera | Sí | Sí | El nombre no está en ninguna lista |
| en espera | No | No | En la lista de espera, con puesto |
| apuntada | No | No | En apuntados, con plaza confirmada |

| Desde | A | Disparador | Guarda | Acción | Plazo |
|---|---|---|---|---|---|
| fuera | apuntada | apuntarse | apuntados < plazas | alta al final de apuntados (INV-TAL-001) | — |
| fuera | en espera | apuntarse | apuntados = plazas | alta al final de la espera, puesto = tamaño (INV-TAL-005) | — |
| en espera | apuntada | promoción | alguien se da de baja o aumentan las plazas, y es la primera de la espera | pasa a apuntados; el resto avanza un puesto | — |
| apuntada | fuera | darse de baja | — | quita el nombre; dispara promoción (INV-TAL-004) | — |
| en espera | fuera | darse de baja | — | quita el nombre; renumera la espera | — |
| fuera | fuera | darse de baja | nombre inexistente | sin cambios (INV-TAL-008) | — |
| apuntada, en espera | igual | apuntarse | nombre ya presente | sin cambios, resultado duplicado (INV-TAL-002) | — |

Refs: INV-TAL-001..008, UC-002, UC-003, UC-005.
