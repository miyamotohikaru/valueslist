/**
 * research/*.json（裏取りの原本）→ src/data/values.json（掲載データ）
 *
 *   node scripts/merge-research.mjs
 *
 * 1. research/shelf*.json を読み、研究側で drop のもの・本文のない検証メモ・EXCLUDE を落とす
 * 2. scripts/editorial.mjs の EDITS を当てる（置換前の文字列が見つからなければ止まる）
 * 3. scripts/curve-map.mjs でグラフを組む（datasets.json の全年次を優先）
 * 4. 棚順 → 叩き台の番号順に並べて NO.001〜 を振る
 * 5. research/audit/*.json（独立した監査の修正案）を当てる
 * 6. scripts/final-overrides.mjs を重ねる
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EXCLUDE, EDITS } from "./editorial.mjs";
import { CURVE_MAP, KOKKAI_NOTE } from "./curve-map.mjs";
import { FINAL, GLOBAL_REPLACE, CURVE_TITLES } from "./final-overrides.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RESEARCH = path.join(ROOT, "research");
const OUT = path.join(ROOT, "src/data/values.json");

const files = fs.readdirSync(RESEARCH).filter((f) => /^shelf.*\.json$/.test(f)).sort();
const datasets = JSON.parse(fs.readFileSync(path.join(RESEARCH, "datasets.json"), "utf8"));
const problems = [];

// ── パス操作 ────────────────────────────────────────────
const getAt = (obj, p) => p.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
function setAt(obj, p, value) {
  const keys = p.split(".");
  const last = keys.pop();
  const parent = keys.reduce((o, k) => o[k], obj);
  parent[last] = value;
}

function applyEdits(it, e) {
  const name = it.name_ja;
  for (const [p, from, to] of e.replace ?? []) {
    const cur = getAt(it, p);
    if (typeof cur !== "string" || !cur.includes(from)) {
      problems.push(`[${name}] replace ${p}: 置換前が見つからない「${from.slice(0, 30)}…」`);
      continue;
    }
    setAt(it, p, cur.replace(from, to));
  }
  for (const [p, value, expect] of e.set ?? []) {
    const cur = getAt(it, p);
    const curText = typeof cur === "string" ? cur : JSON.stringify(cur ?? "");
    if (expect && !curText.includes(expect)) {
      problems.push(`[${name}] set ${p}: 期待した「${expect}」が含まれていない`);
      continue;
    }
    setAt(it, p, value);
  }
  if (e.removeKeyfacts) it.keyfacts = it.keyfacts.filter((_, i) => !e.removeKeyfacts.includes(i));
  if (e.removeBody) it.body_ja = it.body_ja.filter((_, i) => !e.removeBody.includes(i));
  for (const k of ["made", "discontinued", "restocked"]) {
    if (!(k in e)) continue;
    if (e[k] === null) it[k] = null;
    else if (it[k]) it[k] = { ...it[k], ...e[k] };
    else problems.push(`[${name}] ${k} を上書きしようとしたが元が null`);
  }
  if (e.name) it.name_ja = e.name;
  if (e.en) it.name_en = e.en;
  if (e.trend) it.trend = e.trend;
  if (e.evidence) it.evidence_type = e.evidence;
  if (e.shelf !== undefined) it.shelf = e.shelf;
  if (e.hitokoto) it.hitokoto = e.hitokoto;
  if (e.noCurve) it.curve = null;
}

// ── グラフ ─────────────────────────────────────────────
const srcStr = (s) => (Array.isArray(s) ? s.join(" ／ ") : s ?? "");

function fromDataset(spec) {
  const d = datasets[spec.key];
  if (!d) {
    problems.push(`データセット ${spec.key} がない`);
    return null;
  }
  const trim = (pts) => (spec.trimFrom ? pts.filter(([y]) => y < spec.trimFrom) : pts);
  const series = spec.series
    .filter((n) => {
      if (!d.series[n]) problems.push(`${spec.key} に系列「${n}」がない`);
      return !!d.series[n];
    })
    .map((n) => ({ name: n, points: trim(d.series[n]) }));
  const isKokkai = spec.key.startsWith("D4_");
  const title = spec.trimFrom && isKokkai ? `${d.title}（〜${spec.trimFrom - 1}年）` : d.title;
  const note = [isKokkai ? KOKKAI_NOTE : cleanNote(d.note), spec.note].filter(Boolean).join(" ");
  return { kind: spec.kind ?? "line", title, unit: d.unit, source: srcStr(d.source), note, series, marks: spec.marks ?? [] };
}

/** datasets.json の note は取得メモを兼ねているので、読者向けに最初の段落だけ使う */
function cleanNote(n) {
  if (!n) return "";
  return n.split("\n")[0].trim();
}

function fromResearch(it, spec = {}) {
  const c = it.curve;
  if (!c || !c.points || c.points.length === 0) {
    problems.push(`[${it.name_ja}] 研究側の curve に点がない`);
    return null;
  }
  const series = [{ name: spec.seriesName ?? c.series_name ?? shortSeriesName(c.title), points: c.points }];
  let title = spec.title ?? c.title;
  let source = srcStr(c.source);
  if (spec.extraSeries) {
    const d = datasets[spec.extraSeries.key];
    for (const n of spec.extraSeries.series) if (d?.series[n]) series.push({ name: n, points: d.series[n] });
    source = `${source} ／ ${srcStr(d?.source)}`;
  }
  return { kind: "line", title, unit: c.unit, source, note: c.note ?? "", series, marks: spec.marks ?? [] };
}

function shortSeriesName(title) {
  const m = title.match(/「([^」]+)」/);
  return m ? m[1].slice(0, 18) : "割合";
}

function buildCurves(it) {
  const spec = CURVE_MAP[it.name_ja];
  if (it.curve === null) return { curve: null, extra: [] };
  let primary = null;
  if (spec?.key) primary = fromDataset(spec);
  else if (spec?.research) primary = fromResearch(it, spec);
  else if (it.curve?.points?.length) primary = fromResearch(it);
  const extra = (spec?.extra ?? [])
    .map((x) => (x.research ? fromResearch(it, x) : fromDataset(x)))
    .filter(Boolean);
  return { curve: primary, extra };
}

// ── 読み込み → 整形 ────────────────────────────────────
let items = [];
for (const f of files) {
  for (const raw of JSON.parse(fs.readFileSync(path.join(RESEARCH, f), "utf8"))) {
    if (!raw.name_ja || !raw.body_ja || !raw.hitokoto) continue; // 検証メモ
    if (raw.verdict === "drop") continue;
    if (EXCLUDE.has(raw.name_ja)) continue;
    const it = structuredClone(raw);
    const e = EDITS[it.name_ja];
    if (!e) problems.push(`[${it.name_ja}] EDITS がない（英名・札ラベルが未整理）`);
    else applyEdits(it, e);
    items.push(it);
  }
}

const shelfOrder = (s) => (s === "meta" ? 99 : Number(s));
items.sort((a, b) => shelfOrder(a.shelf) - shelfOrder(b.shelf) || (a.draft_no ?? 999) - (b.draft_no ?? 999));

const dp = (d) =>
  d
    ? {
        label: d.label ?? "",
        year: Number(d.year),
        ...(d.approx ? { approx: true } : {}),
        ...(d.fact ? { fact: d.fact } : {}),
        ...(d.source ? { source: srcStr(d.source) } : {}),
        ...(d.as ? { as: d.as } : {}),
      }
    : null;

const values = items.map((it, i) => {
  const { curve, extra } = buildCurves(it);
  const hk = it.hitokoto ?? "";
  if (hk.length > 42) problems.push(`[${it.name_ja}] ひとことが長い（${hk.length}字）`);
  return {
    no: String(i + 1).padStart(3, "0"),
    name: it.name_ja,
    reading: it.reading ?? "",
    en: it.name_en ?? "",
    category: it.category,
    shelf: it.shelf === "meta" ? "meta" : Number(it.shelf),
    evidence: it.evidence_type === "curve" && curve ? "curve" : "law",
    trend: it.trend,
    made: dp(it.made),
    discontinued: dp(it.discontinued),
    restocked: dp(it.restocked),
    hitokoto: hk,
    body: it.body_ja,
    keyfacts: (it.keyfacts ?? []).map((k) => ({ text: k.text, ...(k.source ? { source: srcStr(k.source) } : {}) })),
    curve,
    ...(extra.length ? { extraCurves: extra } : {}),
    sources: (it.sources ?? []).map(srcStr),
    confidence: it.confidence ?? "B",
  };
});

// ── 監査の修正案 ───────────────────────────────────────
const AUDIT_DIR = path.join(RESEARCH, "audit");
// 監査のあとに別の修正で同じ結果になった（修正案が不要になった）もの
const AUDIT_OBSOLETE = new Set(["持ち家こそ一人前|curve.series.0.name"]);
const byName = new Map(values.map((v) => [v.name, v]));
let auditApplied = 0;
for (const f of fs.existsSync(AUDIT_DIR) ? fs.readdirSync(AUDIT_DIR).filter((x) => x.endsWith(".json")).sort() : []) {
  for (const a of JSON.parse(fs.readFileSync(path.join(AUDIT_DIR, f), "utf8"))) {
    if (a.field === "lineages.ts") continue; // 系譜は lineages.ts 側で直す
    if (AUDIT_OBSOLETE.has(`${a.name}|${a.field}`)) continue;
    const v = byName.get(a.name);
    if (!v) {
      problems.push(`[監査 ${f}] 「${a.name}」が掲載データにない`);
      continue;
    }
    const cur = getAt(v, a.field);
    if (typeof cur !== "string" || !cur.includes(a.from)) {
      problems.push(`[監査 ${f}] ${a.name} ${a.field}: 置換前が見つからない「${String(a.from).slice(0, 30)}…」`);
      continue;
    }
    setAt(v, a.field, cur.replace(a.from, a.to));
    auditApplied++;
  }
}
// 置換で空になった keyfacts や、句読点の重なりを掃除する
for (const v of values) {
  v.keyfacts = v.keyfacts.filter((k) => k.text && k.text.trim());
  v.body = v.body.map((p) => p.replace(/\s{2,}/g, " ").trim()).filter(Boolean);
}

// ── 最終調整 ───────────────────────────────────────────
for (const [name, e] of Object.entries(FINAL)) {
  const v = byName.get(name);
  if (!v) {
    problems.push(`[最終調整] 「${name}」が掲載データにない`);
    continue;
  }
  if (e.hitokoto) v.hitokoto = e.hitokoto;
  for (const k of ["made", "discontinued", "restocked"]) if (e[k]) v[k] = { ...v[k], ...e[k] };
  for (const [p, from, to] of e.replace ?? []) {
    const cur = getAt(v, p);
    if (typeof cur !== "string" || !cur.includes(from)) {
      problems.push(`[最終調整] ${name} ${p}: 置換前が見つからない「${from.slice(0, 30)}…」`);
      continue;
    }
    setAt(v, p, cur.replace(from, to));
  }
}
// グラフの見出し（長い括弧書きを小見出しへ）
{
  const used = new Set();
  for (const v of values) {
    for (const c of [v.curve, ...(v.extraCurves ?? [])]) {
      if (!c) continue;
      const t = CURVE_TITLES[c.title];
      if (!t) continue;
      used.add(c.title);
      c.title = t.title;
      if (t.subtitle) c.subtitle = t.subtitle;
    }
  }
  for (const k of Object.keys(CURVE_TITLES)) if (!used.has(k)) problems.push(`[グラフ見出し] 「${k.slice(0, 30)}…」が掲載データにない`);
}
// 研究用の注記の掃除（全フィールド。グラフの点は除く）
const scrub = (o) => {
  if (typeof o === "string") return GLOBAL_REPLACE.reduce((s, [a, b]) => s.split(a).join(b), o);
  if (Array.isArray(o)) return o.map(scrub);
  if (o && typeof o === "object") {
    for (const k of Object.keys(o)) if (k !== "points") o[k] = scrub(o[k]);
    return o;
  }
  return o;
};
values.forEach(scrub);
for (const v of values) if (v.hitokoto.length > 42) problems.push(`[${v.name}] ひとことが長い（${v.hitokoto.length}字）`);

fs.writeFileSync(OUT, JSON.stringify(values, null, 2) + "\n");
console.log(`audit patches applied: ${auditApplied}`);
console.log(`wrote ${values.length} items → ${path.relative(ROOT, OUT)}\n`);
for (const v of values) {
  const c = v.curve ? `${v.curve.kind}:${v.curve.series.map((s) => s.points.length).join("+")}` : "-";
  const x = v.extraCurves ? ` +${v.extraCurves.length}` : "";
  console.log(`${v.no} [${v.shelf}] ${v.name}  ${v.trend}/${v.evidence}  curve=${c}${x}  「${v.hitokoto}」`);
}
if (problems.length) {
  console.log(`\n⚠ ${problems.length} problems`);
  for (const p of problems) console.log("  - " + p);
  process.exitCode = 1;
}
