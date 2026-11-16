# ADR-005 — El navegador recuerda solo el nombre usado

| Campo | Valor |
|---|---|
| Estado | Aceptada · 2026-11-16 |
| Refs | RN-008; REQ-F-006; REQ-C-002; INV-STO-001 |

## Contexto
La persona promovida desde la espera debe enterarse al reabrir la web (RN-008), sin cuentas ni avisos externos (REQ-C-002).

## Decisión
El navegador guarda únicamente el nombre usado y el último estado visto (en espera o apuntada). Si al reabrir figura apuntada tras estar en espera, se muestra "Plaza confirmada para {nombre}". Plazas, apuntados y espera nunca se guardan en el navegador (INV-STO-001).

## Alternativas
| Opción | Por qué no |
|---|---|
| Aviso por correo o mensaje externo | Servicio de terceros, prohibido |
| Guardar las listas en el navegador | Viola INV-STO-001 |

## Consecuencias
- + Aviso sin cuentas.
- − Solo funciona en el mismo dispositivo y navegador.
