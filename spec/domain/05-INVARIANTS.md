# 05 — Invariantes

> Áreas: TAL (taller), STO (almacén compartido). Puntos de cumplimiento: DOM (reglas puras), API (servidor), UI.

| ID | Regla | Cumplida en | UCs | Error de violación | Validación |
|---|---|---|---|---|---|
| INV-TAL-001 | `apuntados.length ≤ plazas` | DOM | UC-002, UC-003, UC-005 | — (no se llega a violar) | `t.apuntados.length <= t.plazas` |
| INV-TAL-002 | Un nombre aparece una sola vez entre apuntados y espera, sin distinguir mayúsculas ni espacios de los extremos (RN-003) | DOM | UC-002, UC-003 | resultado `duplicado` | `new Set([...a, ...e].map(clave)).size === a.length + e.length` |
| INV-TAL-003 | Todo nombre guardado está recortado y no vacío | DOM | UC-002 | `E_NOMBRE_VACIO` | `n === n.trim() && n.length >= 1` |
| INV-TAL-004 | Si la lista de espera no está vacía, los apuntados llenan todas las plazas (la promoción es inmediata) | DOM | UC-002, UC-003, UC-005 | — | `t.espera.length === 0 \|\| t.apuntados.length === t.plazas` |
| INV-TAL-005 | La espera conserva el orden de llegada; `puesto = índice + 1` y se renumera al salir alguien | DOM, UI | UC-001, UC-002, UC-003, UC-004 | — | puesto de `espera[i]` = `i + 1` |
| INV-TAL-006 | `plazas` es un entero seguro ≥ `PLAZAS_MINIMAS` (RN-006) | DOM | UC-005 | `E_PLAZAS_INVALIDO` | `Number.isSafeInteger(p) && p >= 1` |
| INV-TAL-007 | `plazas ≥ apuntados.length` tras cambiar plazas (RN-001) | DOM | UC-005 | `E_PLAZAS_BAJO_APUNTADOS` | `p >= t.apuntados.length` |
| INV-TAL-008 | Darse de baja es idempotente: repetirlo no cambia el estado y devuelve el mismo resultado `baja` (RN-004) | DOM | UC-003 | — | baja(baja(t, n), n) = baja(t, n) |
| INV-STO-001 | Plazas, apuntados y espera solo se guardan y leen en el servidor de la aplicación; nunca en `localStorage`, `sessionStorage` ni IndexedDB (REQ-C-002) | API, UI | UC-001..005 | `E_SERVIDOR_NO_DISPONIBLE` | prueba estática sobre `src/` |
| INV-STO-002 | Cada operación lee, decide y guarda el estado sin cesión: dos peticiones simultáneas se aplican una tras otra (ADR-001) | API | UC-002, UC-003, UC-005 | — | sin `await` entre `leer` y `escribir` |
| INV-TAL-101 | El aviso de plaza solo se muestra si ENT-003 recordaba el nombre en espera y ahora figura en apuntados (RN-008) | UI | UC-001 | — | estado recordado `espera` + lista actual `apuntados` ⇒ aviso; recordado `apuntado` ⇒ sin aviso |
| INV-TAL-201 | Tras un alta en espera, el puesto devuelto es igual al tamaño de la espera | DOM | UC-002 | — | `resultado.puesto === t.espera.length` |
