# NFR — Límites y restricciones

> Refs: REQ-C-001; REQ-C-002; valores por nombre de VALUE-REGISTRY.md.

| ID | Métrica / Control | Objetivo | Punto de fallo | Medición / Cumplimiento | Refs |
|---|---|---|---|---|---|
| SPEC-LIM-001 | `PLAZAS_INICIALES` | valor del registro | — | Estado inicial del taller; test de estado inicial | RN-005 |
| SPEC-LIM-002 | `PLAZAS_MINIMAS` | valor del registro | plazas < mínimo | `E_PLAZAS_INVALIDO` en la regla de plazas | RN-006, INV-TAL-006 |
| SPEC-LIM-003 | `CUERPO_MAX_CHARS` | valor del registro | cuerpo mayor | Servidor rechaza con `E_SOLICITUD_INVALIDA` | ADR-001 |
| SPEC-LIM-004 | Textos de la interfaz en español | 100 % del catálogo | texto no esperado | Comprobación estática que lee `src/messages.js` y lo compara con los mensajes esperados | REQ-C-001, ADR-004 |
| SPEC-LIM-005 | Stack Vite + JavaScript (ES modules) con Vitest; sin servicio, cuenta ni base de datos de terceros | `package.json` declara vite y vitest | falta alguno | Comprobación estática de `package.json` y de `src/` | REQ-C-002, ADR-001 |
| SPEC-LIM-006 | Datos compartidos fuera de `localStorage`, `sessionStorage` e IndexedDB | 0 usos | ≥ 1 uso | Comprobación estática sobre `src/` (solo el nombre usado puede guardarse, ADR-005) | REQ-C-002, INV-STO-001 |
