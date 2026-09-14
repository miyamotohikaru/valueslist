/**
 * 共有時に出る絵（1200×630）を焼く。
 *   node tools/shoot-og.mjs [URL]   既定は http://localhost:3014
 *
 * /og-card（版下のページ）を 1200×630 で撮って public/og.png に書き、
 * 絵のハッシュを src/app/og-version.ts に書く。SNS は og:image を URL 単位で
 * 覚えるので、焼くたびに ?v= が変わるようにしている。見た目を変えたら焼き直す。
 */
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = (process.argv[2] ?? "http://localhost:3014").replace(/\/$/, "");

const browser = await puppeteer.launch({ executablePath: CHROME, args: ["--headless=new", "--hide-scrollbars"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(`${SITE}/og-card`, { waitUntil: "networkidle0", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 800));
  const out = path.join(ROOT, "public/og.png");
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  const version = createHash("sha256").update(await readFile(out)).digest("hex").slice(0, 8);
  await writeFile(
    path.join(ROOT, "src/app/og-version.ts"),
    `// tools/shoot-og.mjs が og.png を焼くたびに書き換える。手で触らない。\nexport const OG_VERSION = "${version}";\n`,
    "utf8",
  );
  console.log(`public/og.png (${version})`);
} finally {
  await browser.close();
}
