/**
 * 系譜の英訳｡カードと同じく別ファイルに置いて､読むときに重ねる｡
 * 訳が無い項目は日本語のまま出る｡
 */
import type { Lineage } from "./lineages";
import type { Lang } from "@/i18n/lang";
import raw from "./lineages.en.json";

type EnNode = { label?: string; note?: string; yearLabel?: string };
type EnLineage = {
  title?: string;
  en?: string;
  lead?: string;
  span?: string;
  spanLabel?: string;
  nodes?: EnNode[];
};

const EN = raw as Record<string, EnLineage | undefined>;
const or = <T>(a: T | undefined | null, b: T): T => (a == null || a === "" ? b : a);

/** その言語で読める系譜にする */
export function localizeLineage(l: Lineage, lang: Lang): Lineage {
  if (lang === "ja") return l;
  const e = EN[l.id];
  if (!e) return l;
  return {
    ...l,
    title: or(e.title, l.title),
    en: or(e.en, l.en),
    lead: or(e.lead, l.lead),
    span: or(e.span, l.span),
    spanLabel: or(e.spanLabel, l.spanLabel),
    nodes: l.nodes.map((n, i) => ({
      ...n,
      label: or(e.nodes?.[i]?.label, n.label),
      note: or(e.nodes?.[i]?.note, n.note),
      yearLabel: or(e.nodes?.[i]?.yearLabel, n.yearLabel),
    })),
  };
}
