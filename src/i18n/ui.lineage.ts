/**
 * 系譜のページだけで使う言葉｡
 *
 * 共通の言葉は `ui.ts` の `UI` から `t()` で引く｡ここに置くのは足りないものだけ｡
 * 系譜の題・リード・層の名前・注記・年の見出しは `data/lineages.ts` の持ち物なので
 * ここには入れない（翻訳は別の工程）｡
 */
import { make, type Dict } from "./index";
import { t } from "./ui";
import type { Lang } from "./lang";
import type { LineageKind } from "@/data/lineages";

const D = {
  // 目次
  tocAria: { ja: "系譜の目次", en: "Lineage contents" },

  // 系譜の種類｡restock は共通の stateRestocked を使う
  kindRelabel: { ja: "名札の付け替え", en: "Relabeled" },
  kindTheme: { ja: "主題の並び", en: "Same theme" },

  // 分解図
  cardLinkTail: { ja: " のカードへ", en: " — open card" },

  // カードのページの帯
  toLineagePage: { ja: "系譜のページへ →", en: "Lineage page →" },

  // 長距離復活の半券
  madeShort: { ja: "成立", en: "Established" },
  endedShort: { ja: "失効", en: "Lapsed" },
  gapFromEnded: { ja: "失効から", en: "Lapsed" },
  gapFromMade: { ja: "成立から", en: "Established" },
  gapUnit: { ja: "年", en: "years later" },
  pairsEndedTitle: { ja: "失効から､復活まで", en: "From lapsing, to revival" },
  pairsEndedNote: { ja: "制度や法令で一度終わった日から数える｡", en: "Counted from the day a rule or law ended it." },
  pairsMadeTitle: { ja: "成立から､復活まで", en: "From founding, to revival" },
  pairsMadeNote: { ja: "失効の日付がないので､成立の年から数える｡", en: "No lapse date, so counted from the year it was established." },
} satisfies Dict;

export const tLineage = make(D);

/** 系譜の種類の名前｡lineages.ts の英語は判子用の大文字なので､画面にはこちらを出す */
export function kindLabel(lang: Lang, kind: LineageKind): string {
  if (kind === "restock") return t(lang, "stateRestocked");
  return tLineage(lang, kind === "relabel" ? "kindRelabel" : "kindTheme");
}
