import Link from "next/link";
import CardAnatomy from "@/components/CardAnatomy";
import EvidenceTwo from "@/components/EvidenceTwo";
import TrendStamp from "@/components/TrendStamp";
import SpanStrip from "@/components/SpanStrip";
import { SHELF_ACCENT } from "@/components/ValueCard";
import { shelves } from "@/data/shelves";
import { values } from "@/data/values";
import type { Trend, Value } from "@/data/types";
import { path, type Lang } from "@/i18n/lang";
import { t } from "@/i18n/ui";
import { fill, shelfLead, shelfNote, tAbout, trendName, trendNote, type AboutKey } from "@/i18n/ui.about";
import { shelfName } from "@/i18n/ui.value";
import { Ja } from "@/lib/ja";

/** 読み方のページの中身｡日本語（/about）と英語（/en/about）で同じものを使う */

type SecId = "what" | "card" | "evidence" | "trend" | "shelves" | "sources";

/** 節の番号と見出し｡02 の和文は共通辞書の anatomy と同じ字なので､そちらから引く */
const SECTIONS: { id: SecId; no: string; head: (lang: Lang) => string; en: AboutKey }[] = [
  { id: "what", no: "01", head: (lang) => tAbout(lang, "secWhat"), en: "secWhatEn" },
  { id: "card", no: "02", head: (lang) => t(lang, "anatomy"), en: "secCardEn" },
  { id: "evidence", no: "03", head: (lang) => tAbout(lang, "secEvidence"), en: "secEvidenceEn" },
  { id: "trend", no: "04", head: (lang) => tAbout(lang, "secTrend"), en: "secTrendEn" },
  { id: "shelves", no: "05", head: (lang) => tAbout(lang, "secShelves"), en: "secShelvesEn" },
  { id: "sources", no: "06", head: (lang) => tAbout(lang, "secSources"), en: "secSourcesEn" },
];

const sec = (id: SecId) => SECTIONS.find((s) => s.id === id)!;

/** 三つの年 */
const DATES: { en: string; name: AboutKey; text: AboutKey }[] = [
  { en: "MFD.", name: "dateMade", text: "dateMadeText" },
  { en: "DISC.", name: "dateDisc", text: "dateDiscText" },
  { en: "RESTOCK", name: "dateRestock", text: "dateRestockText" },
];

const byName = (name: string) => values.find((v) => v.name === name)!;
/** カードの見本（法令で廃番になった一枚）｡NO.001 は新しい面に差し替え中なので､ここは 002 を使う */
const ANATOMY: Value = byName("忠孝");
/** 年表の見本（概算の製造 → 廃番 → 再入荷の三つがそろう一枚） */
const SPAN_SAMPLE: Value = byName("隠居");

const TRENDS: Trend[] = ["up", "steady", "down", "discontinued", "restocked"];

const SOURCE_RULES: { en: string; name: AboutKey; text: AboutKey }[] = [
  { en: "LAW", name: "srcLaw", text: "srcLawText" },
  { en: "STATISTICS", name: "srcStats", text: "srcStatsText" },
  { en: "BOOKS", name: "srcBooks", text: "srcBooksText" },
  { en: "WEB", name: "srcWeb", text: "srcWebText" },
];

/* ---------------------------------------------------------------- */

function SectionHead({ id, lang }: { id: SecId; lang: Lang }) {
  const s = sec(id);
  return (
    <div className="flex items-start gap-4 md:gap-5">
      <span className="vl-offset-sm font-type grid h-10 w-10 shrink-0 place-items-center border-2 border-vl-ink bg-vl-card text-[13px] font-bold tracking-[0.08em]">
        {s.no}
      </span>
      <div>
        <h2 className="font-display-ja text-[24px] leading-tight md:text-[30px]">{s.head(lang)}</h2>
        <p className="font-display-en mt-1 text-[13px] tracking-[0.14em] text-vl-red-deep">{tAbout(lang, s.en)}</p>
      </div>
    </div>
  );
}

function Section({ id, lang, children }: { id: SecId; lang: Lang; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 py-12 md:py-16">
      <SectionHead id={id} lang={lang} />
      <div className="mt-8 md:mt-10">{children}</div>
    </section>
  );
}

/** 年表の凡例に使う小さな図 */
type GlyphKind = "hatch" | "bar" | "x" | "dot" | "now" | "tail";

function Glyph({ kind }: { kind: GlyphKind }) {
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

const GLYPH_NOTES: [GlyphKind, AboutKey][] = [
  ["hatch", "glyphHatch"],
  ["bar", "glyphBar"],
  ["now", "glyphNow"],
  ["x", "glyphX"],
  ["tail", "glyphTail"],
  ["dot", "glyphDot"],
];

/* ---------------------------------------------------------------- */

export default function AboutPage({ lang }: { lang: Lang }) {
  const sampleMade = SPAN_SAMPLE.made?.label.split(" ")[0] ?? "";
  const sampleName = lang === "ja" ? SPAN_SAMPLE.name : SPAN_SAMPLE.en;
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8">
      {/* 見出し */}
      <section className="grid gap-8 py-10 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-12 md:py-16">
        <div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
            <h1 className="font-display-ja text-[26px] leading-[1.1] md:text-[64px]">{t(lang, "aboutTitle")}</h1>
            <span
              aria-hidden
              className="font-script inline-block rotate-[-6deg] text-[24px] leading-none text-vl-red md:text-[30px]"
            >
              read me first!
            </span>
          </div>
          <p className="font-display-en vl-misreg mt-2 text-[44px] leading-[0.88] tracking-[0.01em] text-vl-red md:text-[84px]">
            {tAbout(lang, "heroEn1")}
            <br />
            {tAbout(lang, "heroEn2")}
          </p>
          <p className="mt-6 text-[17px] font-bold leading-relaxed md:text-[19px]">{tAbout(lang, "heroLead")}</p>
          <p className="mt-3 max-w-[30em] text-[14px] leading-[1.9] md:text-[15px]">
            <Ja text={tAbout(lang, "heroSub")} />
          </p>
        </div>

        {/* 目次 */}
        <nav
          aria-label={t(lang, "toc")}
          className="vl-offset border-2 border-vl-ink bg-vl-card px-5 py-4 md:px-6 md:py-5"
        >
          <p className="text-[12px] font-bold">{t(lang, "toc")}</p>
          <ol className="mt-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-baseline gap-3 border-b border-dashed border-vl-line py-2 hover:text-vl-red"
                >
                  <span className="font-type text-[12px] font-bold tracking-[0.08em] text-vl-red-deep">{s.no}</span>
                  <span className="text-[14px] font-bold">{s.head(lang)}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      <div className="vl-rule" />

      {/* 01 この図鑑は何か */}
      <Section id="what" lang={lang}>
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-12">
          {/* 両端そろえは和文の組み方｡英語でやると語間が空きすぎるので ja だけ */}
          <p className={`max-w-[36em] text-[15px] leading-[2.05] md:text-[16px]${lang === "ja" ? " vl-justify" : ""}`}>
            {tAbout(lang, "whatBody")}
          </p>
          <div>
            <p className="text-[12px] font-bold">{tAbout(lang, "threeYears")}</p>
            <ul className="mt-3 grid gap-3">
              {DATES.map((d) => (
                <li key={d.en} className="vl-offset-sm flex items-center gap-4 border-2 border-vl-ink bg-vl-card px-4 py-3">
                  <span className="font-type w-[5.5em] shrink-0 text-[12px] font-bold tracking-[0.08em] text-vl-red-deep">
                    {d.en}
                  </span>
                  <span className="text-[16px] leading-none font-bold">{tAbout(lang, d.name)}</span>
                  <span className="ml-auto text-right text-[13px] leading-snug">{tAbout(lang, d.text)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <div className="vl-rule" />

      {/* 02 カードの読み方 */}
      <Section id="card" lang={lang}>
        <CardAnatomy v={ANATOMY} lang={lang} />

        {/* 項目ページの年表 */}
        <figure className="mt-10 border-2 border-vl-ink bg-vl-card md:mt-12">
          <figcaption className="flex items-center justify-between gap-3 bg-vl-ink px-4 py-2.5 text-vl-paper md:px-6">
            <span className="text-[13px] font-bold">{tAbout(lang, "spanStripTitle")}</span>
            <span className="font-display-en hidden text-[13px] tracking-[0.14em] text-vl-mustard sm:inline">SPAN STRIP</span>
          </figcaption>
          <div className="grid gap-8 p-5 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-10 md:p-7">
            <div>
              <div className="text-[16px]">
                <SpanStrip v={SPAN_SAMPLE} accent="var(--vl-brown)" lang={lang} />
              </div>
              <p className="mt-3 text-[12px] leading-[1.7] font-bold">
                {fill(tAbout(lang, "sampleHead"), { no: SPAN_SAMPLE.no, name: sampleName })}
                <br className="sm:hidden" />
                {fill(tAbout(lang, "sampleMade"), { made: sampleMade, end: SPAN_SAMPLE.discontinued?.year })}
                <br className="sm:hidden" />
                {fill(tAbout(lang, "sampleRestock"), {
                  year: SPAN_SAMPLE.restocked?.year,
                  as: SPAN_SAMPLE.restocked?.as,
                })}
              </p>
            </div>
            <ul className="grid gap-3 text-[13px] sm:grid-cols-2 md:grid-cols-1">
              {GLYPH_NOTES.map(([k, key]) => (
                <li key={k} className="flex items-center gap-3">
                  <Glyph kind={k} />
                  <span>
                    <Ja text={tAbout(lang, key)} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </figure>
      </Section>

      <div className="vl-rule" />

      {/* 03 証拠の二種 */}
      <Section id="evidence" lang={lang}>
        <p className="mb-8 max-w-[36em] text-[15px] leading-[2.05] md:text-[16px]">
          <Ja text={tAbout(lang, "evidenceLead")} />
        </p>
        <EvidenceTwo lang={lang} />
      </Section>

      <div className="vl-rule" />

      {/* 04 傾向の印 */}
      <Section id="trend" lang={lang}>
        <ul className="border-2 border-vl-ink bg-vl-card">
          {TRENDS.map((tr) => (
            <li
              key={tr}
              // 傾向の名前の欄は､英語（Discontinued）のほうが和文より広く要る
              className={`grid grid-cols-[minmax(10.5em,auto)_1fr] items-center gap-x-4 gap-y-1.5 border-b border-vl-line px-4 py-4 last:border-b-0 md:px-6 ${
                lang === "ja" ? "md:grid-cols-[13em_6em_1fr]" : "md:grid-cols-[13em_9.5em_1fr]"
              }`}
            >
              <div className="flex items-center">
                <TrendStamp trend={tr} seed={tr} className="text-[12px]" lang={lang} />
              </div>
              <p className="text-[16px] leading-none font-bold">{trendName(lang, tr)}</p>
              <p className="col-span-2 text-[14px] leading-[1.8] md:col-span-1">
                <Ja text={trendNote(lang, tr)} />
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <div className="vl-rule" />

      {/* 05 グループ */}
      <Section id="shelves" lang={lang}>
        <p className="mb-8 max-w-[36em] text-[15px] leading-[2.05] md:text-[16px]">
          <Ja text={tAbout(lang, "shelvesLead")} />
        </p>
        <div className="vl-offset border-2 border-vl-ink bg-vl-card">
          <div className="font-type hidden grid-cols-[8em_0.85fr_1.65fr_1.35fr] gap-x-6 border-b-2 border-vl-ink px-5 py-2 text-[12px] font-bold tracking-[0.12em] text-vl-ink-soft lg:grid">
            <span>GROUP</span>
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
                    <span className="font-type text-[11px] font-bold tracking-[0.1em]">GROUP</span>
                    <span className="font-display-en text-[18px] leading-none">{s.no}</span>
                  </span>
                  {s.virtual && (
                    <span className="whitespace-nowrap text-[12px] font-bold text-vl-ink-soft lg:mt-2 lg:block">
                      {tAbout(lang, "shelfStubOnly")}
                    </span>
                  )}
                </div>
                <div>
                  <Link href={`${path(lang, "/")}#shelf-${s.no}`} className="vl-link text-[17px] font-bold">
                    {shelfName(lang, s)}
                  </Link>
                  <p className="font-display-en mt-1 text-[12px] tracking-[0.12em] text-vl-red-deep">{s.en}</p>
                </div>
                <p className="text-[14px] leading-[1.85]">
                  <Ja text={shelfLead(lang, s)} />
                </p>
                <p className="text-[13px] leading-[1.7] text-vl-ink-soft">
                  <Ja text={shelfNote(lang, s)} />
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <div className="vl-rule" />

      {/* 06 出典の方針 */}
      <Section id="sources" lang={lang}>
        <div className="max-w-[32em]">
          <dl className="border-2 border-vl-ink bg-vl-card">
            {SOURCE_RULES.map((r) => (
              <div key={r.en} className="grid grid-cols-[6.5em_1fr] items-center gap-x-4 border-b border-vl-line px-4 py-3 last:border-b-0">
                <dt className="text-[15px] leading-none font-bold">{tAbout(lang, r.name)}</dt>
                <dd className="text-[14px] leading-[1.7]">{tAbout(lang, r.text)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* 索引へ */}
      <div className="vl-rule" />
      <div className="flex flex-col items-start gap-4 py-12 md:flex-row md:items-center md:justify-between md:py-16">
        <Link
          href={path(lang, "/")}
          className="vl-offset-sm inline-flex items-baseline gap-3 border-2 border-vl-ink bg-vl-ink px-5 py-3 text-vl-paper hover:bg-vl-red"
        >
          <span className="text-[14px] font-bold">{tAbout(lang, "toIndex")}</span>
          <span className="font-display-en text-[14px] tracking-[0.12em]">INDEX →</span>
        </Link>
      </div>
    </div>
  );
}
