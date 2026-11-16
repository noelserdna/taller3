# BDD-UC-005 — Cambiar el número de plazas

> Refs: UC-005; REQ-F-008; INV-TAL-006, INV-TAL-007. Convention: "sin cambios" = listas y plazas iguales.

Feature: Cambiar plazas — As a organizadora I want ajustar las plazas so that entren quienes esperan

Scenario: AC-005-01 — ampliar plazas con promoción [REQ-F-008 AC1]
  Given 2 plazas llenas, "Lucía" 1 y "Álex" 2 en espera
  When la organizadora pone "Plazas" en 3 y pulsa "Cambiar plazas"
  Then ve "Apuntados (3 de 3 plazas)", "3. Lucía" y "Lista de espera (1)"

Scenario: AC-005-02 — reducir por debajo de apuntados [REQ-F-008 AC2]
  Given 2 apuntados y 2 plazas
  When la organizadora pone "Plazas" en 1
  Then error `E_PLAZAS_BAJO_APUNTADOS`: "No se pueden reducir las plazas por debajo de 2 personas apuntadas"
  And ve "Apuntados (2 de 2 plazas)"

Scenario: AC-005-03 — valor no válido [REQ-F-008 AC3]
  Given 2 plazas
  When la organizadora pone "Plazas" en "abc" o en 0
  Then error `E_PLAZAS_INVALIDO`: "Indica un número de plazas de 1 o más"
  And ve "Apuntados (0 de 2 plazas)"

Scenario: AC-005-04 — mismo valor [REQ-F-008 AC4]
  Given plazas en 3
  When se envía otra vez 3
  Then ve "Apuntados (3 de 3 plazas)" y las listas no cambian

Scenario: AC-005-05 — petición sin valor
  When llega un cambio de plazas sin valor
  Then error `E_SOLICITUD_INVALIDA` y estado sin cambios

Scenario: AC-005-06 — servidor caído
  When el cambio no llega al servidor
  Then error `E_SERVIDOR_NO_DISPONIBLE` y estado sin cambios

Scenario: AC-005-07 — reducción y alta simultáneas
  Given 1 apuntado y 2 plazas
  When llegan a la vez un alta y "Plazas" en 1
  Then se aplican una tras otra y no hay más apuntados que plazas
