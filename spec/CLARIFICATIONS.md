# Aclaraciones (reglas de negocio)

> Decididas por: Andres Leon (Cliente) en la fase de requisitos (Q-requirements-engineer-001, -002) y por defecto del método (clase R) · 2026-11-16. Cada RN vincula a todo `spec/`.

## Decisiones de formato

| # | Pregunta | Decisión | Descartado |
|---|---|---|---|
| D-001 | Formato de la especificación | árbol modular `spec/` con casos de uso, BDD y contratos | SRS monolítico; historias |
| D-002 | Estilo del contrato | `operations` (ningún REQ exige API HTTP para clientes externos) | `http` |

## Reglas de negocio

| RN | Fuente | Pregunta | Regla adoptada | Descartado | Tier |
|---|---|---|---|---|---|
| RN-001 | REQ-F-008 (Q-requirements-engineer-001) | ¿Reducir plazas por debajo de los apuntados? | Se rechaza con `E_PLAZAS_BAJO_APUNTADOS`; nadie pierde su plaza | pasar los últimos a la espera | 2 |
| RN-002 | REQ-F-007 (Q-requirements-engineer-002) | ¿Organización protegida? | Abierta, sin contraseña ni cuentas | contraseña de organizadora | 2 |
| RN-003 | REQ-F-002 | ¿Qué es "el mismo nombre"? | Se recorta y se compara sin distinguir mayúsculas (`toLocaleLowerCase('es')`); si ya existe en apuntados o espera, no se duplica y el resultado es `duplicado` con el nombre ya guardado | distinguir mayúsculas; permitir repetidos | 1 (aceptada por AC de REQ-F-002/003) |
| RN-004 | REQ-F-005 | ¿Baja de un nombre que ya no está? | Sin cambios y mismo resultado `baja` (idempotente) | error | 2 |
| RN-005 | REQ-F-001 | ¿Plazas iniciales? | 10 (`PLAZAS_INICIALES`) | otro valor | 2 |
| RN-006 | REQ-F-008 | ¿Qué plazas son válidas? | Entero ≥ `PLAZAS_MINIMAS`; no numérico o 0 → `E_PLAZAS_INVALIDO`, estado intacto | aceptar decimales | 2 |
| RN-007 | REQ-F-008 | ¿Mismo número de plazas? | Sin cambios en las listas; se muestra el estado actual | error | 2 |
| RN-008 | REQ-F-006 | ¿Cómo se entera la persona promovida? | El navegador recuerda el nombre usado y, si al reabrir la persona figura en apuntados cuando antes estaba en espera, muestra "Plaza confirmada para {nombre}" | aviso externo | 2 |
