# Spec id plan — taller3 — 2026-11-16 (working file; not part of spec/)
Mode: fanout · lanes: R1 R2 R3 X · model: sonnet · language: español (ids/código en inglés)
Contract: API-001 = `taller` (file contracts/API-taller.md) · Style operations (no REQ demands an HTTP API for external clients). Domain area for INV: TAL (taller), STO (almacén compartido), UIX (interfaz).

| Lane | REQs | UC ids + title | AC | API operations | INV mint | NC mint |
|---|---|---|---|---|---|---|
| R1 | REQ-F-001, REQ-F-006 (2.ª parte: aviso al reabrir), REQ-F-007, REQ-F-009 | UC-001 Ver el taller y sus listas; UC-004 Ver apuntados y espera (Organización) | AC-001-NN, AC-004-NN | API-001-01 verTaller (UC-001, UC-004) | INV-TAL-1NN | NC-1NN |
| R2 | REQ-F-002, REQ-F-003, REQ-F-004 | UC-002 Apuntarse con el nombre | AC-002-NN | API-001-02 apuntar | INV-TAL-2NN | NC-2NN |
| R3 | REQ-F-005, REQ-F-006 (1.ª parte: promoción), REQ-F-008 | UC-003 Darse de baja; UC-005 Cambiar el número de plazas | AC-003-NN, AC-005-NN | API-001-03 darDeBaja; API-001-04 cambiarPlazas | INV-TAL-3NN | NC-3NN |
| X | REQ-NF-001, REQ-C-001, REQ-C-002 | — | — | — | INV-TAL-4NN | NC-4NN |
| main | — | — | — | contract header, index, Errors table | INV-TAL-0NN | NC-0NN |

## Fixed skeletons
- WF-001 Ciclo de una operación sobre las listas compartidas. Steps: 1 recibir la petición · 2 validar la entrada · 3 leer el estado compartido · 4 aplicar la regla del taller · 5 promover desde la espera · 6 guardar el estado · 7 devolver estado y resultado · 8 mostrar mensaje en pantalla.
- ADR-001 datos compartidos en el servidor de la propia aplicación (fichero JSON, un proceso) · ADR-002 reglas del taller como funciones puras (estado → estado, resultado) · ADR-003 sin autenticación en Organización (RN-002) · ADR-004 catálogo único de textos y mensajes sin género · ADR-005 el navegador recuerda solo el nombre usado (aviso de promoción). Owner: X.
- States: SM-001 Persona en el taller (fuera → en espera → apuntada → fuera).
- Operación → resultado: apuntar → confirmada | espera | duplicado | vacio; darDeBaja → baja (siempre); cambiarPlazas → plazas | plazas-invalido | plazas-minimo.
- RN (phase B): RN-001 reducir plazas bajo apuntados → rechazar (Q-001). RN-002 Organización abierta sin contraseña (Q-002). RN-003 nombre: recortar espacios y comparar sin distinguir mayúsculas (case-insensitive, `toLocaleLowerCase('es')`); repetido → no se duplica y se informa. RN-004 baja de un nombre inexistente: sin cambios y mismo mensaje de baja. RN-005 plazas iniciales 10 (`PLAZAS_INICIALES`). RN-006 plazas: entero ≥ 1; texto no numérico o 0 → `E_PLAZAS_INVALIDO`. RN-007 mismo valor de plazas → sin cambios. RN-008 el aviso de plaza confirmada tras una promoción se muestra al reabrir en el mismo dispositivo.
- Error codes (catalog, phase B): E_NOMBRE_VACIO, E_PLAZAS_INVALIDO, E_PLAZAS_BAJO_APUNTADOS, E_SOLICITUD_INVALIDA, E_SERVIDOR_NO_DISPONIBLE. Duplicado y baja repetida NO son errores (resultado normal).
- Invariants (phase B, in 05-INVARIANTS): INV-TAL-001 apuntados ≤ plazas · 002 nombre único entre apuntados y espera (RN-003) · 003 nombre recortado y no vacío · 004 espera no vacía ⇒ apuntados llenos · 005 orden de llegada en la espera, puesto = posición + 1 · 006 plazas entero ≥ 1 · 007 plazas ≥ nº apuntados · 008 baja idempotente (RN-004) · INV-STO-001 estado compartido solo en el servidor (REQ-C-002) · INV-STO-002 cada operación lee, decide y guarda sin interrupción (sin cesión).
- Values (VALUE-REGISTRY): PLAZAS_INICIALES=10, PLAZAS_MINIMAS=1, CUERPO_MAX_CHARS=10000.
