# Tasks: FASE-0 — Taller completo con listas compartidas

> **Critical path:** TASK-F0-001 → TASK-F0-002 → TASK-F0-003 → TASK-F0-004 → TASK-F0-005

## Stream Ownership

| Stream | Tasks | Owns (write-set) | Runs in |
|--------|-------|------------------|---------|
| base | TASK-F0-001 | package.json, vitest.config.js, playwright.config.js, index.html, server.js, README.md, .gitignore | main checkout, before worktrees (checkpoint `fase-0-foundation`) |
| A | TASK-F0-002, TASK-F0-003, TASK-F0-004, TASK-F0-006 | src/domain/**, src/server/**, src/ui/**, src/messages.js, vite.config.js, tests/*.test.js | worktree `feat/fase-0-a` |
| integración | — | — | main checkout, after `--integrate --fase 0` |
| verificación | TASK-F0-005 | tests/e2e/** | main checkout, Phase 9 |

### Rollback Checkpoints

| Checkpoint | After Task | Tag | Runs in |
|-----------|------------|-----|---------|
| Foundation | TASK-F0-001 | `fase-0-foundation` | main checkout |
| Verified | TASK-F0-005 | `fase-0-verified` | main checkout |

## Setup

- [ ] TASK-F0-001 Scaffold the app with Vitest, Playwright and a production start | `package.json`, `vitest.config.js`, `playwright.config.js`, `index.html`, `server.js`, `README.md`, `.gitignore`
  - **Commit:** `build(app): scaffold Vite app with vitest, playwright and production start`
  - **Acceptance:** Verify: `npm install && npm run build && npm test -- --passWithNoTests` end with exit 0.
    - `package.json` pins `vite`, `vitest`, `jsdom`, `@playwright/test` and defines `build` (`vite build`), `test` (`vitest run`), `start` (`node server.js`, never the dev server) and `test:e2e` (`playwright test`); chromium installed with `npx playwright install chromium`.
    - `vitest.config.js` sets `test: { maxWorkers: 2, include: ['tests/*.test.js'] }`; `playwright.config.js` uses `testDir: tests/e2e`, `webServer` = `npm run build && npm start` with `PORT=5173`, `TALLER_PLAZAS=2`, a temporary `TALLER_DATA`, and `video: 'on'`.
    - `index.html` has the page shell with a main section and the `#organizacion` section, loading `/src/ui/main.js`.
    - `server.js` serves `dist/` and mounts the API when `src/server/api.js` exists (existsSync check), listening on `process.env.PORT` and `process.env.HOST` (default `0.0.0.0`, never `127.0.0.1` hard-coded); `.gitignore` lists `node_modules`, `dist`, `data`, `evidencias/**/*.webm`.
    - `README.md` explains how to install (`npm install`), test (`npm test`, `npm run test:e2e`) and start (`npm run build && npm start`, `PORT`, `HOST`, `TALLER_PLAZAS`, `TALLER_DATA`).
  - **Refs:** FASE-0, REQ-C-002

## Slices

### UC-001 — Reglas del taller y mensajes

- [ ] TASK-F0-002 Domain rules, message catalog and JSON store, test-first | `src/domain/taller.js`, `src/messages.js`, `src/server/store.js`, `tests/domain.test.js`, `tests/messages.test.js`, `tests/store.test.js`
  - blocked-by: TASK-F0-001
  - **Commit:** `feat(taller): add domain rules, message catalog and json store`
  - **Acceptance:** Test first (each test named with its id, literal values from the criterion):
    - `tests/domain.test.js`: `REQ-F-002 AC3` (apuntar "Marta" twice with 2 plazas → one "Marta", resultado duplicado); `REQ-F-003 AC3` (repeat "Lucía" → puesto 1 kept, duplicado); `REQ-F-004 AC1` (`"   "` → resultado vacío, state unchanged); `REQ-F-005 AC1` (baja "Álex" with Lucía 1/Álex 2 → espera has only Lucía at puesto 1); `REQ-F-005 AC2` (baja "Lucía" → Álex at puesto 1); `REQ-F-005 AC3` (baja "Marta" twice → 1 apuntado, no "Marta", second call unchanged); `REQ-F-006 AC1` (baja "Pablo" with Lucía 1 → Lucía apuntada, 2 de 2); `REQ-F-006 AC3` (baja of an apuntado with Lucía 1/Álex 2 → Álex puesto 1, espera length 1); `REQ-F-008 AC1` (plazas 3 with 2 full and Lucía 1/Álex 2 → Lucía third apuntada, espera 1); `REQ-F-008 AC2` (plazas 1 with 2 apuntados → rejected, minimum 2); `REQ-F-008 AC3` ("abc" and 0 → rejected); `REQ-F-008 AC4` (same 3 → state unchanged). Names compared trimmed and case-insensitively.
    - `tests/messages.test.js`: `REQ-NF-001 AC1` (no word ending -ado/-ada/-ido/-ida and no "o/a" or "@" in the catalog); `REQ-NF-001 AC2` (the text around "Marta" and "Pablo" is identical); `REQ-C-001` (catalog equals the expected Spanish texts: "Plaza confirmada para {nombre}", "{nombre}, estás en la lista de espera en el puesto {posicion}", "{nombre} ya está en el taller", "Baja registrada para {nombre}", "Escribe un nombre para apuntarte", "No se pueden reducir las plazas por debajo de {n} personas apuntadas", "Indica un número de plazas de 1 o más", "Nadie en la lista de espera").
    - `tests/store.test.js`: `REQ-F-001 AC1` initial state is 10 plazas, empty lists (2 with `TALLER_PLAZAS=2`); state persists to the file in `TALLER_DATA` and reloads.
  - **Refs:** FASE-0, REQ-F-001, REQ-F-002, REQ-F-003, REQ-F-004, REQ-F-005, REQ-F-006, REQ-F-008, REQ-NF-001, REQ-C-001, D-PA-003, D-PA-005, D-PA-006

### UC-002 — API compartida

- [ ] TASK-F0-003 Shared JSON API and Vite wiring, test-first | `src/server/api.js`, `vite.config.js`, `tests/api.test.js`
  - blocked-by: TASK-F0-002
  - **Commit:** `feat(api): expose shared lists over /api and register it in vite`
  - **Acceptance:** Test first in `tests/api.test.js` (real HTTP server on a temporary `TALLER_DATA`, 2 plazas, two independent `fetch` clients with no shared state):
    - `REQ-F-009 AC1`: A posts `/api/apuntar {nombre:"Marta"}`; B `GET /api/taller` lists "Marta" first.
    - `REQ-F-009 AC2`: Marta and Pablo apuntados, A registers "Lucía" in espera; B posts `/api/plazas {plazas:3}`; A `GET /api/taller` shows plazas 3 and Lucía third apuntada.
    - `REQ-F-009 AC3`: "Marta" registered from A; a client with empty local storage `GET /api/taller` sees 1 apuntado "Marta" of 2 plazas, once.
    - Routes `GET /api/taller`, `POST /api/apuntar`, `POST /api/baja`, `POST /api/plazas` answer `{plazas, apuntados, espera, resultado}`, 400 on invalid input; same module exported as a connect-style handler used by `vite.config.js` (`configureServer`) and by `server.js`.
    - Verify: `npm run build && PORT=5199 npm start` serves `/` and `/api/taller` (then stop the server).
  - **Refs:** FASE-0, REQ-F-009, REQ-C-002, D-PA-001, D-PA-006

### UC-003 — Pantallas

- [ ] TASK-F0-004 Participant and Organización screens, test-first | `src/ui/main.js`, `tests/ui.test.js`, `tests/constraints.test.js`
  - blocked-by: TASK-F0-003
  - **Commit:** `feat(ui): render lists, forms and messages for participants and organizer`
  - **Acceptance:** Test first in `tests/ui.test.js` (jsdom, `fetch` against the real handler of TASK-F0-003 with 2 plazas, texts read from the DOM element that shows them):
    - `REQ-F-001 AC1` heading "Taller de cerámica" and "Apuntados (0 de 10 plazas)"; `REQ-F-001 AC2` "Lista de espera (0)".
    - `REQ-F-002 AC1` "Marta" in "Nombre" + "Apuntarme" → "Plaza confirmada para Marta" and "1. Marta"; `REQ-F-002 AC2` "Pablo" → "Plaza confirmada para Pablo" and "Apuntados (2 de 2 plazas)".
    - `REQ-F-003 AC1` "Lucía, estás en la lista de espera en el puesto 1"; `REQ-F-003 AC2` "Álex, estás en la lista de espera en el puesto 2" and "Lista de espera (2)".
    - `REQ-F-004 AC1` blank name shows "Escribe un nombre para apuntarte" and "Apuntados (1 de 2 plazas)".
    - `REQ-F-005 AC1` "Darse de baja" next to "Álex" shows "Baja registrada para Álex" and "Lista de espera (1)".
    - `REQ-F-006 AC1` Lucía (name kept in `localStorage` as `{nombre, estado}`) reopens after "Pablo" leaves → "Plaza confirmada para Lucía" and "Apuntados (2 de 2 plazas)"; `REQ-F-006 AC2` same for "Álex" after "Marta" leaves; `REQ-F-006 AC4` "Lucía" at puesto 2 reopens without removals → "Lucía, estás en la lista de espera en el puesto 2".
    - `REQ-F-007 AC1` Organización shows "1. Marta", "2. Pablo", "1. Lucía", "2. Álex"; `REQ-F-007 AC2` "Nadie en la lista de espera".
    - `REQ-F-008 AC1` "Plazas" 3 + "Cambiar plazas" → "Apuntados (3 de 3 plazas)", "3. Lucía", "Lista de espera (1)"; `REQ-F-008 AC2`→ "No se pueden reducir las plazas por debajo de 2 personas apuntadas" and "Apuntados (2 de 2 plazas)"; `REQ-F-008 AC3` "abc" → "Indica un número de plazas de 1 o más" and "Apuntados (0 de 2 plazas)"; `REQ-F-008 AC4` same 3 again → "Apuntados (3 de 3 plazas)", lists unchanged.
    - `tests/constraints.test.js` `REQ-C-002`: `package.json` depends on `vite` and `vitest`; `src/` never stores lists in `localStorage` (only `nombre`/`estado`) and never `fetch`es another host.
  - **Refs:** FASE-0, REQ-F-001, REQ-F-002, REQ-F-003, REQ-F-004, REQ-F-005, REQ-F-006, REQ-F-007, REQ-F-008, REQ-C-002, D-PA-002, D-PA-004

## Verification

- [ ] TASK-F0-005 Journey FASE-0 end to end with demo captures | `tests/e2e/journey.spec.js`
  - blocked-by: TASK-F0-004
  - **Commit:** `test(e2e): journey FASE-0 with screenshots and video`
  - **Acceptance:** Playwright test titled `FASE-0 journey` (2 plazas via `TALLER_PLAZAS=2`, temporary `TALLER_DATA`, the app started as in production):
    - Enters at `/` (Demo step 1) and follows the Demo table: "Marta" and "Pablo", "Lucía" and "Álex", "Lucía" again, blank name, a second browser context opening `#organizacion`, baja "Pablo" and Lucía reopening, baja "Álex", plazas 1, "abc", 3.
    - Walks through every scenario of FASE-0 `Escenarios` (REQ-F-001 AC1 … REQ-NF-001 AC2), asserting with `toHaveText`/`toContainText` the literal texts of each criterion's example on the element that shows them (REQ-NF-001 and REQ-C-001/002 are covered by their unit tests: here only the texts shown); no scenario is re-proven by logic, only shown.
    - Saves one screenshot per criterion to `evidencias/FASE-0/{REQ-F-NNN-ACn}.png` for each REQ-F scenario and the video of the run named `FASE-0` under `evidencias/FASE-0/`, attached to the test.
    - Verify: `npm run test:e2e` passes.
  - **Refs:** FASE-0, REQ-F-001, REQ-F-002, REQ-F-003, REQ-F-004, REQ-F-005, REQ-F-006, REQ-F-007, REQ-F-008, REQ-F-009, REQ-F-001 AC1, REQ-F-001 AC2, REQ-F-002 AC1, REQ-F-002 AC2, REQ-F-002 AC3, REQ-F-003 AC1, REQ-F-003 AC2, REQ-F-003 AC3, REQ-F-004 AC1, REQ-F-005 AC1, REQ-F-005 AC2, REQ-F-005 AC3, REQ-F-006 AC1, REQ-F-006 AC2, REQ-F-006 AC3, REQ-F-006 AC4, REQ-F-007 AC1, REQ-F-007 AC2, REQ-F-008 AC1, REQ-F-008 AC2, REQ-F-008 AC3, REQ-F-008 AC4, REQ-F-009 AC1, REQ-F-009 AC2, REQ-F-009 AC3

## Acceptance fixes

- [ ] TASK-F0-006 Catalog test asserts the whole REQ-C-001 AC1 text | `tests/messages.test.js`
  - **Commit:** `test(messages): assert every interface text in Spanish for REQ-C-001 AC1`
  - **Acceptance:** `REQ-C-001 AC1` compares all messages and all labels with the exact Spanish text and renders each message type. Source: ACCEPTANCE-ADVERSARIAL-FASE-0 (CH-002 WEAKENED-ASSERT).
  - **Refs:** FASE-0, REQ-C-001
