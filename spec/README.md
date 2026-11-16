# Especificaciones — taller3

> Desde `requirements/REQUIREMENTS.md` v1.1 (2026-11-16). Decisiones: `CLARIFICATIONS.md`. Prosa en español; ids, código y Gherkin en inglés.

Web para apuntarse a un taller de cerámica con plazas limitadas: lista de apuntados, lista de espera con puesto, bajas con promoción automática y una sección Organización. Los datos viven en el servidor de la propia aplicación.

| Path | Contenido | Empieza aquí si… |
|---|---|---|
| `domain/` | glosario, entidades, objetos de valor + catálogos, estados, invariantes | escribes o revisas cualquier cosa |
| `use-cases/UC-001..005` | un caso de uso por función | implementas una función |
| `workflows/WF-001` | ciclo de una operación sobre las listas | tocas el servidor |
| `contracts/` | `API-taller`, `EVENTS-taller`, `PERMISSIONS-MATRIX` | implementas una operación |
| `tests/` | `BDD-UC-NNN`, `PROPERTY-TESTS` | escribes pruebas |
| `adr/`, `nfr/` | decisiones y requisitos no funcionales | cuestionas una decisión |
| `VALUE-REGISTRY.md`, `DERIVED-SPECS.md`, `CLARIFICATIONS*.md`, `TRACEABILITY-MATRIX.md` | valores, derivadas, decisiones, pendientes y trazabilidad | auditas |

Notas para `sdd-spec-auditor`:
- Contrato en estilo `operations`: rutas y verbos se deciden en `design/OPERATION-MAPPING.md`.
- No hay `EVENTS` ni permisos reales: sin cuentas (ADR-003).
