# Questions — acceptance

<!-- Vista generada desde questions-acceptance.json por `sdd questions`: no se edita a mano (se regenera). Pregunta nueva: `sdd questions add --role acceptance`. -->

## Q-acceptance-001 [OPEN] skill=sdd-acceptance context=CH-001 REQ-NF-001 AC1 (adversarial FASE-0)
Question: REQ-NF-001 AC1 says a scan for -ado/-ada/-ido/-ida and o/a forms finds none, but its own examples 'Plaza confirmada para Marta' and 'Baja registrada para Pablo' contain 'confirmada' and 'registrada'. tests/messages.test.js:17,24 passes via an allowlist (concuerdaConSustantivo). The statement scopes the rule to forms addressed to the person; the criterion text does not.
Para el cliente: ¿Las palabras como «confirmada» o «registrada», que concuerdan con «plaza» o «baja» y no con la persona, están permitidas?
Options:
  A) Amend AC1 so it says the scan ignores words agreeing with a noun, not with the person (recommended)
     efecto: req-change
     cliente: Sí, están permitidas; se aclara el criterio
  B) Keep the criterion and reword the messages so no such word remains
     efecto: ninguno
     cliente: No; se reescriben los mensajes
Blocks: CH-001
Answer:
