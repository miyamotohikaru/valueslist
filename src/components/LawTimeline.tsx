import type { Value, DatePoint } from "@/data/types";
import { SourceText } from "@/lib/source";

/**
 * 日付の帳票｡製造／廃番／再入荷を縦に並べ､左の縦線（スパイン）で結ぶ｡
 * 箱の高さは中身に合わせる（隣の列に合わせて伸ばさない）｡
 */
type Kind = "made" | "discontinued" | "restocked";

const KIND: Record<Kind, { en: string; ja: string }> = {
  made: { en: "MFD.", ja: "製造" },
  discontinued: { en: "DISC.", ja: "廃番" },
  restocked: { en: "RESTOCK", ja: "再入荷" },
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

function Row({ kind, d, last }: { kind: Kind; d: DatePoint; last: boolean }) {
  const k = KIND[kind];
  return (
    <li className="relative pb-7 pl-7 last:pb-0 md:pl-9">
      {!last && <span className="absolute top-[26px] bottom-0 left-[7px] w-[2px] bg-vl-ink" aria-hidden />}
      <Marker kind={kind} />
      <div className="grid gap-x-5 gap-y-1 md:grid-cols-[128px_minmax(0,1fr)]">
        <div>
          <p className="font-display-en text-[40px] leading-none md:text-[46px]">
            {d.approx && <span className="font-type mr-1 text-[0.4em] text-vl-ink-soft">c.</span>}
            {d.year}
          </p>
          <p className="mt-1 text-[12px] font-bold">
            {k.ja}
            <span className="font-type ml-1.5 font-normal tracking-[0.08em] text-vl-ink-soft">{k.en}</span>
          </p>
        </div>
        <div className="min-w-0 md:pt-1">
          <p className="text-[16px] leading-snug font-bold">{d.label}</p>
          {d.fact && <p className="vl-justify mt-1.5 text-[14px] leading-[1.8]">{d.fact}</p>}
          {d.source && (
            <p className="mt-1.5 text-[12px] leading-relaxed text-vl-ink-soft">
              <span className="font-type mr-1 font-bold tracking-[0.08em]">SOURCE ·</span>
              <SourceText s={d.source} />
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

export default function LawTimeline({ v }: { v: Value }) {
  const rows: { kind: Kind; d: DatePoint }[] = [];
  if (v.made) rows.push({ kind: "made", d: v.made });
  if (v.discontinued) rows.push({ kind: "discontinued", d: v.discontinued });
  if (v.restocked) rows.push({ kind: "restocked", d: v.restocked });
  const inStock = !v.discontinued || !!v.restocked;

  return (
    <figure className="vl-offset relative border-2 border-vl-ink bg-vl-card">
      <div className="border-b-2 border-vl-ink px-4 py-3 md:px-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[15px] leading-snug font-bold md:text-[16px]">
            {v.name}の日付は､
            <br />
            この文書で決まる｡
          </p>
          <span className="vl-stamp font-display-en shrink-0 text-[12px] text-vl-red-deep md:text-[13px]">DATED BY DOCUMENT</span>
        </div>
      </div>

      <div className="px-4 py-6 md:px-6 md:py-7">
        <ol>
          {rows.map((r, i) => (
            <Row key={r.kind} kind={r.kind} d={r.d} last={i === rows.length - 1 && !inStock} />
          ))}
          {inStock && (
            <li className="relative pl-7 md:pl-9">
              <Marker kind="stock" />
              <p className="pt-[9px] text-[13px] font-bold">
                いまも棚にある
                {v.restocked?.as && <span className="ml-1 font-normal">（{v.restocked.as} として）</span>}
              </p>
            </li>
          )}
        </ol>
        <p className="mt-6 text-right text-[12px] text-vl-ink-soft">以下余白</p>
      </div>
    </figure>
  );
}
