# Questions — task-implementer

<!-- Vista generada desde questions-task-implementer.json por `sdd questions`: no se edita a mano (se regenera). Pregunta nueva: `sdd questions add --role task-implementer`. -->

## Q-task-implementer-001 [ANSWERED] skill=sdd-task-implementer context=REQ-NF-001 AC1
Question: REQ-NF-001 AC1 asks that no catalog word end in -ado/-ada/-ido/-ida, but its own examples and REQ-F-002/REQ-F-005 mandate "Plaza confirmada para {nombre}" and "Baja registrada para {nombre}" (confirmada, registrada). May the scan accept those two participles because they agree with the nouns plaza and baja, not with the person?
Para el cliente: Los mensajes «Plaza confirmada» y «Baja registrada» llevan una terminación femenina que concuerda con «plaza» y «baja», no con la persona: ¿está bien dejarlos tal cual?
Options:
  A) Keep the mandated texts; the scan skips confirmada and registrada because they modify plaza and baja (recommended) (recommended)
     efecto: ninguno
  B) Reword both messages without participles (for example "Tu plaza queda confirmada" is also gendered, so use "Plaza asegurada"-free phrasing agreed with the client)
     efecto: req-change
Blocks: Nada: se implementa la opción A mientras tanto
Answer: A — opción recomendada, aceptada por Andres Leon (Cliente) (2026-11-16)
