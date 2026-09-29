import type { Value } from "@/data/types";
import { shelfById, categoryMeta } from "@/data/shelves";
import { t } from "@/i18n/ui";
import type { Lang } from "@/i18n/lang";
import { tValue, asName, categoryName, shelfName } from "@/i18n/ui.value";
import { evidenceName, trendName } from "@/i18n/ui.about";
import { SHELF_ACCENT } from "./ValueCard";
import TrendStamp from "./TrendStamp";

/**
 * 製品仕様表｡2列のマス目に､ラベル（小）と値（太字）を並べる｡
 * 型番はヒーローと重複するので出さない｡値のない項目（再入荷のないもの等）は出さない｡
 * 製造／廃番／再入荷の根拠（fact と出典）は｢日付の帳票｣（LawTimeline）にまとめる｡
 *
 * 英語では､判子に出ている大文字（NORM・RISING）を横に添えない｡同じ語が二度出るため｡
 */
function Cell({
  label,
  children,
  wide = false,
  right = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
  /** 2列目のマス（左に罫を引く） */
  right?: boolean;
}) {
  return (
    <div className={`border-t-2 border-vl-ink/15 px-3 py-2 md:px-4 md:py-3 ${wide ? "col-span-2" : ""} ${right ? "border-l-2 border-l-vl-ink/15" : ""}`}>
      <p className="text-[10.5px] font-bold text-vl-ink-soft md:text-[12px]">{label}</p>
      <div className="mt-0.5 text-[12px] leading-snug font-bold md:mt-1 md:text-[15px]">{children}</div>
    </div>
  );
}

/** ｢1873 復讐厳禁の布告｣を､年と説明の2行に分ける（狭いマスで語の途中で折れないように） */
function DateLabel({ label, approx = false }: { label: string; approx?: boolean }) {
  const m = label.match(/^(\S+)\s+(.+)$/);
  const c = approx ? <span className="font-type mr-1 text-[12px] text-vl-ink-soft">c.</span> : null;
  if (!m)
    return (
      <>
        {c}
        {label}
      </>
    );
  return (
    <>
      <span className="block">
        {c}
        {m[1]}
      </span>
      <span className="block break-keep wrap-anywhere">{m[2]}</span>
    </>
  );
}

export default function DetailSpec({ v, lang }: { v: Value; lang: Lang }) {
  const shelf = shelfById(v.shelf);
  const acc = SHELF_ACCENT[String(v.shelf)];
  return (
    <div className="vl-offset border-2 border-vl-ink bg-vl-card">
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: acc.bg, color: acc.fg }}
      >
        <span className="text-[13px] font-bold">{tValue(lang, "specTitle")}</span>
      </div>
      <div className="grid grid-cols-2">
        <Cell label={t(lang, "group")} wide>
          <span className="flex items-start gap-2">
            <span className="mt-[4px] inline-block h-[12px] w-[12px] shrink-0 border-2 border-vl-ink" style={{ background: acc.bg }} aria-hidden />
            <span>
              {shelf.no}. {shelfName(lang, shelf)}
            </span>
          </span>
        </Cell>
        <Cell label={t(lang, "category")} wide>
          {categoryName(lang, v.category)}
          {lang === "ja" && (
            <span className="font-type ml-1.5 text-[12px] font-normal tracking-[0.08em] text-vl-ink-soft">{categoryMeta[v.category].en}</span>
          )}
        </Cell>
        <Cell label={tValue(lang, "specMade")}>
          {v.made ? <DateLabel label={v.made.label} approx={v.made.approx} /> : "—"}
        </Cell>
        <Cell label={v.discontinued ? tValue(lang, "specEnded") : tValue(lang, "specState")} right>
          {v.discontinued ? (
            <span className="block text-vl-red">
              <DateLabel label={v.discontinued.label} />
            </span>
          ) : (
            tValue(lang, "specCurrent")
          )}
        </Cell>
        {v.restocked && (
          <Cell label={tValue(lang, "specRestock")} wide>
            {v.restocked.label}
            {v.restocked.as && !v.restocked.label.includes(v.restocked.as) && (
              <span className="ml-2 text-[11px] font-normal md:text-[13px]">{asName(lang, v.restocked.as)}</span>
            )}
          </Cell>
        )}
        <Cell label={tValue(lang, "specEvidence")}>{evidenceName(lang, v.evidence)}</Cell>
        <Cell label={t(lang, "trend")} right>
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[11px]">
              <TrendStamp trend={v.trend} seed={v.no} lang={lang} />
            </span>
            {lang === "ja" && <span className="text-[11px] md:text-[13px]">{trendName(lang, v.trend)}</span>}
          </span>
        </Cell>
        <Cell label={t(lang, "confidence")} wide>
          <span className="inline-flex items-center gap-1.5" aria-label={`${t(lang, "confidence")} ${v.confidence}`}>
            {(["A", "B", "C"] as const).map((c) => (
              <span
                key={c}
                className={`font-type grid h-6 w-6 place-items-center border-2 text-[11px] md:h-7 md:w-7 md:text-[13px] ${
                  c === v.confidence ? "border-vl-ink bg-vl-ink font-bold text-vl-paper" : "border-vl-ink/25 font-normal text-vl-ink-soft"
                }`}
              >
                {c}
              </span>
            ))}
            <span className="ml-2 text-[11px] font-normal md:text-[13px]">
              {t(lang, v.confidence === "A" ? "confidenceA" : v.confidence === "B" ? "confidenceB" : "confidenceC")}
            </span>
          </span>
        </Cell>
      </div>
    </div>
  );
}
