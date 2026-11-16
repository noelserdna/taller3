# ADR-003 — La sección Organización no tiene autenticación

| Campo | Valor |
|---|---|
| Estado | Aceptada · 2026-11-16 |
| Refs | RN-002; REQ-F-007; REQ-F-008; REQ-C-002 |

## Contexto
El cliente decidió que Organización esté abierta (RN-002) y que no haya cuentas (REQ-C-002).

## Decisión
Ninguna operación comprueba identidad ni permisos. Cualquier persona puede ver Organización y cambiar las plazas.

## Alternativas
| Opción | Por qué no |
|---|---|
| Contraseña de organizadora | Descartada por el cliente (RN-002) |
| Cuentas de usuario | Prohibidas por REQ-C-002 |

## Consecuencias
- + Sin fricción de acceso.
- − Cualquiera puede cambiar las plazas; riesgo aceptado, acotado por E_PLAZAS_BAJO_APUNTADOS (nadie pierde su plaza).
- Las categorías de seguridad de autenticación quedan como "No aplica" en SECURITY.md.
