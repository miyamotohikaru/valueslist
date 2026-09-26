import type { Value } from "@/data/types";
import { shelfById, categoryMeta, evidenceMeta, trendMeta } from "@/data/shelves";
import { SHELF_ACCENT } from "./ValueCard";
import TrendStamp from "./TrendStamp";

/**
 * 製品仕様表｡2列のマス目に､ラベル（小）と値（太字）を並べる｡
 * 型番はヒーローと重複するので出さない｡値のない項目（再入荷のないもの等）は出さない｡
 * 製造／廃番／再入荷の根拠（fact と出典）は｢日付の帳票｣（LawTimeline）にまとめる｡
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
    <div className={`border-t-2 border-vl-ink/15 px-4 py-3 ${wide ? "col-span-2" : ""} ${right ? "border-l-2 border-l-vl-ink/15" : ""}`}>
      <p className="text-[12px] font-bold text-vl-ink-soft">{label}</p>
      <div className="mt-1 text-[12px] leading-snug font-bold md:text-[15px]">{children}</div>
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

export default function DetailSpec({ v }: { v: Value }) {
  const shelf = shelfById(v.shelf);
  const acc = SHELF_ACCENT[String(v.shelf)];
  return (
    <div className="vl-offset border-2 border-vl-ink bg-vl-card">
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: acc.bg, color: acc.fg }}
      >
        <span className="text-[13px] font-bold">仕様</span>
      </div>
      <div className="grid grid-cols-2">
        <Cell label="棚" wide>
          <span className="flex items-start gap-2">
            <span className="mt-[4px] inline-block h-[12px] w-[12px] shrink-0 border-2 border-vl-ink" style={{ background: acc.bg }} aria-hidden />
            <span>
              {shelf.no}. {shelf.name}
            </span>
          </span>
        </Cell>
        <Cell label="分類" wide>
          {v.category}
          <span className="font-type ml-1.5 text-[12px] font-normal tracking-[0.08em] text-vl-ink-soft">{categoryMeta[v.category].en}</span>
        </Cell>
        <Cell label="製造">
          {v.made ? <DateLabel label={v.made.label} approx={v.made.approx} /> : "—"}
        </Cell>
        <Cell label={v.discontinued ? "廃番" : "いまの状態"} right>
          {v.discontinued ? (
            <span className="block text-vl-red">
              <DateLabel label={v.discontinued.label} />
            </span>
          ) : (
            "現役"
          )}
        </Cell>
        {v.restocked && (
          <Cell label="再入荷" wide>
            {v.restocked.label}
            {v.restocked.as && !v.restocked.label.includes(v.restocked.as) && (
              <span className="ml-2 text-[13px] font-normal">（{v.restocked.as} として）</span>
            )}
          </Cell>
        )}
        <Cell label="証拠の型">{evidenceMeta[v.evidence].ja}</Cell>
        <Cell label="傾向" right>
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[11px]">
              <TrendStamp trend={v.trend} seed={v.no} />
            </span>
            <span className="text-[13px]">{trendMeta[v.trend].ja}</span>
          </span>
        </Cell>
        <Cell label="確度" wide>
          <span className="inline-flex items-center gap-1.5" aria-label={`確度 ${v.confidence}`}>
            {(["A", "B", "C"] as const).map((c) => (
              <span
                key={c}
                className={`font-type grid h-7 w-7 place-items-center border-2 text-[13px] ${
                  c === v.confidence ? "border-vl-ink bg-vl-ink font-bold text-vl-paper" : "border-vl-ink/25 font-normal text-vl-ink-soft"
                }`}
              >
                {c}
              </span>
            ))}
            <span className="ml-2 text-[13px] font-normal">
              {v.confidence === "A" ? "公文書・統計で年月日まで特定" : v.confidence === "B" ? "学術書などで裏づけ" : "通説の域"}
            </span>
          </span>
        </Cell>
      </div>
    </div>
  );
}
