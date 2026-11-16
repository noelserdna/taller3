# BDD-UC-002 — Apuntarse con el nombre

> Refs: UC-002; REQ-F-002, REQ-F-003, REQ-F-004; INV-TAL-002, INV-TAL-201, INV-STO-002. Convention: "sin cambios" = listas idénticas.

Feature: Apuntarse — As a Persona I want enviar mi nombre so that obtengo plaza o puesto

Scenario: AC-002-01 — confirmada [REQ-F-002 AC1]
  Given 2 plazas and nobody registered
  When "Marta" writes "Marta" in "Nombre" and presses "Apuntarme"
  Then the user sees "Plaza confirmada para Marta" and "1. Marta"

Scenario: AC-002-02 — última plaza [REQ-F-002 AC2]
  Given 2 plazas and "Marta" apuntada
  When "Pablo" writes "Pablo" and presses "Apuntarme"
  Then the user sees "Plaza confirmada para Pablo" and "Apuntados (2 de 2 plazas)"

Scenario: AC-002-03 — duplicado en apuntados [REQ-F-002 AC3]
  Given "Marta" apuntada
  When the form is submitted again with "Marta"
  Then the user sees "Marta ya está en el taller" and "Apuntados (1 de 2 plazas)"
  And the list keeps one single "Marta"

Scenario: AC-002-04 — espera [REQ-F-003 AC1]
  Given 2 plazas filled by "Marta" and "Pablo"
  When "Lucía" writes "Lucía" and presses "Apuntarme"
  Then the user sees "Lucía, estás en la lista de espera en el puesto 1"

Scenario: AC-002-05 — segundo puesto [REQ-F-003 AC2]
  Given 2 plazas filled and "Lucía" at puesto 1
  When "Álex" writes "Álex" and presses "Apuntarme"
  Then the user sees "Álex, estás en la lista de espera en el puesto 2" and "Lista de espera (2)"

Scenario: AC-002-06 — duplicado en espera [REQ-F-003 AC3]
  Given "Lucía" at puesto 1
  When the form is submitted again with "Lucía"
  Then the user sees "Lucía ya está en el taller" and "Lista de espera (1)"
  And the waiting list keeps one single "Lucía" at puesto 1

Scenario: AC-002-07 — vacío [REQ-F-004 AC1]
  Given 2 plazas and "Marta" apuntada
  When "   " is submitted as "Nombre"
  Then error `E_NOMBRE_VACIO`: the user sees "Escribe un nombre para apuntarte" and "Apuntados (1 de 2 plazas)"

Scenario: AC-002-08 — entrada inválida
  When a malformed or oversized name is submitted
  Then error `E_SOLICITUD_INVALIDA` and listas sin cambios

Scenario: AC-002-09 — servidor caído
  When "Marta" is submitted and the server is down
  Then error `E_SERVIDOR_NO_DISPONIBLE` and listas sin cambios

Scenario: AC-002-10 — última plaza simultánea
  Given 1 plaza free
  When "Marta" and "Pablo" are submitted at the same time
  Then one is `confirmada` and the other `espera` at puesto 1
