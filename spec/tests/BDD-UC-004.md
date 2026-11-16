# BDD-UC-004 — Ver apuntados y espera (Organización)

> Refs: UC-004; REQ-F-007; REQ-F-009; INV-TAL-005. Convention: cada navegador es un contexto independiente sin almacenamiento común.

Feature: Organización — As a Organizadora I want ver las listas en orden so that sé quién está apuntado y quién espera

Scenario: AC-004-01 — Listas en orden [REQ-F-007 AC1]
  Given "Marta" y "Pablo" apuntados, "Lucía" 1 y "Álex" 2 en espera
  When la organizadora abre "Organización"
  Then ve "1. Marta", "2. Pablo" y "1. Lucía", "2. Álex"

Scenario: AC-004-02 — Sin espera [REQ-F-007 AC2]
  Given nadie en la lista de espera
  When la organizadora abre "Organización"
  Then ve "Nadie en la lista de espera"

Scenario: AC-004-03 — Otro dispositivo [REQ-F-009 AC1]
  Given 2 plazas, nadie apuntado y dos navegadores A y B
  When "Marta" se apunta en el navegador A y B abre "Organización"
  Then ve "1. Marta" en el navegador B

Scenario: AC-004-04 — Servidor no disponible
  When la organizadora abre "Organización" y el servidor no responde
  Then error `E_SERVIDOR_NO_DISPONIBLE` y no se muestran listas
