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
const missing = Array.from({ length: 48 }, (_, i) => String(i + 1).padStart(3, "0")).filter((n) => !out[n]);
if (missing.length) console.log("まだ訳が無い:", missing.join(","));
