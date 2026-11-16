# BDD-UC-003 — Darse de baja

> Refs: UC-003; REQ-F-005; REQ-F-006; INV-TAL-005, INV-TAL-008. Convention: "sin cambios" = listas y plazas iguales.

Feature: Darse de baja — As a persona I want quitar mi nombre so that se libere el sitio

Scenario: AC-003-01 — baja desde la lista de espera [REQ-F-005 AC1]
  Given "Marta" y "Pablo" apuntados, "Lucía" 1 y "Álex" 2 en espera
  When la persona pulsa "Darse de baja" junto a "Álex"
  Then ve "Baja registrada para Álex" y "Lista de espera (1)"
  And "Lucía" sigue en el puesto 1

Scenario: AC-003-02 — la espera se renumera [REQ-F-005 AC2]
  Given "Lucía" 1 y "Álex" 2 en espera, taller lleno
  When la persona pulsa "Darse de baja" junto a "Lucía"
  Then ve "Baja registrada para Lucía" y "1. Álex"

Scenario: AC-003-03 — promoción al salir un apuntado [REQ-F-006 AC1, AC3]
  Given "Marta" y "Pablo" apuntados, "Lucía" 1 y "Álex" 2 en espera
  When la persona pulsa "Darse de baja" junto a "Pablo"
  Then ve "Apuntados (2 de 2 plazas)", "1. Álex" y "Lista de espera (1)"

Scenario: AC-003-04 — baja repetida [REQ-F-005 AC3]
  Given "Marta" fue quitada de 2 apuntados y 2 plazas
  When se recarga la página y se pide otra baja de "Marta"
  Then ve "Apuntados (1 de 2 plazas)" y "Marta" no está en ninguna lista

Scenario: AC-003-05 — petición sin nombre
  When llega una baja sin nombre de texto
  Then error `E_SOLICITUD_INVALIDA` y listas sin cambios

Scenario: AC-003-06 — servidor caído
  When la baja no llega al servidor
  Then error `E_SERVIDOR_NO_DISPONIBLE` y listas sin cambios

Scenario: AC-003-07 — bajas simultáneas
  When dos bajas de "Álex" llegan a la vez
  Then ambas devuelven "Baja registrada para Álex" y "Álex" no está en ninguna lista
