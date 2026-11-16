# 03 — Objetos de valor y catálogo de errores

```typescript
type Nombre = string;   // VO-001: recortado, 1+ caracteres; comparación sin distinguir mayúsculas (INV-TAL-002, INV-TAL-003, RN-003)
type Plazas = number;   // VO-002: entero seguro ≥ PLAZAS_MINIMAS (INV-TAL-006, RN-006)
type Puesto = number;   // VO-003: entero ≥ 1, posición en la lista de espera (INV-TAL-005)
type Resultado =        // VO-004
  | { tipo: 'confirmada'; nombre: Nombre }
  | { tipo: 'espera'; nombre: Nombre; puesto: Puesto }
  | { tipo: 'duplicado'; nombre: Nombre }
  | { tipo: 'baja'; nombre: Nombre }
  | { tipo: 'plazas'; plazas: Plazas }
  | { tipo: 'vacio' } | { tipo: 'plazas-invalido' } | { tipo: 'plazas-minimo'; n: number };
```

## Catálogo de textos (VO-005)
Fuente única de textos visibles: `src/messages.js` (ADR-004, REQ-C-001, REQ-NF-001). Marcadores: `{nombre}`, `{posicion}`, `{n}`, `{plazas}`.

| Resultado / etiqueta | Texto (literal) |
|---|---|
| confirmada | `Plaza confirmada para {nombre}` |
| espera | `{nombre}, estás en la lista de espera en el puesto {posicion}` |
| duplicado | `{nombre} ya está en el taller` |
| baja | `Baja registrada para {nombre}` |
| vacio | `Escribe un nombre para apuntarte` |
| plazas-minimo | `No se pueden reducir las plazas por debajo de {n} personas apuntadas` |
| plazas-invalido | `Indica un número de plazas de 1 o más` |
| sin espera (Organización) | `Nadie en la lista de espera` |
| título · apuntados · espera | `Taller de cerámica` · `Apuntados ({n} de {plazas} plazas)` · `Lista de espera ({n})` |
| controles | `Nombre`, `Apuntarme`, `Darse de baja`, `Organización`, `Plazas`, `Cambiar plazas` |
| red | `No se pudo contactar con el servidor` |

## Catálogo de errores (VO-006)
| Código | Clase | Mensaje | Resultado | Lanzado por | Refs |
|---|---|---|---|---|---|
| `E_NOMBRE_VACIO` | Validación | `Escribe un nombre para apuntarte` | vacio | API-001-02 | REQ-F-004, INV-TAL-003 |
| `E_PLAZAS_INVALIDO` | Validación | `Indica un número de plazas de 1 o más` | plazas-invalido | API-001-04 | REQ-F-008, RN-006 |
| `E_PLAZAS_BAJO_APUNTADOS` | Conflicto | `No se pueden reducir las plazas por debajo de {n} personas apuntadas` | plazas-minimo | API-001-04 | REQ-F-008, RN-001, INV-TAL-007 |
| `E_SOLICITUD_INVALIDA` | Validación | `No se pudo contactar con el servidor` (la interfaz no distingue la causa) | — | API-001-02, API-001-03, API-001-04 | REQ-C-002 |
| `E_SERVIDOR_NO_DISPONIBLE` | Infraestructura | `No se pudo contactar con el servidor` | — | API-001-01..04 | REQ-C-002, INV-STO-001 |
