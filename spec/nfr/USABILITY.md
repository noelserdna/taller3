# NFR — Usabilidad

> Refs: REQ-NF-001; ADR-004.

| ID | Métrica / Control | Objetivo | Punto de fallo | Medición / Cumplimiento | Refs |
|---|---|---|---|---|---|
| SPEC-USA-001 | Formas con género en el catálogo `src/messages.js` (-ado/-ada/-ido/-ida, "o/a", "@") dirigidas a la persona | 0 | ≥ 1 | Test que escanea todos los textos del catálogo e ignora las palabras que concuerdan con un sustantivo del mensaje ("confirmada" con "plaza", "registrada" con "baja") | REQ-NF-001 AC1, ADR-004 |
| SPEC-USA-002 | Texto alrededor del nombre al mostrar el mismo mensaje con "Marta" y con "Pablo" | idéntico | cualquier diferencia | Test que genera cada mensaje con ambos nombres y compara el texto sin el nombre | REQ-NF-001 AC2, ADR-004 |
