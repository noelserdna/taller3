# NFR — Seguridad

> Refs: REQ-C-002; ADR-003; valores por nombre de VALUE-REGISTRY.md.

| ID | Métrica / Control | Objetivo | Punto de fallo | Medición / Cumplimiento | Refs |
|---|---|---|---|---|---|
| SEC-001 | Autenticación y autorización | No aplica (ADR-003) | — | — | ADR-003, RN-002 |
| SEC-002 | Validación de entrada | Todo argumento (nombre, plazas) se valida antes de leer o guardar | entrada inválida llega a la regla | `E_NOMBRE_VACIO`, `E_PLAZAS_INVALIDO`; test de cada rechazo | INV-TAL-003, INV-TAL-006 |
| SEC-003 | Tamaño de la petición | ≤ `CUERPO_MAX_CHARS` | mayor | Rechazo con `E_SOLICITUD_INVALIDA` sin cambiar el estado | ADR-001 |
| SEC-004 | Host de terceros | 0 peticiones a hosts distintos del propio | ≥ 1 | Comprobación estática de `src/` | REQ-C-002 |
