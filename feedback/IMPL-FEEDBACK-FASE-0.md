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
