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
  trendDiscontinued: { ja: "廃番", en: "Discontinued" },
  trendRestocked: { ja: "再入荷", en: "Restocked" },

  // 証拠の chip
  evLaw: { ja: "法令・初出型", en: "By document" },
  evCurve: { ja: "カーブ型", en: "By curve" },
} satisfies Dict;

export const tIndex = make(D);
