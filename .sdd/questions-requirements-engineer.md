# Questions — requirements-engineer

<!-- Vista generada desde questions-requirements-engineer.json por `sdd questions`: no se edita a mano (se regenera). Pregunta nueva: `sdd questions add --role requirements-engineer`. -->

## Q-requirements-engineer-001 [ANSWERED] skill=sdd-requirements-engineer context=REQ-F-008
Question: When the organizer lowers plazas below the number of apuntados, what happens?
Para el cliente: Si la organizadora reduce las plazas por debajo de las personas ya apuntadas, ¿qué debe pasar?
Options:
  A) Reject the change with a message (recommended)
     efecto: ninguno
     cliente: Se avisa y no se cambia; nadie pierde su plaza
  B) Accept it and move the last apuntados to the waiting list
     efecto: req-change
     cliente: Las últimas personas apuntadas pasan a la lista de espera
Blocks: Requirements gate
Answer: A — opción recomendada, aceptada por Andres Leon (Cliente) (2026-11-16)

## Q-requirements-engineer-002 [ANSWERED] skill=sdd-requirements-engineer context=REQ-F-007
Question: Should the Organización section be protected (password) or open to everyone?
Para el cliente: ¿La parte de la organizadora debe pedir una contraseña, o basta con que esté en la misma web sin protección?
Options:
  A) Open section, no password (as requested) (recommended)
     efecto: ninguno
     cliente: Sin contraseña; cualquiera que sepa dónde está podría cambiar las plazas
  B) Add a password for the organizer
     efecto: req-change
     cliente: Se añade una contraseña para la organizadora
Blocks: Requirements gate
Answer: A — opción recomendada, aceptada por Andres Leon (Cliente) (2026-11-16)
