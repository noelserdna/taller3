# ADR-004 — Catálogo único de textos con redacción neutra

| Campo | Valor |
|---|---|
| Estado | Aceptada · 2026-11-16 |
| Refs | REQ-NF-001; REQ-C-001; SPEC-USA-001; SPEC-LIM-004 |

## Contexto
Todo texto visible debe estar en español (REQ-C-001) y no suponer género (REQ-NF-001). Ambas reglas se verifican leyendo los textos.

## Decisión
Todos los mensajes viven en un único módulo `src/messages.js`, con redacción neutra (por ejemplo, "Plaza confirmada para {nombre}"). Ningún otro módulo contiene texto visible.

## Alternativas
| Opción | Por qué no |
|---|---|
| Textos repartidos por el código | Un test no puede escanearlos todos |
| Formas con o/a o @ | Prohibidas por REQ-NF-001 |

## Consecuencias
- + Un solo test de escaneo cubre ambos requisitos.
- − Todo cambio de texto pasa por el catálogo.
