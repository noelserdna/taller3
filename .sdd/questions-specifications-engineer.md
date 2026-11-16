# Questions — specifications-engineer

<!-- Vista generada desde questions-specifications-engineer.json por `sdd questions`: no se edita a mano (se regenera). Pregunta nueva: `sdd questions add --role specifications-engineer`. -->

## Q-specifications-engineer-001 [OPEN] skill=sdd-specifications-engineer context=NC-101 / REQ-F-006 (UC-001)
Question: REQ-F-006 says the promoted person is told 'Plaza confirmada para {nombre}' when next opening the page on the same device; it does not say whether the notice repeats on later openings. Specs currently leave NC-101 open.
Para el cliente: Cuando alguien pasa de la espera a apuntado y vuelve a entrar, ¿el aviso de plaza confirmada debe verse solo esa vez o cada vez que entre?
Options:
  A) Show the notice once (first opening after the promotion) (recommended)
     efecto: ninguno
     cliente: El aviso sale una sola vez; después se ve la lista normal
  B) Show it on every opening while the person stays apuntada
     efecto: req-change
     cliente: El aviso sale siempre que entre
Blocks: NC-101 (spec/use-cases/UC-001-ver-el-taller.md)
Answer:
