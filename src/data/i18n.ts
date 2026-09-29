/**
 * カードの中身の英訳｡
 *
 * `values.json` は research → merge-research.mjs の一方通行で作り直されるので、
 * 英訳はそこに混ぜず `values.en.json` に別で置き、読むときに重ねる。
 * 訳が無い項目は日本語のまま出る（訳し終えたものから順に英語になる）。
 */
import type { Curve, Value } from "./types";
import type { Lang } from "@/i18n/lang";
import raw from "./values.en.json";

type EnCurve = {
  title?: string;
  subtitle?: string | null;
  unit?: string;
  note?: string | null;
  series?: string[];
  marks?: string[];
};

type EnValue = {
  name?: string;
  reading?: string;
  meaning?: string | null;
  hitokoto?: string;
  body?: string[];
  made?: { label?: string; fact?: string };
  discontinued?: { label?: string; fact?: string };
  restocked?: { label?: string; fact?: string; as?: string };
  keyfacts?: { text?: string }[];
  curve?: EnCurve;
  extraCurves?: EnCurve[];
};

const EN = raw as Record<string, EnValue | undefined>;

/** 訳があればそれ、無ければ元のまま */
const or = <T>(a: T | undefined | null, b: T): T => (a == null || a === "" ? b : a);

function curve(c: Curve, e: EnCurve | undefined): Curve {
  if (!e) return c;
  return {
    ...c,
    title: or(e.title, c.title),
    subtitle: or(e.subtitle, c.subtitle),
    unit: or(e.unit, c.unit),
    note: or(e.note, c.note),
    series: c.series.map((s, i) => ({ ...s, name: or(e.series?.[i], s.name) })),
    marks: c.marks?.map((m, i) => ({ ...m, text: or(e.marks?.[i], m.text) })),
  };
}

/** その言語で読めるカードにする */
export function localize(v: Value, lang: Lang): Value {
  if (lang === "ja") return v;
  const e = EN[v.no];
  if (!e) return v;
  return {
    ...v,
    name: or(e.name, v.name),
    reading: or(e.reading, v.reading),
    meaning: or(e.meaning, v.meaning),
    hitokoto: or(e.hitokoto, v.hitokoto),
    body: v.body.map((p, i) => or(e.body?.[i], p)),
    made: v.made ? { ...v.made, label: or(e.made?.label, v.made.label), fact: or(e.made?.fact, v.made.fact) } : v.made,
    discontinued: v.discontinued
      ? { ...v.discontinued, label: or(e.discontinued?.label, v.discontinued.label), fact: or(e.discontinued?.fact, v.discontinued.fact) }
      : v.discontinued,
    restocked: v.restocked
      ? {
          ...v.restocked,
          label: or(e.restocked?.label, v.restocked.label),
          fact: or(e.restocked?.fact, v.restocked.fact),
          as: or(e.restocked?.as, v.restocked.as),
        }
      : v.restocked,
    keyfacts: v.keyfacts.map((k, i) => ({ ...k, text: or(e.keyfacts?.[i]?.text, k.text) })),
    curve: v.curve ? curve(v.curve, e.curve) : v.curve,
    extraCurves: v.extraCurves?.map((c, i) => curve(c, e.extraCurves?.[i])),
  };
}
