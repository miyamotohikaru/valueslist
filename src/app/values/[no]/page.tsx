import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OG_IMAGE, SITE_NAME } from "@/lib/site";
import type { Curve, Value } from "@/data/types";
import { values, byNo, byShelf, prevNext } from "@/data/values";
import { shelfById } from "@/data/shelves";
import { SHELF_ACCENT, nameLines } from "@/components/ValueCard";
import PrintCard, { recipeOf } from "@/components/PrintCard";
import SpanStrip from "@/components/SpanStrip";
import TrendStamp from "@/components/TrendStamp";
import DetailSpec from "@/components/DetailSpec";
import CurveChart from "@/components/CurveChart";
import LawTimeline from "@/components/LawTimeline";
import FactList from "@/components/FactList";
import LineageStrip from "@/components/LineageStrip";
import FitLines from "@/components/FitLines";
import Reveal from "@/components/motion/Reveal";
import HalftoneArt from "@/components/print/HalftoneArt";

type Params = { params: Promise<{ no: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return values.map((v) => ({ no: v.no }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { no } = await params;
  const v = byNo(no);
  if (!v) return {};
  return {
    title: `${v.name} | 価値観一覧図鑑`,
    description: v.hitokoto,
    openGraph: {
      title: SITE_NAME,
      description: v.hitokoto,
      url: `/values/${v.no}`,
      siteName: SITE_NAME,
      locale: "ja_JP",
      type: "article",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", title: SITE_NAME, description: v.hitokoto, images: [OG_IMAGE] },
  };
}

/** 見出しの大きさ｡最長の行の文字数で決める */
function titleSize(lines: string[]): string {
  const n = Math.max(...lines.map((l) => [...l].reduce((a, ch) => a + (/[\x20-\x7e]/.test(ch) ? 0.55 : 1), 0)));
  // 携帯では画面に対して大きくなりすぎていたので､PC と同じくらいの
  // 占有率（本文幅の 1 割強）になるよう vw を下げてある
  if (n <= 3) return "clamp(40px, 12vw, 128px)";
  if (n <= 4) return "clamp(36px, 10.8vw, 108px)";
  if (n <= 6) return "clamp(30px, 9vw, 86px)";
  if (n <= 8) return "clamp(26px, 7.6vw, 68px)";
  if (n <= 10) return "clamp(23px, 6.6vw, 56px)";
  return "clamp(21px, 5.8vw, 48px)";
}

/** おなじ棚の他の在庫｡自分の後ろに続くものを優先して最大 4 枚 */
function sameShelf(v: Value, max = 4) {
  const list = byShelf(v.shelf);
  const i = list.findIndex((x) => x.no === v.no);
  const ordered = i >= 0 ? [...list.slice(i + 1), ...list.slice(0, i)] : list;
  return ordered.filter((x) => x.no !== v.no).slice(0, max);
}

function SectionHead({ en, ja, right, id }: { en: string; ja: string; right?: string; id: string }) {
  return (
    <header className="flex flex-wrap items-end gap-x-3 gap-y-1 border-b-[3px] border-vl-ink pb-2">
      <h2 id={id} className="flex items-baseline gap-3">
        <span className="font-display-en text-[28px] leading-none tracking-[0.03em] text-vl-red md:text-[34px]">{en}</span>
        <span className="font-display-ja text-[18px] leading-none md:text-[20px]">{ja}</span>
      </h2>
      {right && <span className="ml-auto text-[12px] font-bold text-vl-ink-soft">{right}</span>}
    </header>
  );
}

/** 紐で吊るした値札（型番と棚） */
function HangingTag({ v }: { v: Value }) {
  const shelf = shelfById(v.shelf);
  const acc = SHELF_ACCENT[String(v.shelf)];
  return (
    <div className="vl-swing relative h-[270px] w-[230px]" aria-label={`型番 ${v.no}・棚 ${shelf.no} ${shelf.name}`}>
      <svg viewBox="0 0 230 80" className="absolute top-0 left-0 h-[80px] w-[230px]" aria-hidden>
        <path d="M18 0 C 60 30, 120 20, 122 64" fill="none" stroke="var(--vl-ink)" strokeWidth="2" strokeDasharray="1 0" />
      </svg>
      <div
        className="absolute top-[52px] left-[38px] w-[176px] rotate-[7deg] border-2 border-vl-ink px-4 pt-8 pb-4 text-center"
        style={{ background: acc.bg, color: acc.fg, clipPath: "polygon(22% 0, 78% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)" }}
      >
        <span className="absolute top-3 left-1/2 h-[14px] w-[14px] -translate-x-1/2 rounded-full border-2 border-vl-ink bg-vl-paper" />
        <p className="font-type text-[11px] font-bold tracking-[0.14em]">CAT. NO.</p>
        <p className="font-display-en text-[76px] leading-none">{v.no}</p>
        <div className="mt-2 border-t-2 pt-2" style={{ borderColor: acc.fg }}>
          <p className="font-type text-[11px] font-bold tracking-[0.12em]">SHELF {shelf.no}</p>
          <p className="mt-0.5 text-[12px] leading-snug font-bold">{shelf.name}</p>
        </div>
      </div>
    </div>
  );
}

function SpanBox({ v, accent, outline }: { v: Value; accent: string; outline: boolean }) {
  const start = v.made ? `${v.made.approx ? "c." : ""}${v.made.year}` : "—";
  const end = v.restocked ? `${v.restocked.year} 再入荷` : v.discontinued ? `${v.discontinued.year} 廃番` : "いま";
  const persists = !!v.discontinued && v.trend !== "discontinued" && !v.restocked;
  return (
    <figure className="vl-offset border-2 border-vl-ink bg-vl-card px-4 pt-3 pb-4 md:px-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <p className="text-[12px] font-bold text-vl-ink-soft">流通期間</p>
        <p className="font-type text-[13px] font-bold">
          {start} → {end}
        </p>
      </div>
      <div className="mt-3 text-[18px]">
        <SpanStrip v={v} accent={accent} outline={outline} showLabels />
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-[8px] w-[16px] border border-vl-ink" style={{ background: accent }} aria-hidden />
          流通していた期間
        </li>
        {v.made?.approx && (
          <li className="flex items-center gap-1.5">
            <span
              className="inline-block h-[8px] w-[16px]"
              style={{ background: `repeating-linear-gradient(90deg, var(--vl-ink) 0 2px, transparent 2px 4px)` }}
              aria-hidden
            />
            製造年は概算
          </li>
        )}
        {v.discontinued && (
          <li className="flex items-center gap-1.5">
            <span className="font-bold text-vl-red">×</span>廃番
          </li>
        )}
        {persists && (
          <li className="flex items-center gap-1.5">
            <span
              className="inline-block h-[3px] w-[16px]"
              style={{ background: `repeating-linear-gradient(90deg, ${outline ? "var(--vl-ink)" : accent} 0 4px, transparent 4px 7px)` }}
              aria-hidden
            />
            制度の廃止後も残る
          </li>
        )}
        {v.restocked && (
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-[10px] w-[10px] rounded-full border-2 border-vl-red" aria-hidden />
            再入荷
          </li>
        )}
      </ul>
    </figure>
  );
}

function NavButton({ dir, v }: { dir: "prev" | "next"; v: Value }) {
  const isPrev = dir === "prev";
  const acc = SHELF_ACCENT[String(v.shelf)];
  return (
    <Link
      href={`/values/${v.no}`}
      className={`vl-offset group flex min-w-0 items-stretch border-2 border-vl-ink bg-vl-card transition-transform hover:-translate-y-0.5 ${
        isPrev ? "" : "flex-row-reverse text-right"
      }`}
    >
      <span
        className="font-display-en flex w-[56px] shrink-0 items-center justify-center text-[22px]"
        style={{ background: acc.bg, color: acc.fg }}
        aria-hidden
      >
        {isPrev ? "←" : "→"}
      </span>
      <span className="min-w-0 flex-1 px-4 py-3">
        <span className="block text-[12px] font-bold text-vl-ink-soft">{isPrev ? "前の標本" : "次の標本"}</span>
        <span className="font-display-ja mt-1 block truncate text-[20px] leading-tight group-hover:text-vl-red">{v.name}</span>
        <span className="mt-1 block truncate text-[13px]">{v.hitokoto}</span>
      </span>
    </Link>
  );
}

export default async function ValuePage({ params }: Params) {
  const { no } = await params;
  const v = byNo(no);
  if (!v) notFound();

  const shelf = shelfById(v.shelf);
  const acc = SHELF_ACCENT[String(v.shelf)];
  const { prev, next } = prevNext(v.no);
  const siblings = sameShelf(v);
  const lines = nameLines(v.name);
  const hasCurve = v.evidence === "curve" && !!v.curve;

  const extras: Curve[] = [...(!hasCurve && v.curve ? [v.curve] : []), ...(v.extraCurves ?? [])];

  return (
    <article className="mx-auto max-w-6xl px-4 md:px-8">
      {/* パンくず */}
      <div className="flex items-center justify-between gap-3 pt-5 md:pt-8">
        <Link href={`/#shelf-${shelf.no}`} className="vl-link text-[13px] font-bold">
          ← 索引にもどる
        </Link>
        <p className="font-type text-[12px] font-bold tracking-[0.08em] text-vl-ink-soft">
          NO.{v.no} · SHELF {shelf.no}
        </p>
      </div>

      {/* 見出し */}
      <header className="relative mt-6 grid gap-6 md:mt-8 md:grid-cols-[minmax(0,1fr)_240px] md:items-center">
        <div className="min-w-0">
          <p className="font-display-en text-[15px] leading-none tracking-[0.08em] text-vl-red uppercase md:text-[28px]">{v.en}</p>
          <h1 className="font-display-ja mt-3 leading-[1.1]" style={{ fontSize: titleSize(lines) }}>
            {lines.map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </h1>
          <p className="mt-3 text-[14px] tracking-[0.1em] text-vl-ink-soft">{v.reading}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 md:mt-7">
            <span className="text-[16px] md:text-[30px]">
              <TrendStamp trend={v.trend} seed={v.no} ja />
            </span>
            <span className="text-[13px] font-bold whitespace-nowrap md:hidden">
              {shelf.no}. {shelf.name}
            </span>
          </div>
        </div>
        <div className="hidden md:block">
          <HangingTag v={v} />
        </div>
      </header>

      {/* ひとこと（全幅の色の帯） */}
      <section
        className="relative mt-8 overflow-hidden border-2 border-vl-ink px-6 py-8 md:mt-10 md:px-14 md:py-11"
        style={{ background: acc.bg, color: acc.fg }}
        aria-label="ひとこと"
      >
        <span
          className="pointer-events-none absolute -top-2 left-3 text-[64px] leading-none font-bold opacity-30 md:-top-6 md:left-5 md:text-[170px]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          aria-hidden
        >
          “
        </span>
        <div className="relative @container">
          <FitLines text={v.hitokoto} className="leading-[1.65] font-bold" />
        </div>
        <p className="font-type relative mt-4 text-[12px] font-bold tracking-[0.12em] opacity-90">— {v.en.toUpperCase()} · NO.{v.no}</p>
      </section>

      {/* 仕様表・流通期間 ＋ 主の証拠 */}
      <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-10" aria-label="仕様と証拠">
        <div className="space-y-7">
          {true && (
            <figure
              className="vl-offset vl-detail-art border-2 border-vl-ink"
              style={{ ["--panel" as string]: recipeOf(v.no).panel }}
            >
              <HalftoneArt no={v.no} tech={recipeOf(v.no).tech} ink={recipeOf(v.no).ink} />
            </figure>
          )}
          <DetailSpec v={v} />
          <SpanBox v={v} accent={acc.bar} outline={v.shelf === 3} />
        </div>
        <Reveal>{hasCurve ? <CurveChart curve={v.curve!} /> : <LawTimeline v={v} />}</Reveal>
      </section>

      {hasCurve && (v.made?.fact || v.discontinued?.fact || v.restocked?.fact) && (
        <section className="mt-8" aria-label="日付の根拠">
          <Reveal>
            <LawTimeline v={v} />
          </Reveal>
        </section>
      )}

      {extras.length > 0 && (
        <section className={`mt-8 grid gap-8 ${extras.length > 1 ? "lg:grid-cols-2 lg:gap-10" : "lg:max-w-[760px]"}`} aria-label="補助の統計">
          {extras.map((c, i) => (
            <Reveal key={c.title}>
              <CurveChart curve={c} />
            </Reveal>
          ))}
        </section>
      )}

      {/* 本文 ＋ この標本のカード */}
      <section className="mt-14 md:mt-20" aria-labelledby="description">
        <SectionHead id="description" en="DESCRIPTION" ja="説明" />
        <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
          <div className="vl-prose vl-justify max-w-[40em] text-[16px] leading-[2]">
            {v.body.map((p, i) => (
              <p key={i}>
                <span className="font-display-en mr-2 text-[1.05em] text-vl-red" aria-hidden>
                  §{i + 1}
                </span>
                {p}
              </p>
            ))}
          </div>
          {/* この標本のカード｡貼り付かせず､その場に置く */}
          <aside className="mt-10 hidden lg:mt-0 lg:block" aria-label="この標本のカード">
            <PrintCard v={v} interactive={false} />
          </aside>
        </div>
      </section>

      {/* 裏取りメモ */}
      <div className="mt-14 md:mt-20">
        <FactList v={v} />
      </div>

      {/* 系譜 */}
      <LineageStrip v={v} />

      {/* おなじ棚の在庫 */}
      {siblings.length > 0 && (
        <section className="mt-14 md:mt-20" aria-labelledby="same-shelf">
          <SectionHead id="same-shelf" en="SAME SHELF" ja="おなじ棚の在庫" right={`${shelf.no}. ${shelf.name}`} />
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {siblings.map((s, i) => (
              <li key={s.no}>
                <PrintCard v={s} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 前後の標本 */}
      <nav className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2" aria-label="前後の標本">
        {prev ? <NavButton dir="prev" v={prev} /> : <span aria-hidden />}
        {next ? <NavButton dir="next" v={next} /> : <span aria-hidden />}
      </nav>
    </article>
  );
}
