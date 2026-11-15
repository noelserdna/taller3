# Implementation Feedback — FASE-0

## IF-0-001 — SPEC-DEVIATION: REQ-NF-001 AC1 contradice los mensajes obligatorios
- **Severity:** WARNING
- **Category:** SPEC-DEVIATION
- **Task:** TASK-F0-002
- **Detail:** REQ-NF-001 AC1 pide que ninguna palabra del catálogo acabe en -ado/-ada/-ido/-ida, pero REQ-F-002 y REQ-F-005 fijan «Plaza confirmada para {nombre}» y «Baja registrada para {nombre}». Se implementan los textos literales; el test `REQ-NF-001 AC1` acepta solo `confirmada` y `registrada`, que concuerdan con «plaza» y «baja», no con la persona.
- **Status:** OPEN — pregunta Q-task-implementer-001 (opción A recomendada).

## IF-0-002 — La demo (FASE-0, paso 8) no es alcanzable
- **Severity:** WARNING
- **Category:** SPEC-DEVIATION
- **Task:** TASK-F0-005
- **Detail:** El paso 8 espera «Apuntados (3 de 3 plazas)», pero tras las bajas de Pablo y Álex (pasos 6 y 7) solo quedan Marta y Lucía y la espera está vacía: el resultado real es «Apuntados (2 de 3 plazas)». El recorrido `FASE-0 journey` comprueba el valor real. Los criterios REQ-F-008 AC1 y AC4 sí comprueban «Apuntados (3 de 3 plazas)» con su propio GIVEN.
- **Status:** OPEN — corregir la tabla de la demo en el plan.

## IF-0-003 — Pruebas de pantalla solo en el navegador
- **Severity:** INFO
- **Category:** TEST-POLICY
- **Task:** TASK-F0-004
- **Detail:** Por la política de pruebas (un test por criterio, al nivel más barato), `tests/ui.test.js` (jsdom) no se escribió: cada criterio de pantalla tiene su test en `tests/e2e/criterios.spec.js`, que es también donde se toma su captura. Las reglas del dominio se prueban en `tests/domain.test.js` sin citar el criterio, y `tests/api.test.js` prueba las rutas; REQ-F-009 se prueba solo con dos contextos de navegador.

## Revisión independiente (Phase 9, 2b) — CODE-REVIEW
Entradas para que una persona las encamine en la puerta de la FASE (no se corrigen aquí).

- **IF-0-004** BLOCKER CODE-REVIEW, Task: n/a — `server.js:20`: `decodeURIComponent` lanza `URIError` con una ruta mal codificada (`/%E0%A4%A`) y tumba el proceso.
- **IF-0-005** BLOCKER CODE-REVIEW, Task: n/a — `src/server/api.js:11`: con un cuerpo demasiado grande solo se rechaza la promesa; no se corta la petición ni se deja de acumular.
- **IF-0-006** BLOCKER CODE-REVIEW, Task: n/a — `src/server/api.js:52-57`: sin captura de errores tras leer el cuerpo (disco lleno, JSON corrupto): la petición se queda colgada.
- **IF-0-007** BLOCKER CODE-REVIEW, Task: n/a — `src/domain/taller.js:16`: sin límite de longitud de nombre ni de número de entradas.
- **IF-0-008** BLOCKER CODE-REVIEW, Task: n/a — `src/server/store.js:17`: escritura en el sitio (sin fichero temporal + rename); un corte deja JSON truncado y la app no arranca.
- **IF-0-009** BLOCKER CODE-REVIEW, Task: n/a — `src/ui/main.js:25,103`: `localStorage.setItem` sin protección y `resultado` nulo en un 400 rompen el repintado.
- **IF-0-010** BLOCKER CODE-REVIEW, Task: n/a — `src/ui/main.js:17`: `pedir` no comprueba `ok` ni errores de red; página en blanco sin mensaje.
- **IF-0-011** WARNING CODE-REVIEW, Task: n/a — `server.js:22`: `startsWith(dist)` sin separador final (endurecimiento).
