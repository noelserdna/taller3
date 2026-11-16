# ADR-002 — Las reglas del taller son funciones puras

| Campo | Valor |
|---|---|
| Estado | Aceptada · 2026-11-16 |
| Refs | INV-TAL-001; INV-TAL-004; INV-TAL-008; RN-003; WF-001 |

## Contexto
Las invariantes del taller (INV-TAL-001..008) deben poder comprobarse sin servidor, fichero ni navegador.

## Decisión
Cada regla es una función pura estado → {estado, resultado}, sin entrada/salida. El servidor solo lee, invoca la regla y guarda (WF-001 pasos 4-6).

## Alternativas
| Opción | Por qué no |
|---|---|
| Reglas dentro de los manejadores del servidor | Difíciles de probar por propiedades |
| Reglas en el navegador | Los datos son compartidos (ADR-001) |

## Consecuencias
- + Pruebas de propiedades directas (PROP-001..010).
- − El servidor debe cablear lectura y guardado alrededor de cada regla.
