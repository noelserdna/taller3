# ADR-001 — Los datos compartidos los guarda el servidor de la propia aplicación

| Campo | Valor |
|---|---|
| Estado | Aceptada · 2026-11-16 |
| Refs | REQ-C-002; INV-STO-001; INV-STO-002; INV-TAL-001; WF-001 |

## Contexto
Todas las personas deben ver las mismas listas (REQ-C-002) sin cuentas ni servicios de terceros. Las operaciones compiten por plazas limitadas (INV-STO-002).

## Decisión
1. El servidor de la aplicación guarda plazas, apuntados y espera en un fichero JSON, con un solo proceso.
2. Cada operación lee, decide y guarda de forma síncrona, sin cesión (WF-001 pasos 3-6).
3. Cuerpo de petición máximo `CUERPO_MAX_CHARS`.

## Alternativas
| Opción | Por qué no |
|---|---|
| Base de datos externa | Prohibida por REQ-C-002 |
| Almacenamiento del navegador | Cada persona vería datos distintos (INV-STO-001) |

## Consecuencias
- + Sin carreras: dos peticiones se aplican una tras otra.
- − Un solo proceso, sin escalado horizontal; si cae, `E_SERVIDOR_NO_DISPONIBLE`.
