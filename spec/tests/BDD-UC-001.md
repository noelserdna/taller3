# BDD-UC-001 — Ver el taller y sus listas

> Refs: UC-001; REQ-F-001; REQ-F-006; REQ-F-009; INV-TAL-005; INV-TAL-101. Convention: "reabre" = recarga la página en el mismo dispositivo.

Feature: Ver el taller — As a Persona I want ver título, plazas y listas so that sé cómo está el taller

Scenario: AC-001-01 — Taller vacío [REQ-F-001 AC1]
  Given un taller con 10 plazas y nadie apuntado
  When la persona abre la página
  Then ve "Taller de cerámica" y "Apuntados (0 de 10 plazas)"

Scenario: AC-001-02 — Espera vacía [REQ-F-001 AC2]
  Given un taller con 10 plazas y nadie en la lista de espera
  When la persona abre la página
  Then ve "Lista de espera (0)"

Scenario: AC-001-03 — Aviso tras promoción [REQ-F-006 AC1]
  Given "Marta" y "Pablo" apuntados, "Lucía" en el puesto 1 que se apuntó en este dispositivo
  When se da de baja "Pablo" y "Lucía" reabre la página
  Then ve "Plaza confirmada para Lucía" y "Apuntados (2 de 2 plazas)"

Scenario: AC-001-04 — Aviso con otro nombre [REQ-F-006 AC2]
  Given "Marta" y "Pablo" apuntados, "Álex" en el puesto 1 que se apuntó en este dispositivo
  When se da de baja "Marta" y "Álex" reabre la página
  Then ve "Plaza confirmada para Álex"

Scenario: AC-001-05 — Sigue en espera [REQ-F-006 AC4]
  Given "Lucía" en el puesto 2 que se apuntó en este dispositivo
  When reabre la página sin ninguna baja
  Then ve "Lucía, estás en la lista de espera en el puesto 2"

Scenario: AC-001-06 — Apuntada sin promoción
  Given "Marta" apuntada desde este dispositivo
  When reabre la página
  Then no ve "Plaza confirmada para Marta"

Scenario: AC-001-07 — Cambio desde otro dispositivo [REQ-F-009 AC2]
  Given "Marta" y "Pablo" apuntados y "Lucía" en espera desde el navegador A
  When en el navegador B se fija "Plazas" en 3 y A recarga la página
  Then ve "Apuntados (3 de 3 plazas)" y "3. Lucía"

Scenario: AC-001-08 — Almacenamiento local vacío [REQ-F-009 AC3]
  Given "Marta" apuntada desde el navegador A y 2 plazas
  When el navegador B, con almacenamiento local vacío, abre la página
  Then ve "Apuntados (1 de 2 plazas)" y una sola "Marta"

Scenario: AC-001-09 — Servidor no disponible
  When la persona abre la página y el servidor no responde
  Then error `E_SERVIDOR_NO_DISPONIBLE` y no se muestran listas
