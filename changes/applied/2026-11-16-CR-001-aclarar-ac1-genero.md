# CR-001 — Aclarar REQ-NF-001 AC1 (palabras que concuerdan con un sustantivo)
Status: APPLIED
Change: CHG-2026-11-16-001 · Source: intent/INT-002.md (puerta g17947884683fb4, Q-acceptance-001, opción A) · Type: MODIFY (perfective)

Antes: `WHEN scanned for words ending in -ado/-ada/-ido/-ida and "o/a" forms THEN none is found`
Después: `WHEN scanned for words ending in -ado/-ada/-ido/-ida and "o/a" forms, ignoring words that agree with a noun of the message ("confirmada" with "plaza", "registrada" with "baja") and not with the person THEN none is found`
