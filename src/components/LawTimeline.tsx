import type { Value, DatePoint } from "@/data/types";
import { Ja } from "@/lib/ja";
import { SourceText } from "@/lib/source";

/**
 * 法令・初出型の証拠。製造／廃番／再入荷を「日付の帳票」として縦に並べる。
 * 左端のスパイン（縦線＋丸）で行を結ぶ。
 */

type Kind = "made" | "discontinued" | "restocked";

const KIND: Record<Kind, { en: string; ja: string }> = {
  made: { en: "MFD.", ja: "製造" },
  discontinued: { en: "DISC.", ja: "廃番" },
  restocked: { en: "RESTOCK", ja: "再入荷" },
};


function Marker({ kind }: { kind: Kind | "stock" }) {
  const base = "absolute left-0 top-[6px] h-[14px] w-[14px] rounded-full border-2 border-vl-ink md:top-[14px]";
  if (kind === "made") return <span className={`${base} bg-vl-ink`} aria-hidden />;
  if (kind === "discontinued") return <span className={`${base} bg-vl-red`} aria-hidden />;
  if (kind === "restocked")
    return (
      <span className={`${base} grid place-items-center bg-vl-red`} aria-hidden>
        <span className="h-[4px] w-[4px] rounded-full bg-vl-paper" />
      </span>
    );
  return <span className={`${base} bg-vl-paper`} aria-hidden />;
}

function Row({ kind, d }: { kind: Kind; d: DatePoint }) {
  const k = KIND[kind];
  return (
    <li className="relative pl-7 md:pl-8">
      <Marker kind={kind} />
      <div className="grid gap-x-5 gap-y-1 md:grid-cols-[132px_1fr]">
        <div>
          <p className="font-display-en text-[40px] leading-none tracking-[0.02em] md:text-[48px]">
            {d.approx && <span className="font-type mr-1 text-[0.42em] tracking-[0.05em] text-vl-ink-soft">c.</span>}
            {d.year}
          </p>
          <p className="font-type mt-1 text-[10px] tracking-[0.3em] text-vl-ink-soft">
            {k.en} · {k.ja}
          </p>
        </div>
        <div className="min-w-0 md:pt-1">
          <p className="text-[15px] leading-snug font-bold md:text-[16px]">
            {d.label}
            {d.as && (
              <span className="font-type ml-2 inline-block border border-vl-ink px-1.5 py-0.5 align-middle text-[10px] font-bold tracking-[0.12em]">
                AS “{d.as}”
              </span>
            )}
          </p>
          {d.fact && (
            <p className="mt-1.5 text-[13px] leading-[1.8] md:text-[14px]">
              <Ja text={d.fact} />
            </p>
          )}
          {d.source && (
            <p className="font-type mt-1.5 text-[10px] leading-relaxed tracking-[0.06em] text-vl-ink-soft md:text-[11px]">
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
    <figure className="vl-offset relative flex h-full flex-col border-2 border-vl-ink bg-vl-card">
      <div className="border-b-2 border-vl-ink px-4 py-3 md:px-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-type text-[10px] tracking-[0.25em] whitespace-nowrap text-vl-ink-soft">
            FIG.2 · <span className="hidden md:inline">DOCUMENT </span>LEDGER · 日付の帳票
          </p>
          <span className="vl-stamp font-display-en shrink-0 text-[10px] text-vl-red md:text-[13px]">
            DATED BY DOCUMENT
          </span>
        </div>
        <p className="mt-1.5 text-[13px] leading-snug font-bold md:text-[14px]">
          {v.name}の日付は、この文書で決まる。
        </p>
      </div>

      <div className="flex flex-1 flex-col px-4 py-6 md:px-6 md:py-8">
        <div className="relative">
          {/* スパイン */}
          <span
            className="absolute top-3 bottom-3 left-[6px] w-[2px] bg-vl-ink"
            aria-hidden
          />
          <ol className="flex flex-col gap-7 md:gap-9">
            {rows.map((r) => (
              <Row key={r.kind} kind={r.kind} d={r.d} />
            ))}
            {rows.length === 0 && (
              <li className="font-type text-[12px] tracking-[0.12em] text-vl-ink-soft">日付の記録なし。</li>
            )}
            {inStock && (
              <li className="relative pl-7 md:pl-8">
                <Marker kind="stock" />
                <p className="font-type pt-[5px] text-[11px] font-bold tracking-[0.25em] md:pt-[13px]">
                  → IN STOCK · 現役
                  {v.restocked?.as && (
                    <span className="ml-2 font-normal text-vl-ink-soft">（{v.restocked.as} として）</span>
                  )}
                </p>
              </li>
            )}
          </ol>
        </div>
        <p className="font-type mt-auto pt-8 text-right text-[10px] tracking-[0.3em] text-vl-ink-soft">
          以下余白 · END OF RECORD
        </p>
      </div>
    </figure>
  );
}
