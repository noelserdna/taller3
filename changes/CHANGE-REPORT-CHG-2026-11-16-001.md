# Change Report CHG-2026-11-16-001
Origen: intent/INT-002.md. Modo arnés, requirements-only, `--batch --cascade=manual`.

- CR-001 MODIFY REQ-NF-001 AC1 (aplicado): el escaneo ignora palabras que concuerdan con un sustantivo («confirmada»/«plaza», «registrada»/«baja»), no con la persona. Statement, Para el cliente, Needs y Verification no cambian.
- REQUIREMENTS.md pasa a Version 1.1, Status: Review. **Pendiente: aprobación de la v1.1 (puerta de requisitos)**; se quitaron las líneas Approved by / Ejemplos revisados por del documento, que una persona debe reconfirmar.
- La aceptación de REQ-NF-001 se reabre (hash del criterio); los tests solo cuentan mientras sus nombres coincidan: `tests/messages.test.js` ya implementa la lista permitida (`concuerdaConSustantivo`), así que no requiere cambio de comportamiento. Su comentario cita el texto antiguo del criterio: editar un test existente es decisión humana (art. 12), no se toca aquí.
- Impacto: REQ-NF-001 → FASE de mensajes/tests. `lint --stale`: 0 hallazgos.
- Cascada (manual): plan-architect, task-generator, task-implementer marcados stale; luego `/sdd-acceptance --check`.
