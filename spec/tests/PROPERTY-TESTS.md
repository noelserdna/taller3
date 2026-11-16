# Pruebas de propiedades

> Cada fila verifica un invariante de domain/05-INVARIANTS.md.

| ID | Invariante | Propiedad | Generador | Aserción |
|---|---|---|---|---|
| PROP-001 | INV-TAL-001 | Apuntados nunca superan las plazas | Secuencias aleatorias de apuntar, baja y cambiarPlazas con nombres y plazas válidas | `apuntados.length <= plazas` tras cada paso |
| PROP-002 | INV-TAL-002 | Un nombre aparece una sola vez | Nombres con variaciones de mayúsculas y espacios; secuencias de apuntar | La clave (recortada, `toLocaleLowerCase('es')`) no se repite entre apuntados y espera |
| PROP-003 | INV-TAL-003 | Nombres guardados recortados y no vacíos | Cadenas arbitrarias con espacios, tabuladores y vacías | Todo nombre guardado cumple `n === n.trim() && n.length >= 1`; vacío da `E_NOMBRE_VACIO` y estado intacto |
| PROP-004 | INV-TAL-004 | Espera no vacía implica taller lleno | Secuencias aleatorias de las tres operaciones | `espera.length === 0 \|\| apuntados.length === plazas` |
| PROP-005 | INV-TAL-005 | Orden de llegada y puesto = índice + 1 | Altas y bajas intercaladas con taller lleno | La espera conserva el orden relativo de llegada; puesto de `espera[i]` es `i + 1` |
| PROP-006 | INV-TAL-006 | Plazas entero seguro ≥ 1 | Valores: enteros, 0, negativos, decimales, texto, NaN, enteros enormes | Si es válido, `Number.isSafeInteger(p) && p >= 1`; si no, `E_PLAZAS_INVALIDO` y estado intacto |
| PROP-007 | INV-TAL-007 | Plazas no bajan de los apuntados | Estados con apuntados y valores de plazas menores o iguales | Si `p < apuntados.length`, `E_PLAZAS_BAJO_APUNTADOS` y estado intacto; si no, `plazas = p` |
| PROP-008 | INV-TAL-008 | La baja es idempotente | Estado aleatorio y nombre presente o ausente | `baja(baja(t, n), n)` iguala `baja(t, n)`; resultado `baja` |
| PROP-009 | INV-STO-001 | Datos compartidos solo en el servidor | Lectura de los ficheros de `src/` | Ningún uso de `localStorage`, `sessionStorage` ni IndexedDB para plazas, apuntados o espera |
| PROP-010 | INV-STO-002 | Operaciones sin cesión | Ráfagas de peticiones simultáneas de apuntar con una sola plaza libre | Una confirmada, las demás en espera; el código no tiene `await` entre `leer` y `escribir` |
