import type { Value, DatePoint } from "@/data/types";
import { SourceText } from "@/lib/source";
import type { Lang } from "@/i18n/lang";
import { tValue, asName, datedByLines } from "@/i18n/ui.value";

/**
 * 日付の帳票｡成立／失効／復活を縦に並べ､左の縦線（スパイン）で結ぶ｡
 * 箱の高さは中身に合わせる（隣の列に合わせて伸ばさない）｡
 *
 * 英語では略号（MFD. / DISC.）を添えない｡Made・Ended と同じ語が二度出るため｡
 */
type Kind = "made" | "discontinued" | "restocked";

const KIND_EN: Record<Kind, string> = {
  made: "MFD.",
  discontinued: "DISC.",
  restocked: "RESTOCK",
};

const KIND_KEY: Record<Kind, "specMade" | "specEnded" | "specRestock"> = {
  made: "specMade",
  discontinued: "specEnded",
  restocked: "specRestock",
};

function Marker({ kind }: { kind: Kind | "stock" }) {
  const base = "absolute left-0 top-[10px] h-[16px] w-[16px] rounded-full border-2 border-vl-ink";
  if (kind === "made") return <span className={`${base} bg-vl-ink`} aria-hidden />;
  if (kind === "discontinued") return <span className={`${base} bg-vl-red`} aria-hidden />;
  if (kind === "restocked")
    return (
      <span className={`${base} grid place-items-center bg-vl-red`} aria-hidden>
        <span className="h-[5px] w-[5px] rounded-full bg-vl-paper" />
      </span>
    );
  return <span className={`${base} bg-vl-paper`} aria-hidden />;
}

function Row({ kind, d, last, lang }: { kind: Kind; d: DatePoint; last: boolean; lang: Lang }) {
  return (
    <li className="relative pb-7 pl-7 last:pb-0 md:pl-9">
      {!last && <span className="absolute top-[26px] bottom-0 left-[7px] w-[2px] bg-vl-ink" aria-hidden />}
      <Marker kind={kind} />
      <div className="grid gap-x-5 gap-y-1 md:grid-cols-[152px_minmax(0,1fr)]">
        <div>
          {/* 年は必ず1行｡欄の幅に収まる大きさにしてある */}
          <p className="font-display-en text-[26px] leading-none whitespace-nowrap md:text-[42px]">
            {d.approx && <span className="font-type mr-1 text-[0.4em] text-vl-ink-soft">c.</span>}
            {d.year}
          </p>
          <p className="mt-1 text-[12px] font-bold">
            {tValue(lang, KIND_KEY[kind])}
            {lang === "ja" && (
              <span className="font-type ml-1.5 font-normal tracking-[0.08em] text-vl-ink-soft">{KIND_EN[kind]}</span>
            )}
          </p>
        </div>
        <div className="min-w-0 md:pt-1">
          <p className="text-[12px] leading-snug font-bold md:text-[16px]">{d.label}</p>
          {d.fact && <p className="vl-justify mt-1.5 text-[12px] leading-[1.8] md:text-[14px]">{d.fact}</p>}
          {d.source && (
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-vl-ink-soft md:text-[12px]">
              <span className="font-type mr-1 font-bold tracking-[0.08em]">SOURCE ·</span>
              <SourceText s={d.source} />
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

export default function LawTimeline({ v, lang }: { v: Value; lang: Lang }) {
  const rows: { kind: Kind; d: DatePoint }[] = [];
  if (v.made) rows.push({ kind: "made", d: v.made });
  if (v.discontinued) rows.push({ kind: "discontinued", d: v.discontinued });
  if (v.restocked) rows.push({ kind: "restocked", d: v.restocked });
  const inStock = !v.discontinued || !!v.restocked;
  const [headA, headB] = datedByLines(lang, v.name);

  return (
    <figure className="vl-offset relative border-2 border-vl-ink bg-vl-card">
      <div className="border-b-2 border-vl-ink px-4 py-3 md:px-5">
        {/* 印は右に浮かせる｡横に並べると見出しの幅が足りず語の途中で折れる */}
        <div>
          <span className="vl-stamp font-display-en float-right ml-3 text-[12px] text-vl-red-deep md:text-[13px]">
            DATED BY DOCUMENT
          </span>
          <p className="text-[12px] leading-snug font-bold break-keep md:text-[16px]">
            {headA}
            <br />
            {headB}
          </p>
        </div>
      </div>

      <div className="px-4 py-6 md:px-6 md:py-7">
        <ol>
          {rows.map((r, i) => (
            <Row key={r.kind} kind={r.kind} d={r.d} last={i === rows.length - 1 && !inStock} lang={lang} />
          ))}
          {inStock && (
            <li className="relative pl-7 md:pl-9">
              <Marker kind="stock" />
              <p className="pt-[9px] text-[13px] font-bold">
                {tValue(lang, "stillInStock")}
                {v.restocked?.as && <span className="ml-1 font-normal">{asName(lang, v.restocked.as)}</span>}
              </p>
            </li>
          )}
        </ol>
        <p className="mt-6 text-right text-[12px] text-vl-ink-soft">{tValue(lang, "nothingFollows")}</p>
      </div>
    </figure>
  );
}
