/**
 * 図鑑（一覧・刷り札・グループ札）だけで使う言葉｡
 *
 * 共通の言葉は `ui.ts` の `UI` から `t()` で引く｡ここに置くのは足りないものだけ｡
 * 傾向と証拠の絞り込みは､データ側（`trendMeta` / `evidenceMeta`）の英語が
 * 判子用の大文字なので､chip に置くための短い形をここで持つ｡
 */
import { make, type Dict } from "./index";

const D = {
  // 傾向の chip
  trendUp: { ja: "上昇", en: "Rising" },
  trendSteady: { ja: "安定", en: "Steady" },
  trendDown: { ja: "下落", en: "Falling" },
  trendDiscontinued: { ja: "失効", en: "Lapsed" },
  trendRestocked: { ja: "復活", en: "Revived" },

  // 証拠の chip
  evLaw: { ja: "法令・初出型", en: "By document" },
  evCurve: { ja: "カーブ型", en: "By curve" },

  // 分類の chip｡データ側は日本語なので､英語はここで持つ
  cNorm: { ja: "規範", en: "Norms" },
  cLife: { ja: "人生観", en: "Life views" },
  cJudge: { ja: "判断基準", en: "Criteria" },

  // 地域の chip｡データ側は日本語なので､英語はここで持つ
  rJapan: { ja: "日本", en: "Japan" },
  rEastAsia: { ja: "東アジア", en: "East Asia" },
  rSouthAsia: { ja: "南アジア", en: "South Asia" },
  rMideast: { ja: "中東", en: "Middle East" },
  rEurope: { ja: "ヨーロッパ", en: "Europe" },
  rNorthAmerica: { ja: "北米", en: "North America" },
  rLatinAmerica: { ja: "中南米", en: "Latin America" },
  rAfrica: { ja: "アフリカ", en: "Africa" },
  rOceania: { ja: "オセアニア", en: "Oceania" },
} satisfies Dict;

export const tIndex = make(D);
