/**
 * src/data/en/*.json（訳の分担ファイル）を1つにまとめて
 * src/data/values.en.json を作る。
 *   node scripts/merge-en.mjs
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "src/data/en");

const files = (await readdir(DIR)).filter((f) => f.endsWith(".json")).sort();
const out = {};
for (const f of files) {
  const part = JSON.parse(await readFile(path.join(DIR, f), "utf8"));
  for (const [no, v] of Object.entries(part)) {
    if (out[no]) throw new Error(`${no} が ${f} と別のファイルで重なっている`);
    out[no] = v;
  }
}
const nos = Object.keys(out).sort();
await writeFile(path.join(ROOT, "src/data/values.en.json"), JSON.stringify(out, null, 1) + "\n", "utf8");
console.log(`${files.length}ファイル / ${nos.length}件 → src/data/values.en.json`);
// 掲載データの側を基準に、訳の無い札を出す
const all = JSON.parse(await readFile(path.join(ROOT, "src/data/values.json"), "utf8")).map((v) => v.no);
const missing = all.filter((n) => !out[n]);
if (missing.length) console.log("まだ訳が無い:", missing.join(","));
