import type { Metadata } from "next";
import Link from "next/link";
import CardAnatomy from "@/components/CardAnatomy";
import EvidenceTwo from "@/components/EvidenceTwo";
import TrendStamp from "@/components/TrendStamp";
import SpanStrip from "@/components/SpanStrip";
import { SHELF_ACCENT } from "@/components/ValueCard";
import { shelves, trendMeta } from "@/data/shelves";
import { stats, values } from "@/data/values";
import type { Trend, Value } from "@/data/types";
import { Ja } from "@/lib/ja";

export const metadata: Metadata = {
  title: "読み方 | 価値観一覧図鑑",
  description:
    "価値観一覧図鑑の読み方。カードの構造、証拠の二種、傾向の印、棚の分け方、扱わなかったもの、出典の方針。",
};

const SECTIONS = [
  { id: "what", no: "01", ja: "この図鑑は何か", en: "WHAT THIS CATALOG IS" },
  { id: "card", no: "02", ja: "カードの読み方", en: "ANATOMY OF A CARD" },
  { id: "evidence", no: "03", ja: "証拠の二種", en: "TWO KINDS OF EVIDENCE" },
  { id: "trend", no: "04", ja: "傾向の印", en: "TREND STAMPS" },
  { id: "shelves", no: "05", ja: "棚", en: "THE SHELVES" },
  { id: "excluded", no: "06", ja: "扱わなかったもの", en: "NOT STOCKED" },
  { id: "sources", no: "07", ja: "出典の方針", en: "SOURCING POLICY" },
  { id: "series", no: "08", ja: "シリーズ", en: "THE SERIES" },
] as const;

const sec = (id: (typeof SECTIONS)[number]["id"]) => SECTIONS.find((s) => s.id === id)!;

/** 三つの年 */
const DATES = [
  { en: "MFD.", ja: "製造年", text: "普及した時期" },
  { en: "DISC.", ja: "廃番年", text: "制度として終わった日付" },
  { en: "RESTOCK", ja: "再入荷", text: "別の名前での復活" },
];

const byName = (name: string) => values.find((v) => v.name === name)!;
/** カードの見本（法令で廃番になった一枚） */
const ANATOMY: Value = byName("仇討ち");
/** 年表の見本（概算の製造 → 廃番 → 再入荷の三つがそろう一枚） */
const SPAN_SAMPLE: Value = byName("隠居");

const TRENDS: Trend[] = ["up", "steady", "down", "discontinued", "restocked"];
const TREND_NOTES: Record<Trend, string> = {
  up: "使用頻度や賛成率が上がっている。製造年の新しい在庫に多い。",
  steady: "大きな増減がなく、現役のまま棚にある。",
  down: "現役だが、賛成率や使用頻度が下がっている。",
  discontinued: "制度や語として終わった。廃番の日付がある。",
  restocked: "別の名前で復活した。印は、元の商品のカードに押す。",
};

const EXCLUDED = [
  "穢れ・身分差別に関わる価値観は、◆初版から除外した。部落差別に直結するためである。",
  "性風俗慣行は、◆純潔規範の背景として触れるにとどめ、◆単独項目にしていない。",
  `証拠が通説の域を出ない項目と、◆ほかの項目と重なる項目は落とした。候補の約70項目から、${stats.total}項目に絞っている。`,
];

const SOURCE_RULES = [
  { en: "LAW", ja: "法令", text: "公布日と、布告・法律番号" },
  { en: "STATISTICS", ja: "統計", text: "調査名と、調査の年" },
  { en: "BOOKS", ja: "書籍", text: "著者・書名・刊行年" },
  { en: "WEB", ja: "ウェブ", text: "サイト名と、URL" },
];

const SERIES = [
  { name: "消滅職業図鑑", en: "VANISHED JOBS ARCHIVE", href: "https://vanished-jobs-archive.kosukuma.com/" },
  { name: "診断名アーカイブ", en: "DIAGNOSIS ARCHIVE", href: "https://diagnosis-archive.vercel.app/" },
];

/* ---------------------------------------------------------------- */

function SectionHead({ id }: { id: (typeof SECTIONS)[number]["id"] }) {
  const s = sec(id);
  return (
    <div className="flex items-start gap-4 md:gap-5">
      <span className="vl-offset-sm font-type grid h-10 w-10 shrink-0 place-items-center border-2 border-vl-ink bg-vl-card text-[13px] font-bold tracking-[0.08em]">
        {s.no}
      </span>
      <div>
        <h2 className="font-display-ja text-[24px] leading-tight md:text-[30px]">{s.ja}</h2>
        <p className="font-display-en mt-1 text-[13px] tracking-[0.14em] text-vl-red-deep">{s.en}</p>
      </div>
    </div>
  );
}

function Section({ id, children }: { id: (typeof SECTIONS)[number]["id"]; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 py-12 md:py-16">
      <SectionHead id={id} />
      <div className="mt-8 md:mt-10">{children}</div>
    </section>
  );
}

/** 年表の凡例に使う小さな図 */
function Glyph({ kind }: { kind: "hatch" | "bar" | "x" | "dot" | "now" | "tail" }) {
  const c = "var(--vl-brown)";
  return (
    <svg viewBox="0 0 30 12" className="h-[12px] w-[30px] shrink-0" aria-hidden>
      {kind === "hatch" && (
        <g>
          {[3, 7, 11, 15, 19].map((x) => (
            <rect key={x} x={x} y="3" width="2" height="6" fill={c} />
          ))}
          <rect x="22" y="3" width="6" height="6" fill={c} />
        </g>
      )}
      {kind === "bar" && <rect x="2" y="3" width="26" height="6" fill={c} />}
      {kind === "x" && (
        <g>
          <rect x="2" y="3" width="13" height="6" fill={c} />
          <g stroke="var(--vl-red)" strokeWidth="1.8" strokeLinecap="round">
            <line x1="12" y1="1" x2="18" y2="11" />
            <line x1="18" y1="1" x2="12" y2="11" />
          </g>
        </g>
      )}
      {kind === "dot" && (
        <g>
          <line x1="2" y1="6" x2="20" y2="6" stroke="var(--vl-red)" strokeWidth="1.2" strokeDasharray="2 2" />
          <circle cx="23" cy="6" r="4" fill="var(--vl-red)" />
          <circle cx="23" cy="6" r="1.5" fill="var(--vl-paper)" />
        </g>
      )}
      {kind === "now" && (
        <g>
          <rect x="2" y="3" width="20" height="6" fill={c} />
          <polygon points="21,1.5 27,6 21,10.5" fill={c} />
        </g>
      )}
      {kind === "tail" && (
        <g>
          <g stroke="var(--vl-red)" strokeWidth="1.6" strokeLinecap="round">
            <line x1="2" y1="1.5" x2="7" y2="10.5" />
            <line x1="7" y1="1.5" x2="2" y2="10.5" />
          </g>
          <line x1="10" y1="6" x2="24" y2="6" stroke={c} strokeWidth="1.8" strokeDasharray="2.5 2" />
          <polygon points="23.5,3 28,6 23.5,9" fill={c} />
        </g>
      )}
    </svg>
  );
}

const GLYPH_NOTES = [
  ["hatch", "斜線は、製造年が概算のとき。"],
  ["bar", "太い帯は、製造から廃番までの期間。"],
  ["now", "矢印で終わる帯は、いまも現役。"],
  ["x", "赤い×は、廃番の年。"],
  ["tail", "×の先の点線は、制度の廃止後も残るもの。"],
  ["dot", "赤い点は、再入荷の年。"],
] as const;

/* ---------------------------------------------------------------- */

export default function AboutPage() {
  const sampleMade = SPAN_SAMPLE.made?.label.split(" ")[0] ?? "";
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8">
      {/* 見出し */}
      <section className="grid gap-8 py-10 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-12 md:py-16">
        <div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
            <h1 className="font-display-ja text-[40px] leading-[1.05] md:text-[64px]">読み方</h1>
            <span
              aria-hidden
              className="font-script inline-block rotate-[-6deg] text-[24px] leading-none text-vl-red md:text-[30px]"
            >
              read me first!
            </span>
          </div>
          <p className="font-display-en vl-misreg mt-2 text-[44px] leading-[0.88] tracking-[0.01em] text-vl-red md:text-[84px]">
            HOW TO READ
            <br />
            THIS CATALOG
          </p>
          <p className="mt-6 text-[17px] font-bold leading-relaxed md:text-[19px]">棚に並んだ札を、どう読むか。</p>
          <p className="mt-3 max-w-[30em] text-[14px] leading-[1.9] md:text-[15px]">
            <Ja text="カードの部位、証拠の二種、傾向の印、棚の分け方。この店で使っている記法を、◆ここにまとめた。" />
          </p>
        </div>

        {/* 目次 */}
        <nav aria-label="目次" className="vl-offset border-2 border-vl-ink bg-vl-card px-5 py-4 md:px-6 md:py-5">
          <p className="text-[12px] font-bold">目次</p>
          <ol className="mt-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-baseline gap-3 border-b border-dashed border-vl-line py-2 hover:text-vl-red"
                >
                  <span className="font-type text-[12px] font-bold tracking-[0.08em] text-vl-red-deep">{s.no}</span>
                  <span className="text-[14px] font-bold">{s.ja}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      <div className="vl-rule" />

      {/* 01 この図鑑は何か */}
      <Section id="what">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-12">
          <p className="vl-justify max-w-[36em] text-[15px] leading-[2.05] md:text-[16px]">
            {"この図鑑は、日本の価値観（規範・人生観・判断基準）を商品に見立て、製造年・廃番年・再入荷年を出典にあたって特定し、棚に並べたものだ。「昔からの伝統」に見えるものほど製造年が新しく、「新品」に見えるものが中世の在庫の再出荷だったりする。それを年代順に並べて、目で見えるようにするのが目的である。「情報を並べるシリーズ」の14番目にあたり、姉妹サイトに「消滅職業図鑑」と「診断名アーカイブ」がある。"}
          </p>
          <div>
            <p className="text-[12px] font-bold">三つの年</p>
            <ul className="mt-3 grid gap-3">
              {DATES.map((d) => (
                <li key={d.en} className="vl-offset-sm flex items-center gap-4 border-2 border-vl-ink bg-vl-card px-4 py-3">
                  <span className="font-type w-[5.5em] shrink-0 text-[12px] font-bold tracking-[0.08em] text-vl-red-deep">
                    {d.en}
                  </span>
                  <span className="text-[16px] leading-none font-bold">{d.ja}</span>
                  <span className="ml-auto text-right text-[13px] leading-snug">{d.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <div className="vl-rule" />

      {/* 02 カードの読み方 */}
      <Section id="card">
        <CardAnatomy v={ANATOMY} />

        {/* カード面の年表 */}
        <figure className="mt-10 border-2 border-vl-ink bg-vl-card md:mt-12">
          <figcaption className="flex items-center justify-between gap-3 bg-vl-ink px-4 py-2.5 text-vl-paper md:px-6">
            <span className="text-[13px] font-bold">カード面の年表</span>
            <span className="font-display-en hidden text-[13px] tracking-[0.14em] text-vl-mustard sm:inline">SPAN STRIP</span>
          </figcaption>
          <div className="grid gap-8 p-5 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-10 md:p-7">
            <div>
              <p className="text-[14px] leading-[1.9]">
                <Ja text="カードの下段にある、小さな年表。中世〜近世を圧縮し、◆明治以降を広く取ってある。帯の色は、棚の色。" />
              </p>
              <div className="mt-5 text-[16px]">
                <SpanStrip v={SPAN_SAMPLE} accent="var(--vl-brown)" />
              </div>
              <p className="mt-3 text-[12px] leading-[1.7] font-bold">
                例: NO.{SPAN_SAMPLE.no} {SPAN_SAMPLE.name}。
                <br className="sm:hidden" />
                {sampleMade}に製造、{SPAN_SAMPLE.discontinued?.year}年に廃番、
                <br className="sm:hidden" />
                {SPAN_SAMPLE.restocked?.year}年に「{SPAN_SAMPLE.restocked?.as}」として再入荷。
              </p>
            </div>
            <ul className="grid gap-3 text-[13px] sm:grid-cols-2 md:grid-cols-1">
              {GLYPH_NOTES.map(([k, text]) => (
                <li key={k} className="flex items-center gap-3">
                  <Glyph kind={k} />
                  <span>
                    <Ja text={text} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </figure>
      </Section>

      <div className="vl-rule" />

      {/* 03 証拠の二種 */}
      <Section id="evidence">
        <p className="mb-8 max-w-[36em] text-[15px] leading-[2.05] md:text-[16px]">
          <Ja text="年を特定する方法は、二つある。どちらで特定したかは、◆各項目のページに書いてある。" />
        </p>
        <EvidenceTwo />
      </Section>

      <div className="vl-rule" />

      {/* 04 傾向の印 */}
      <Section id="trend">
        <ul className="border-2 border-vl-ink bg-vl-card">
          {TRENDS.map((t) => (
            <li
              key={t}
              className="grid grid-cols-[minmax(10.5em,auto)_1fr] items-center gap-x-4 gap-y-1.5 border-b border-vl-line px-4 py-4 last:border-b-0 md:grid-cols-[13em_6em_1fr] md:px-6"
            >
              <div className="flex items-center">
                <TrendStamp trend={t} seed={t} className="text-[12px]" />
              </div>
              <p className="text-[16px] leading-none font-bold">{trendMeta[t].ja}</p>
              <p className="col-span-2 text-[14px] leading-[1.8] md:col-span-1">
                <Ja text={TREND_NOTES[t]} />
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] leading-[1.8]">
          <Ja text="印は、カードの右側に押してある。五種とも同じゴム印で、◆色と文字で見分ける。" />
        </p>
      </Section>

      <div className="vl-rule" />

      {/* 05 棚 */}
      <Section id="shelves">
        <p className="mb-8 max-w-[36em] text-[15px] leading-[2.05] md:text-[16px]">
          <Ja text="製造年と、いまの状態で棚を分けている。棚の名前を押すと、索引のその棚へ飛ぶ。" />
        </p>
        <div className="vl-offset border-2 border-vl-ink bg-vl-card">
          <div className="font-type hidden grid-cols-[8em_0.85fr_1.65fr_1.35fr] gap-x-6 border-b-2 border-vl-ink px-5 py-2 text-[12px] font-bold tracking-[0.12em] text-vl-ink-soft lg:grid">
            <span>SHELF</span>
            <span>NAME</span>
            <span>LEAD</span>
            <span>EVIDENCE</span>
          </div>
          {shelves.map((s) => {
            const acc = SHELF_ACCENT[String(s.id)];
            return (
              <div
                key={String(s.id)}
                className="grid gap-x-6 gap-y-2 border-b border-vl-line px-4 py-4 last:border-b-0 lg:grid-cols-[8em_0.85fr_1.65fr_1.35fr] lg:items-start lg:px-5 lg:py-5"
              >
                <div className="flex items-center gap-3 lg:block">
                  <span
                    className="vl-offset-sm inline-flex items-baseline gap-1.5 border-2 border-vl-ink px-2 py-1 leading-none"
                    style={{ background: acc.bg, color: acc.fg }}
                  >
                    <span className="font-type text-[11px] font-bold tracking-[0.1em]">SHELF</span>
                    <span className="font-display-en text-[18px] leading-none">{s.no}</span>
                  </span>
                  {s.virtual && (
                    <span className="whitespace-nowrap text-[12px] font-bold text-vl-ink-soft lg:mt-2 lg:block">半券だけの棚</span>
                  )}
                </div>
                <div>
                  <Link href={`/#shelf-${s.no}`} className="vl-link text-[17px] font-bold">
                    {s.name}
                  </Link>
                  <p className="font-display-en mt-1 text-[12px] tracking-[0.12em] text-vl-red-deep">{s.en}</p>
                </div>
                <p className="text-[14px] leading-[1.85]">
                  <Ja text={s.lead} />
                </p>
                <p className="text-[13px] leading-[1.7] text-vl-ink-soft">
                  <Ja text={s.evidenceNote} />
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <div className="vl-rule" />

      {/* 06 扱わなかったもの */}
      <Section id="excluded">
        <ul className="max-w-[40em] space-y-5">
          {EXCLUDED.map((text, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-display-en mt-[3px] w-4 shrink-0 text-[20px] leading-none text-vl-red">×</span>
              <p className="text-[14px] leading-[2] md:text-[15px]">
                <Ja text={text} />
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <div className="vl-rule" />

      {/* 07 出典の方針 */}
      <Section id="sources">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-12">
          <dl className="border-2 border-vl-ink bg-vl-card">
            {SOURCE_RULES.map((r) => (
              <div key={r.en} className="grid grid-cols-[6.5em_1fr] items-center gap-x-4 border-b border-vl-line px-4 py-3 last:border-b-0">
                <dt className="text-[15px] leading-none font-bold">{r.ja}</dt>
                <dd className="text-[14px] leading-[1.7]">{r.text}</dd>
              </div>
            ))}
          </dl>
          <p className="max-w-[36em] text-[15px] leading-[2.05] md:text-[16px]">
            <Ja text="数値は、各調査の公表値を載せる。選択肢を合算したときは、◆そう注記する。解釈は、「誰がそう論じているか」を書く。出典は、各項目の「裏取りメモ」に付す。" />
          </p>
        </div>
      </Section>

      <div className="vl-rule" />

      {/* 08 シリーズ */}
      <Section id="series">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-12">
          <p className="max-w-[36em] text-[15px] leading-[2.05] md:text-[16px]">
            <Ja text="「情報を並べるシリーズ」は、◆ひとつの切り口で集めた事実を、◇ただ並べて見せるサイトの連作である。価値観一覧図鑑は、その14番目にあたる。" />
          </p>
          <ul className="vl-offset border-2 border-vl-ink bg-vl-card">
            {SERIES.map((s) => (
              <li key={s.href} className="border-b border-vl-line last:border-b-0">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-3 hover:text-vl-red"
                >
                  <span className="text-[15px] font-bold">{s.name}</span>
                  <span className="ml-auto text-[13px] font-bold text-vl-ink-soft">↗</span>
                </a>
              </li>
            ))}
            <li className="flex flex-wrap items-baseline gap-x-3 px-4 py-3">
              <span className="text-[15px] font-bold">価値観一覧図鑑</span>
              <span className="ml-auto text-[12px] font-bold text-vl-ink-soft">このサイト · No.14</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* 索引へ */}
      <div className="vl-rule" />
      <div className="flex flex-col items-start gap-4 py-12 md:flex-row md:items-center md:justify-between md:py-16">
        <p className="font-display-ja text-[20px] md:text-[24px]">読み方は以上。棚へどうぞ。</p>
        <Link
          href="/"
          className="vl-offset-sm inline-flex items-baseline gap-3 border-2 border-vl-ink bg-vl-ink px-5 py-3 text-vl-paper hover:bg-vl-red"
        >
          <span className="text-[14px] font-bold">索引へ</span>
          <span className="font-display-en text-[14px] tracking-[0.12em]">INDEX →</span>
        </Link>
      </div>
    </div>
  );
}
