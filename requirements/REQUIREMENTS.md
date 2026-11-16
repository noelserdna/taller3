# Requirements Document

> **Project:** taller3 — apuntarse a un taller de cerámica
> **Version:** 1.1
> **Last updated:** 2026-11-16 (revisión: datos compartidos)
> **Status:** Review
> **Customer needs:** [CUSTOMER-NEEDS.md](CUSTOMER-NEEDS.md)

## Functional Requirements

### REQ-F-001: Ver el taller y sus plazas
- **Statement:** WHEN a person opens the page THE system SHALL show the workshop title, the number of plazas and the lists of apuntados and of lista de espera
- **Para el cliente:** Al entrar ves el taller, cuántas plazas hay ocupadas y quién está apuntado o esperando.
- **Category:** Functional
- **Priority:** Must have
- **Needs:** N-001
- **Verification:** test
- **Source:** intent/INT-001.md
- **Rationale:** Es la pantalla en la que ocurre todo lo demás (listas compartidas: REQ-F-009). El número inicial de plazas (10) es una decisión por defecto.
- **Acceptance criteria:**
  - GIVEN a workshop with 10 plazas and nobody registered WHEN a person opens the page THEN the user sees the heading "Taller de cerámica" and "Apuntados (0 de 10 plazas)"
    - Se ve: "Taller de cerámica" y "Apuntados ({n} de {plazas} plazas)" en la página principal
  - GIVEN a workshop with 10 plazas and nobody on the waiting list WHEN a person opens the page THEN the user sees "Lista de espera (0)"
    - Se ve: "Lista de espera ({n})" en la página principal
- **Dependencies:** None

### REQ-F-002: Apuntarse con el nombre cuando quedan plazas
- **Statement:** WHEN a person submits a name AND there are free plazas THE system SHALL add the name to the apuntados and tell that person that their plaza is confirmed
- **Para el cliente:** Escribes tu nombre y, si hay sitio, ves enseguida que tu plaza está confirmada.
- **Category:** Functional
- **Priority:** Must have
- **Needs:** N-002, N-003
- **Verification:** test
- **Source:** intent/INT-001.md
- **Rationale:** Núcleo del servicio.
- **Acceptance criteria:**
  - GIVEN 2 plazas and nobody registered WHEN "Marta" writes "Marta" in "Nombre" and presses "Apuntarme" THEN the user sees "Plaza confirmada para Marta" and "1. Marta" in the apuntados
    - Se ve: "Plaza confirmada para {nombre}" y "{posicion}. {nombre}" en la página principal
  - GIVEN 2 plazas and "Marta" already apuntada WHEN "Pablo" writes "Pablo" and presses "Apuntarme" THEN the user sees "Plaza confirmada para Pablo" and "Apuntados (2 de 2 plazas)"
    - Se ve: "Plaza confirmada para {nombre}" y "Apuntados ({n} de {plazas} plazas)" en la página principal
  - GIVEN "Marta" apuntada WHEN the form is submitted again with "Marta" THEN the user sees "Apuntados (1 de 2 plazas)" and the list keeps one single "Marta"
    - Se ve: "Apuntados ({n} de {plazas} plazas)" y "{nombre} ya está en el taller" en la página principal
- **Dependencies:** REQ-F-001

### REQ-F-003: Lista de espera con puesto cuando el taller está lleno
- **Statement:** WHEN a person submits a name AND there are no free plazas THE system SHALL add the name at the end of the lista de espera and tell that person their puesto
- **Para el cliente:** Si el taller está lleno, entras en la lista de espera y ves en qué puesto estás.
- **Category:** Functional
- **Priority:** Must have
- **Needs:** N-004
- **Verification:** test
- **Source:** intent/INT-001.md
- **Rationale:** Evita perder a quien llega con el taller lleno.
- **Acceptance criteria:**
  - GIVEN 2 plazas filled by "Marta" and "Pablo" WHEN "Lucía" writes "Lucía" and presses "Apuntarme" THEN the user sees "Lucía, estás en la lista de espera en el puesto 1"
    - Se ve: "{nombre}, estás en la lista de espera en el puesto {posicion}" en la página principal
  - GIVEN 2 plazas filled and "Lucía" at puesto 1 WHEN "Álex" writes "Álex" and presses "Apuntarme" THEN the user sees "Álex, estás en la lista de espera en el puesto 2" and "Lista de espera (2)"
    - Se ve: "{nombre}, estás en la lista de espera en el puesto {posicion}" y "Lista de espera ({n})" en la página principal
  - GIVEN "Lucía" at puesto 1 WHEN the form is submitted again with "Lucía" THEN the user sees "Lucía ya está en el taller" and the waiting list keeps one single "Lucía" at puesto 1
    - Se ve: "{nombre} ya está en el taller" y "Lista de espera ({n})" en la página principal
- **Dependencies:** REQ-F-002

### REQ-F-004: Rechazar nombre vacío
- **Statement:** IF the submitted name is empty or only spaces THEN THE system SHALL not register anyone and SHALL show a message asking for a name
- **Para el cliente:** Si no escribes ningún nombre, no se apunta a nadie y se te avisa.
- **Category:** Functional
- **Priority:** Should have
- **Needs:** N-002
- **Origin:** method
- **Verification:** test
- **Source:** method
- **Rationale:** Evita filas sin nombre.
- **Acceptance criteria:**
  - GIVEN 2 plazas and "Marta" apuntada WHEN "   " is submitted as "Nombre" THEN the user sees "Escribe un nombre para apuntarte" and "Apuntados (1 de 2 plazas)"
    - Se ve: "Escribe un nombre para apuntarte" y "Apuntados ({n} de {plazas} plazas)" en la página principal
- **Dependencies:** REQ-F-002

### REQ-F-005: Darse de baja
- **Statement:** WHEN a person presses "Darse de baja" next to a name in apuntados or in lista de espera THE system SHALL remove that name and tell that the baja is registered, renumbering the lista de espera
- **Para el cliente:** Cualquiera puede darse de baja, esté apuntado o esperando, y la lista se ajusta sola.
- **Category:** Functional
- **Priority:** Must have
- **Needs:** N-005
- **Verification:** test
- **Source:** intent/INT-001.md
- **Rationale:** Libera la plaza para otra persona.
- **Acceptance criteria:**
  - GIVEN "Marta" and "Pablo" apuntados and "Lucía" 1 and "Álex" 2 on the waiting list WHEN someone presses "Darse de baja" next to "Álex" THEN the user sees "Baja registrada para Álex" and "Lista de espera (1)" and "Lucía" stays at puesto 1
    - Se ve: "Baja registrada para {nombre}" y "Lista de espera ({n})" en la página principal
  - GIVEN "Lucía" 1 and "Álex" 2 on the waiting list and the workshop full WHEN someone presses "Darse de baja" next to "Lucía" THEN the user sees "Baja registrada para Lucía" and "Álex" now at puesto 1
    - Se ve: "Baja registrada para {nombre}" y "{posicion}. {nombre}" en la página principal
  - GIVEN "Marta" was just removed from 2 apuntados and 2 plazas WHEN the page is reloaded and the removal is requested again for "Marta" THEN the user sees "Apuntados (1 de 2 plazas)" and no "Marta" in any list
    - Se ve: "Apuntados ({n} de {plazas} plazas)" en la página principal
- **Dependencies:** REQ-F-002

### REQ-F-006: Promoción automática desde la lista de espera
- **Statement:** WHEN an apuntado person is removed THE system SHALL move the first person of the lista de espera to apuntados AND WHEN that person next opens the page on the same device THE system SHALL tell them their plaza is confirmed
- **Para el cliente:** Si alguien se da de baja, la primera persona de la espera pasa a tener plaza y lo ve la próxima vez que entra.
- **Category:** Functional
- **Priority:** Must have
- **Needs:** N-006
- **Verification:** test
- **Source:** intent/INT-001.md
- **Rationale:** Las listas son compartidas (REQ-F-009); solo el nombre usado al apuntarse se recuerda en el navegador de cada persona. No hay cuentas ni avisos externos.
- **Acceptance criteria:**
  - GIVEN "Marta" and "Pablo" apuntados, "Lucía" puesto 1 who registered on this device WHEN "Pablo" is removed and "Lucía" reopens the page THEN the user sees "Plaza confirmada para Lucía" and "Apuntados (2 de 2 plazas)"
    - Se ve: "Plaza confirmada para {nombre}" y "Apuntados ({n} de {plazas} plazas)" en la página principal
  - GIVEN "Marta" and "Pablo" apuntados, "Álex" puesto 1 who registered on this device WHEN "Marta" is removed and "Álex" reopens the page THEN the user sees "Plaza confirmada para Álex"
    - Se ve: "Plaza confirmada para {nombre}" en la página principal
  - GIVEN "Lucía" puesto 1 and "Álex" puesto 2 WHEN an apuntado is removed THEN the user sees "Álex" now at puesto 1 and "Lista de espera (1)"
    - Se ve: "{posicion}. {nombre}" y "Lista de espera ({n})" en la página principal
  - GIVEN "Lucía" at puesto 2 who registered on this device WHEN she reopens the page without any removal THEN the user sees "Lucía, estás en la lista de espera en el puesto 2"
    - Se ve: "{nombre}, estás en la lista de espera en el puesto {posicion}" en la página principal
- **Dependencies:** REQ-F-003, REQ-F-005

### REQ-F-007: La organizadora ve apuntados y espera
- **Statement:** WHEN the organizer opens the "Organización" section THE system SHALL show the lista de apuntados and the lista de espera in order
- **Para el cliente:** La organizadora ve de un vistazo quién está apuntado y quién espera, en orden.
- **Category:** Functional
- **Priority:** Must have
- **Needs:** N-007
- **Verification:** test
- **Source:** intent/INT-001.md
- **Rationale:** Sin autenticación (no pedida): la sección es visible para cualquiera; ver pregunta abierta en .sdd/questions.
- **Acceptance criteria:**
  - GIVEN "Marta" and "Pablo" apuntados and "Lucía" 1 and "Álex" 2 waiting WHEN the organizer opens "Organización" THEN the user sees "1. Marta", "2. Pablo" and "1. Lucía", "2. Álex"
    - Se ve: "{posicion}. {nombre}" en Organización
  - GIVEN nobody waiting WHEN the organizer opens "Organización" THEN the user sees "Nadie en la lista de espera"
    - Se ve: "Nadie en la lista de espera" en Organización
- **Dependencies:** REQ-F-002

### REQ-F-008: La organizadora cambia el número de plazas
- **Statement:** WHEN the organizer submits a new number of plazas THE system SHALL update the plazas AND, if there are more free plazas, move people from the lista de espera to apuntados in order
- **Para el cliente:** La organizadora puede cambiar las plazas; si las amplía, entran quienes esperaban, por orden.
- **Category:** Functional
- **Priority:** Must have
- **Needs:** N-008, N-006
- **Verification:** test
- **Source:** intent/INT-001.md
- **Rationale:** Ampliar plazas libera sitio igual que una baja.
- **Acceptance criteria:**
  - GIVEN 2 plazas full and "Lucía" 1, "Álex" 2 waiting WHEN the organizer sets "Plazas" to 3 and presses "Cambiar plazas" THEN the user sees "Apuntados (3 de 3 plazas)", "3. Lucía" and "Lista de espera (1)"
    - Se ve: "Apuntados ({n} de {plazas} plazas)" y "{posicion}. {nombre}" y "Lista de espera ({n})" en Organización
  - GIVEN 2 apuntados and 2 plazas WHEN the organizer sets "Plazas" to 1 THEN the user sees "No se pueden reducir las plazas por debajo de 2 personas apuntadas" and "Apuntados (2 de 2 plazas)"
    - Se ve: "No se pueden reducir las plazas por debajo de {n} personas apuntadas" y "Apuntados ({n} de {plazas} plazas)" en Organización
  - GIVEN 2 plazas WHEN the organizer sets "Plazas" to "abc" or 0 THEN the user sees "Indica un número de plazas de 1 o más" and "Apuntados (0 de 2 plazas)"
    - Se ve: "Indica un número de plazas de 1 o más" y "Apuntados ({n} de {plazas} plazas)" en Organización
  - GIVEN plazas set to 3 WHEN the same value 3 is submitted again THEN the user sees "Apuntados (3 de 3 plazas)" and the lists do not change
    - Se ve: "Apuntados ({n} de {plazas} plazas)" en Organización
- **Dependencies:** REQ-F-007

### REQ-F-009: Las mismas listas en todos los dispositivos
- **Statement:** WHEN any person or the organizer opens or reloads the page on any device THE system SHALL show the apuntados, the lista de espera and the number of plazas as last changed from any device
- **Para el cliente:** Todo el mundo ve las mismas listas: si alguien se apunta desde su móvil, la organizadora lo ve en el suyo. Los datos no se quedan en cada navegador.
- **Category:** Functional
- **Priority:** Must have
- **Needs:** N-010, N-007
- **Verification:** test
- **Source:** intent/INT-001.md, revisión del cliente
- **Rationale:** Sin datos compartidos la organizadora no vería a quien se apunta desde otro dispositivo. Un test lo comprueba con dos clientes independientes (dos contextos de navegador sin almacenamiento común) contra la misma aplicación.
- **Acceptance criteria:**
  - GIVEN 2 plazas and nobody registered, and two separate browsers A and B WHEN "Marta" registers in browser A and browser B opens "Organización" THEN the user sees "1. Marta" in browser B
    - Se ve: "{posicion}. {nombre}" en Organización
  - GIVEN "Marta" and "Pablo" apuntados and "Lucía" registered in browser A on the waiting list WHEN the organizer in browser B sets "Plazas" to 3 and browser A reloads the page THEN the user sees "Apuntados (3 de 3 plazas)" and "3. Lucía" in browser A
    - Se ve: "Apuntados ({n} de {plazas} plazas)" y "{posicion}. {nombre}" en la página principal
  - GIVEN "Marta" apuntada from browser A WHEN browser B's local storage is empty and it opens the page THEN the user sees "Apuntados (1 de 2 plazas)" and the list keeps one single "Marta"
    - Se ve: "Apuntados ({n} de {plazas} plazas)" en la página principal
- **Dependencies:** REQ-F-002, REQ-F-007

## Nonfunctional Requirements

### REQ-NF-001: Mensajes sin suponer género
- **Statement:** THE system SHALL show every message without gendered participles or adjectives addressed to the person (for example "apuntado/apuntada", "bienvenido/bienvenida") and without "o/a" or "@" forms
- **Para el cliente:** Ningún mensaje da por hecho si la persona es hombre o mujer.
- **Category:** Usability
- **Priority:** Must have
- **Needs:** N-009
- **Verification:** test — metric: gendered words found in the text catalog, threshold 0, measured by a test that scans every message text for the listed gendered forms
- **Metric:** 0 gendered forms in the message catalog
- **Acceptance criteria:**
  - GIVEN the full catalog of messages ("Plaza confirmada para Marta", "Álex, estás en la lista de espera en el puesto 2", "Baja registrada para Pablo") WHEN scanned for words ending in -ado/-ada/-ido/-ida and "o/a" forms, ignoring words that agree with a noun of the message ("confirmada" with "plaza", "registrada" with "baja") and not with the person THEN none is found
    - No visible: lo comprueba un test que lee el catálogo de textos
  - GIVEN the same messages for names "Marta" and "Pablo" WHEN rendered THEN the text around the name is identical
    - No visible: lo comprueba un test que compara los textos de dos nombres

## Constraints

### REQ-C-001: Textos de la interfaz en español
- **Statement:** All interface texts SHALL be in Spanish
- **Para el cliente:** Todo lo que se lee en la web está en español.
- **Type:** Business
- **Source:** AGENTS.md
- **Needs:** — (team/architecture source)
- **Verification:** test — a static check reads the text catalog and compares it with the expected Spanish messages

### REQ-C-002: Stack web con Vite y JavaScript, con datos compartidos propios
- **Statement:** The system SHALL be a Vite + JavaScript (ES modules) web app whose shared data (apuntados, lista de espera, plazas) is kept by the application's own server, with no third-party online service, account or external database
- **Para el cliente:** Es una web que se abre en el navegador, sin cuentas; los datos viven en el servidor de la propia aplicación y todos ven lo mismo.
- **Type:** Technical
- **Source:** AGENTS.md, revisión del cliente
- **Needs:** N-001, N-010
- **Verification:** test — a static check reads package.json (vite, vitest) and the source, and fails if the shared data is read or written in localStorage/sessionStorage/IndexedDB or if any request goes to a host other than the application's own

## Traceability

| REQ ID | Type | Priority | Source | Needs | Verification | Dependencies |
|--------|------|----------|--------|-------|--------------|--------------|
| REQ-F-001 | Functional | Must | INT-001 | N-001 | test | None |
| REQ-F-002 | Functional | Must | INT-001 | N-002, N-003 | test | REQ-F-001 |
| REQ-F-003 | Functional | Must | INT-001 | N-004 | test | REQ-F-002 |
| REQ-F-004 | Functional | Should | method | N-002 | test | REQ-F-002 |
| REQ-F-005 | Functional | Must | INT-001 | N-005 | test | REQ-F-002 |
| REQ-F-006 | Functional | Must | INT-001 | N-006 | test | REQ-F-003, REQ-F-005 |
| REQ-F-007 | Functional | Must | INT-001 | N-007 | test | REQ-F-002 |
| REQ-F-008 | Functional | Must | INT-001 | N-008, N-006 | test | REQ-F-007 |
| REQ-F-009 | Functional | Must | INT-001, revisión | N-010, N-007 | test | REQ-F-002, REQ-F-007 |
| REQ-NF-001 | Nonfunctional | Must | INT-001 | N-009 | test | — |
| REQ-C-001 | Constraint | — | AGENTS.md | — | test | — |
| REQ-C-002 | Constraint | — | AGENTS.md, revisión | N-001, N-010 | test | — |
