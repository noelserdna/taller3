# 02 — Entidades

```typescript
/** ENT-001 — Taller. Estado compartido único. Ciclo de vida de cada nombre: SM-001. Invariantes: INV-TAL-001..008. */
interface Taller {
  plazas: number;        // VO-002, valor inicial PLAZAS_INICIALES
  apuntados: Nombre[];   // VO-001, orden de entrada
  espera: Nombre[];      // VO-001, orden de llegada; puesto = índice + 1 (INV-TAL-005)
}
/** ENT-002 — Almacén compartido. Guarda un único Taller en el servidor (INV-STO-001, INV-STO-002, ADR-001). */
interface AlmacenCompartido { leer(): Taller; escribir(t: Taller): void }
/** ENT-003 — Recuerdo del dispositivo. Solo el nombre usado al apuntarse y su último estado visto (ADR-005, RN-008). */
interface RecuerdoDispositivo { nombre: Nombre; estado: 'apuntado' | 'espera' }
```

Relaciones: ENT-002 contiene un ENT-001 (1 → 1); ENT-001 contiene 0..n nombres en cada lista; ENT-003 vive solo en el navegador y nunca guarda las listas (INV-STO-001).
