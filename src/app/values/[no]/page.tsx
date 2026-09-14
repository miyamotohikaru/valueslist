import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OG_IMAGE, SITE_NAME } from "@/lib/site";
import type { Value } from "@/data/types";
import { values, byNo, byShelf, prevNext } from "@/data/values";
import { shelfById } from "@/data/shelves";
import { Ja } from "@/lib/ja";
import ValueCard, { SHELF_ACCENT } from "@/components/ValueCard";
import SpanStrip from "@/components/SpanStrip";
import TrendStamp from "@/components/TrendStamp";
import DetailSpec from "@/components/DetailSpec";
import CurveChart from "@/components/CurveChart";
import LawTimeline from "@/components/LawTimeline";
import FactList from "@/components/FactList";
import LineageStrip from "@/components/LineageStrip";
import MobileBreak from "@/components/MobileBreak";

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

/** 商品名を読点で 2 行に分け、長いほうの行の文字数で大きさを決める */
function titleLines(name: string): string[] {
  if (name.length <= 8) return [name];
  const parts = name.split(/(?<=[、，,])/).filter(Boolean);
  return parts.length > 1 ? parts : [name];
}

function titleSize(lines: string[]): string {
  const n = Math.max(...lines.map((l) => l.length));
  if (n <= 3) return "clamp(64px, 20vw, 120px)";
  if (n <= 4) return "clamp(56px, 16vw, 104px)";
  if (n <= 6) return "clamp(44px, 12.5vw, 84px)";
  if (n <= 8) return "clamp(36px, 10vw, 66px)";
  if (n <= 10) return "clamp(30px, 8vw, 54px)";
  return "clamp(26px, 6.8vw, 46px)";
}

/** おなじ棚の他の商品。自分の後ろに続くものを優先して最大 4 枚 */
function sameShelf(v: Value, max = 4) {
  const list = byShelf(v.shelf);
  const i = list.findIndex((x) => x.no === v.no);
  const ordered = i >= 0 ? [...list.slice(i + 1), ...list.slice(0, i)] : list;
  return ordered.filter((x) => x.no !== v.no).slice(0, max);
}

/** hitokoto 用。句点では必ず改行し、読点では携帯だけ改行する */
function Lead({ text }: { text: string }) {
  const sentences = text.split(/(?<=。)/).filter(Boolean);
  return (
    <>
      {sentences.map((s, i) => {
        const parts = s.split(/(?<=、)/).filter(Boolean);
        return (
          <Fragment key={i}>
            {parts.map((p, j) => (
              <Fragment key={j}>
                {p}
                {j < parts.length - 1 && <MobileBreak />}
              </Fragment>
            ))}
            {i < sentences.length - 1 && <br />}
          </Fragment>
        );
      })}
    </>
  );
}

function SectionHead({ en, ja, right, id }: { en: string; ja: string; right?: string; id: string }) {
  return (
    <header className="flex flex-wrap items-end gap-x-3 gap-y-1 border-b-[3px] border-vl-ink pb-2">
      <h2 id={id} className="flex items-baseline gap-3">
        <span className="font-display-en text-[24px] leading-none tracking-[0.04em] text-vl-red md:text-[30px]">{en}</span>
        <span className="font-display-ja text-[15px] leading-none md:text-[18px]">{ja}</span>
      </h2>
      {right && <span className="font-type ml-auto text-[10px] tracking-[0.25em] text-vl-ink-soft">{right}</span>}
    </header>
  );
}

function SpanBox({ v, accent }: { v: Value; accent: string }) {
  const start = v.made ? `${v.made.approx ? "c." : ""}${v.made.year}` : "—";
  const end = v.restocked ? `${v.restocked.year} RESTOCK` : v.discontinued ? `${v.discontinued.year} DISC.` : "NOW";
  return (
    <div className="vl-offset-sm border-2 border-vl-ink bg-vl-card px-4 pt-3 pb-3 md:px-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <p className="font-type text-[10px] tracking-[0.3em] whitespace-nowrap text-vl-ink-soft">FIG.1 · SPAN · 流通期間</p>
        <p className="font-type text-[10px] font-bold tracking-[0.15em] whitespace-nowrap">
          {start} — {end}
        </p>
      </div>
      <div className="mt-2 text-[18px] md:text-[21px]">
        <SpanStrip v={v} accent={accent} showLabels />
      </div>
      <ul className="font-type mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[9px] tracking-[0.15em] text-vl-ink-soft">
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-[6px] w-[14px]" style={{ background: accent }} aria-hidden />
          MFD. 製造〜
        </li>
        {v.made?.approx && (
          <li className="flex items-center gap-1.5">
            <span
              className="inline-block h-[6px] w-[14px]"
              style={{ background: `repeating-linear-gradient(90deg, ${accent} 0 2px, transparent 2px 4px)` }}
              aria-hidden
            />
            APPROX. 概算
          </li>
        )}
        {v.discontinued && (
          <li className="flex items-center gap-1.5">
            <span className="font-bold text-vl-red">✕</span>
            DISC. 廃番
          </li>
        )}
        {v.restocked && (
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-[8px] w-[8px] rounded-full border-2 border-vl-red" aria-hidden />
            RESTOCK 再入荷
          </li>
        )}
        {v.discontinued && v.trend !== "discontinued" && !v.restocked && (
          <li className="flex items-center gap-1.5">
            <span
              className="inline-block h-[2px] w-[14px]"
              style={{ background: `repeating-linear-gradient(90deg, ${accent} 0 3px, transparent 3px 5px)` }}
              aria-hidden
            />
            STILL HELD 制度の廃止後も残る
          </li>
        )}
        {!v.discontinued && (
          <li className="flex items-center gap-1.5">
            <span className="font-bold">▶</span>
            IN STOCK 現役
          </li>
        )}
      </ul>
    </div>
  );
}

function NavButton({ dir, v }: { dir: "prev" | "next"; v: Value }) {
  const isPrev = dir === "prev";
  return (
    <Link
      href={`/values/${v.no}`}
      className={`vl-offset group block border-2 border-vl-ink bg-vl-card px-5 py-4 transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 md:px-6 md:py-5 ${
        isPrev ? "text-left" : "text-right"
      }`}
    >
      <p className="font-type text-[10px] tracking-[0.3em] text-vl-ink-soft">
        {isPrev ? "← PREV" : "NEXT →"}
        <span className="ml-2 font-bold text-vl-ink">NO.{v.no}</span>
      </p>
      <p className="font-display-ja mt-1.5 text-[18px] leading-tight group-hover:text-vl-red md:text-[24px]">
        {isPrev && <span className="mr-2 text-vl-red">←</span>}
        {v.name}
        {!isPrev && <span className="ml-2 text-vl-red">→</span>}
      </p>
      <p className="font-type mt-1 text-[10px] tracking-[0.12em] text-vl-ink-soft">{v.reading}</p>
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
  const lines = titleLines(v.name);
  const hasCurve = v.evidence === "curve" && !!v.curve;

  return (
    <article className="mx-auto max-w-6xl px-4 md:px-8">
      {/* 1. パンくず */}
      <div className="flex items-center justify-between gap-3 pt-5 md:pt-8">
        <Link href={`/#shelf-${shelf.no}`} className="vl-link font-type text-[11px] tracking-[0.15em] md:text-[12px]">
          ← 索引にもどる
        </Link>
        <p className="font-type text-[10px] tracking-[0.25em] text-vl-ink-soft md:text-[11px]">
          NO.{v.no} · SHELF {shelf.no} · {v.category}
        </p>
      </div>

      {/* 2. 見出し */}
      <header className="mt-6 grid gap-6 md:mt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-10">
        <div className="min-w-0">
          <p className="font-display-en text-[18px] leading-none tracking-[0.12em] text-vl-red uppercase md:text-[26px]">
            {v.en}
          </p>
          <h1 className="font-display-ja mt-3 leading-[1.12]" style={{ fontSize: titleSize(lines) }}>
            {lines.map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </h1>
          <p className="font-type mt-3 text-[12px] tracking-[0.2em] text-vl-ink-soft md:text-[13px]">{v.reading}</p>
          <div className="mt-5">
            <TrendStamp trend={v.trend} className="text-[15px] md:text-[19px]" />
          </div>
        </div>

        {/* 型番タグ（PC のみ） */}
        <div className="hidden md:block">
          <div
            className="vl-offset relative w-[172px] border-2 border-vl-ink px-4 pt-6 pb-4 text-center"
            style={{ background: acc.bg, color: acc.fg }}
          >
            <span
              className="absolute top-2 left-1/2 h-[12px] w-[12px] -translate-x-1/2 rounded-full border-2 border-vl-ink bg-vl-paper"
              aria-hidden
            />
            <p className="font-type mt-1 text-[9px] tracking-[0.35em]">CAT. NO.</p>
            <p className="font-display-en text-[84px] leading-none tracking-[0.02em]">{v.no}</p>
            <div className="mt-3 border-t pt-2" style={{ borderColor: acc.fg }}>
              <p className="font-type text-[9px] tracking-[0.3em]">SHELF {shelf.no}</p>
              <p className="font-display-ja mt-1 text-[11px] leading-snug">{shelf.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* 3. hitokoto */}
      <p className="mt-7 max-w-[42rem] text-[17px] leading-[1.75] font-bold md:mt-9 md:text-[22px]">
        <Lead text={v.hitokoto} />
      </p>

      <div className="vl-rule mt-8 md:mt-10" />

      {/* 4. 仕様表 ＋ 証拠 */}
      <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10" aria-label="仕様と証拠">
        <div className="space-y-7">
          <DetailSpec v={v} />
          <SpanBox v={v} accent={acc.bar} />
        </div>
        <div>{hasCurve ? <CurveChart curve={v.curve!} /> : <LawTimeline v={v} />}</div>
      </section>
      {/* カーブ型でも、製造・廃番・再入荷の根拠は日付の帳票で示す */}
      {hasCurve && (v.made?.fact || v.discontinued?.fact || v.restocked?.fact) && (
        <section className="mt-8" aria-label="日付の根拠">
          <LawTimeline v={v} />
        </section>
      )}

      {/* 補助の図: 法令・初出型に添える統計と、カーブ型の二枚目以降 */}
      {(() => {
        const extras = [...(!hasCurve && v.curve ? [v.curve] : []), ...(v.extraCurves ?? [])];
        if (extras.length === 0) return null;
        return (
          <section
            className={`mt-8 grid gap-8 ${extras.length > 1 ? "lg:grid-cols-2 lg:gap-10" : ""}`}
            aria-label="補助の統計"
          >
            {extras.map((c, i) => (
              <CurveChart key={c.title} curve={c} fig={`FIG.${3 + i}`} />
            ))}
          </section>
        );
      })()}

      {/* 5. 本文 */}
      <section className="mt-14 md:mt-20" aria-labelledby="description">
        <SectionHead id="description" en="DESCRIPTION" ja="商品説明" right={`${v.body.length} PARAGRAPHS`} />
        <div className="vl-prose vl-justify mt-6 max-w-[44rem] text-[15px] leading-[2] md:text-[16px]">
          {v.body.map((p, i) => (
            <p key={i}>
              <span className="font-type mr-1.5 text-[0.85em] font-bold text-vl-red" aria-hidden>
                ¶
              </span>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* 6. 裏取りメモ */}
      <div className="mt-14 md:mt-20">
        <FactList v={v} />
      </div>

      {/* 7. 系譜 */}
      <LineageStrip v={v} />

      {/* 8. おなじ棚の商品 */}
      {siblings.length > 0 && (
        <section className="mt-14 md:mt-20" aria-labelledby="same-shelf">
          <SectionHead id="same-shelf" en="SAME SHELF" ja="おなじ棚の商品" right={`SHELF ${shelf.no} · ${shelf.name}`} />
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 md:gap-x-6 lg:grid-cols-4">
            {siblings.map((s, i) => (
              <li key={s.no}>
                <ValueCard v={s} index={i} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 9. 前後の商品 */}
      <nav className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20" aria-label="前後の商品">
        {prev ? <NavButton dir="prev" v={prev} /> : <span aria-hidden />}
        {next ? <NavButton dir="next" v={next} /> : <span aria-hidden />}
      </nav>
    </article>
  );
}
