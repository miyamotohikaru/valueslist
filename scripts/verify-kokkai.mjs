// 国会会議録の「初出日」「件数」の主張を、語をそのまま含む発言だけで検証する
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (t) => t.replace(/[・･\s　]/g, "");
async function fetchAll(term, from, until, cap = 1500) {
  const out = [];
  let start = 1;
  let total = null;
  while (true) {
    const u = `https://kokkai.ndl.go.jp/api/speech?any=${encodeURIComponent(term)}&from=${from}&until=${until}&maximumRecords=100&startRecord=${start}&recordPacking=json`;
    let j;
    for (let a = 0; a < 3; a++) {
      try {
        const r = await fetch(u);
        j = await r.json();
        break;
      } catch (e) {
        await sleep(3000);
      }
    }
    await sleep(1300);
    if (!j) throw new Error("fetch failed " + u);
    total = j.numberOfRecords ?? 0;
    for (const s of j.speechRecord ?? []) out.push(s);
    if (!j.nextRecordPosition || out.length >= cap) break;
    start = j.nextRecordPosition;
  }
  return { total, recs: out };
}
const lit = (recs, term) => recs.filter((s) => norm(s.speech).includes(norm(term)));
const fmt = (s, term) => {
  const i = norm(s.speech).indexOf(norm(term));
  const snip = norm(s.speech).slice(Math.max(0, i - 25), i + term.length + 25);
  return `${s.date} ${s.nameOfHouse} ${s.nameOfMeeting} ${s.speaker} 「…${snip}…」`;
};

const FIRST = [
  ["終身雇用", "1961"],
  ["年功序列", "1960-12"],
  ["見合い結婚", "1956-06-01"],
  ["恋愛結婚", "1949-12-15"],
  ["結婚退職", "1964"],
  ["寿退社", "2001-10-26"],
  ["二十四時間戦えますか", "1990-06-15"],
  ["根性論", "1966-08-30"],
  ["ノミニケーション", "1992-04-23"],
  ["飲みニケーション", "1994-09-02"],
  ["ワーク・ライフ・バランス", "2003-02-12"],
  ["家族の絆", "1998-06-02"],
  ["自己責任原則", "1970-09-03"],
  ["タイパ", "2023-02-22"],
  ["推し活", "2024-02-29"],
  ["親ガチャ", "2021-10-12"],
];
const TOTAL = [
  ["恋愛結婚", 45],
  ["結婚退職", 243],
  ["寿退社", 1],
  ["二十四時間戦えますか", 9],
  ["TELハラ", 0],
  ["学歴フィルター", 0],
  ["マインドフルネス", 1],
];
const YEARLY = [
  ["副業", { 2010: 5, 2013: 9, 2016: 30, 2018: 66, 2021: 72, 2024: 97 }],
];

for (const [term, claim] of FIRST) {
  const until = claim.length === 4 ? `${claim}-12-31` : claim.length === 7 ? `${claim}-31` : claim;
  const { total, recs } = await fetchAll(term, "1945-01-01", until);
  const L = lit(recs, term).sort((a, b) => a.date.localeCompare(b.date));
  const first = L[0];
  const ok = first && first.date.startsWith(claim);
  console.log(`${ok ? "OK " : "NG "} FIRST ${term} claim=${claim} | api=${total} literal=${L.length} | earliest literal: ${first ? fmt(first, term) : "none"}`);
}
for (const [term, claim] of TOTAL) {
  const { total, recs } = await fetchAll(term, "1945-01-01", "2026-09-13");
  const L = lit(recs, term);
  const years = [...new Set(L.map((s) => s.date.slice(0, 4)))].join(",");
  console.log(`${L.length === claim ? "OK " : "NG "} TOTAL ${term} claim=${claim} | api=${total} literal=${L.length} years=${years}`);
}
for (const [term, claims] of YEARLY) {
  for (const [y, c] of Object.entries(claims)) {
    const { total, recs } = await fetchAll(term, `${y}-01-01`, `${y}-12-31`);
    const L = lit(recs, term);
    console.log(`${L.length === c ? "OK " : "NG "} YEAR ${term} ${y} claim=${c} | api=${total} literal=${L.length}`);
  }
}
