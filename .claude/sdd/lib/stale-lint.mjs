// Vendored by sdd-pipeline 0.3.2 (scripts/lib/stale-lint.mjs) by install-git-hooks.sh; re-install overwrites it — edit the plugin, not this copy.
// stale-lint.mjs — `sdd lint --stale`: after a requirements change, which documents still say the old thing?
// Node >= 18, no dependencies. Library only: no console output, no process.exit.
//
// The club (Hermes, 11/2026): after the change INT-004 six documents (test/TEST-MATRIX-UC-013.md, test/E2E-SCENARIOS.md,
// ux/WIREFRAMES.md, ux/INTERACTION-MODEL.md, ux/ACCESSIBILITY-SPEC.md, plan/fases/FASE-4-CLASES.md) kept the old texts,
// and code and documents cited UC-023..025, which no document defines. Both are found without an LLM:
//
//   S-01 error  a document quotes a text ("…", «…», “…”) that some earlier version of requirements/REQUIREMENTS.md
//               quoted and the current one no longer contains: the text was changed or removed by a change.
//   S-02 error  a document cites an id that does not exist: a REQ-… that requirements/REQUIREMENTS.md does not have
//               (deprecated ones exist), or a UC-/WF- that no document defines (a heading, a file name or the first
//               cell of a table row in requirements/, spec/, ux/, design/, test/, plan/ or task/).
//
// Documents: Markdown under spec/, ux/, design/, test/, plan/ and task/ (changes/, audits/, acceptance/, status/ and
// the CHANGELOGs are history and are not read). A document that is history on purpose says so in its first 20 lines
// with «Desfasado por INT-004» (or CHG-…, CR-…; English: «Superseded by INT-004») and is listed as marked, not as an
// error; the same words on one line silence that line only.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { git } from "./git-log.mjs";
import { normLiteral } from "./quotes.mjs";
import { parseRequirements } from "../sdd-jev.mjs";

export const STALE_DIRS = ["spec", "ux", "design", "test", "plan", "task"];
const DEF_DIRS = ["requirements", ...STALE_DIRS];
const HISTORY_FILE = /(^|\/)(CHANGELOG|CLARIFY-LOG)[^/]*\.md$/i;
export const MARK_RE = /\b(?:Desfasad[oa] por|Superseded by|Stale since)\s+((?:INT|CHG|CR)-[\w-]+)/i;
const HEAD_MARK = /^\s*(?:>\s*)?(?:\*\*|_)?\s*(?:Desfasad[oa] por|Superseded by|Stale since)\s+(?:INT|CHG|CR)-/i;
const QUOTE_RES = [/«([^»\n]+)»/g, /“([^”\n]+)”/g, /"([^"\n]+)"/g];
const REQ_ID = /(?<![A-Za-z0-9-])(REQ-[A-Z]+(?:-[A-Z0-9]+)*-\d{3,})(?![A-Za-z0-9])/g;
const DEF_ID = /(?<![A-Za-z0-9-])((?:UC|WF)-\d{3,})(?![A-Za-z0-9])/g;

/** Quoted texts of a line, normalized, that are worth comparing (at least 5 characters, with letters). */
export function quotedTexts(line) {
  const out = [];
  let rest = line;
  for (const re of QUOTE_RES) {
    for (const m of [...rest.matchAll(re)]) {
      const n = normLiteral(m[1]);
      if (n.length >= 5 && /\p{L}.*\p{L}/u.test(n)) out.push({ text: m[1].trim(), norm: n });
      rest = rest.slice(0, m.index) + " ".repeat(m[0].length) + rest.slice(m.index + m[0].length);
    }
  }
  return out;
}

function textsOf(content) {
  const s = new Set();
  for (const l of String(content || "").split("\n")) for (const q of quotedTexts(l)) s.add(q.norm);
  return s;
}

/** Earlier versions of the requirements file in git (oldest last); [] outside git or without history. */
export function requirementVersions(root, rel = "requirements/REQUIREMENTS.md") {
  const pre = git(root, ["rev-parse", "--show-prefix"]);
  if (pre.status !== 0) return [];
  const full = (pre.stdout.trim() + rel).replace(/\\/g, "/");
  const log = git(root, ["log", "--format=%H", "--", rel]);
  if (log.status !== 0) return [];
  const out = [];
  for (const sha of log.stdout.split("\n").filter(Boolean)) {
    const r = git(root, ["show", `${sha}:${full}`]);
    if (r.status === 0) out.push({ sha, text: r.stdout });
  }
  return out;
}

function walk(abs, acc, depth = 0) {
  let st;
  try { st = statSync(abs); } catch { return acc; }
  if (st.isDirectory()) {
    if (depth > 6) return acc;
    let es = [];
    try { es = readdirSync(abs).sort(); } catch { return acc; }
    for (const e of es) if (!e.startsWith(".") && e !== "node_modules") walk(path.join(abs, e), acc, depth + 1);
  } else if (/\.md$/i.test(abs) && st.size < 4 * 1024 * 1024) acc.push(abs);
  return acc;
}

/** UC-/WF- ids some document defines: in a heading, in a file name, or as the first cell of a table row. */
export function definedIds(root) {
  const ids = new Set();
  for (const d of DEF_DIRS) for (const f of walk(path.join(root, d), [])) {
    for (const m of path.basename(f).matchAll(DEF_ID)) ids.add(m[1]);
    let t = "";
    try { t = readFileSync(f, "utf8"); } catch { continue; }
    for (const l of t.split("\n")) {
      const def = /^\s*#{1,6}\s/.test(l) ? l : (l.match(/^\s*\|([^|]*)\|/) || [])[1];
      if (def) for (const m of def.matchAll(DEF_ID)) ids.add(m[1]);
    }
  }
  return ids;
}

/**
 * Run the lint. opts: { root, requirements (path, default requirements/REQUIREMENTS.md) }.
 * Returns { findings: [{ code, severity, file, line, text?, id?, since?, message }], marked: [{ file, by }],
 *           removed: number, versions: number, summary: { files, errors, marked } }.
 */
export function lintStale({ root, requirements = "requirements/REQUIREMENTS.md" } = {}) {
  const reqAbs = path.resolve(root, requirements);
  const current = existsSync(reqAbs) ? readFileSync(reqAbs, "utf8") : "";
  const currentTexts = textsOf(current);
  const currentFlat = normLiteral(current);
  // Texts some earlier version quoted that the current one does not hold (not even inside a longer text)
  const removed = new Map();
  const versions = requirementVersions(root, path.relative(root, reqAbs).split(path.sep).join("/"));
  for (const v of versions) {
    for (const t of textsOf(v.text)) {
      if (currentTexts.has(t) || currentFlat.includes(t) || removed.has(t)) continue;
      removed.set(t, v.sha);
    }
  }
  // Earlier versions are newest first, so the sha kept is the newest version that still quoted the text.
  const reqIds = new Set(parseRequirements(current).map((r) => r.id));
  const defs = definedIds(root);
  const haveReqs = reqIds.size > 0;
  const findings = [], marked = [];
  let files = 0;
  for (const d of STALE_DIRS) for (const abs of walk(path.join(root, d), [])) {
    const rel = path.relative(root, abs).split(path.sep).join("/");
    if (HISTORY_FILE.test(rel)) continue;
    let text;
    try { text = readFileSync(abs, "utf8"); } catch { continue; }
    files++;
    const lines = text.split("\n");
    // The document's own mark: a line of its first 20 that starts with it (a blockquote or bold are fine)
    const headLine = lines.slice(0, 20).find((l) => HEAD_MARK.test(l));
    if (headLine) { marked.push({ file: rel, by: headLine.match(MARK_RE)[1] }); continue; }
    lines.forEach((l, i) => {
      if (MARK_RE.test(l)) return;
      for (const q of quotedTexts(l)) {
        if (!removed.has(q.norm)) continue;
        const since = removed.get(q.norm);
        findings.push({ code: "S-01", severity: "error", file: rel, line: i + 1, text: q.text, since,
          message: `quotes "${q.text}", which requirements/REQUIREMENTS.md no longer says (last in ${since.slice(0, 7)}): update it, or mark the document «Desfasado por INT-…»` });
      }
      if (haveReqs) for (const m of l.matchAll(REQ_ID)) {
        if (reqIds.has(m[1])) continue;
        findings.push({ code: "S-02", severity: "error", file: rel, line: i + 1, id: m[1],
          message: `cites ${m[1]}, which requirements/REQUIREMENTS.md does not have` });
      }
      for (const m of l.matchAll(DEF_ID)) {
        if (defs.has(m[1])) continue;
        findings.push({ code: "S-02", severity: "error", file: rel, line: i + 1, id: m[1],
          message: `cites ${m[1]}, which no document defines (heading, file name or first cell of a table row)` });
      }
    });
  }
  // One finding per file, line and id/text
  const seen = new Set();
  const unique = findings.filter((f) => { const k = `${f.file}:${f.line}:${f.code}:${f.id || f.text}`; if (seen.has(k)) return false; seen.add(k); return true; });
  return { findings: unique, marked, removed: removed.size, versions: versions.length,
    summary: { files, errors: unique.length, marked: marked.length } };
}
