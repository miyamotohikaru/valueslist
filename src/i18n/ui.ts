/**
 * 画面に出る言葉｡日本語と英語を1か所に並べて持つ｡
 * 本文（カードの中身・項目ページの説明）はデータ側で持つので､ここには置かない｡
 */
import type { Lang } from "./lang";

export const UI = {
  siteName: { ja: "価値観一覧表", en: "Values List" },

  // ナビ
  navIndex: { ja: "図鑑", en: "INDEX" },
  navTimeline: { ja: "年表", en: "TIMELINE" },
  navLineage: { ja: "系譜", en: "LINEAGE" },
  navAbout: { ja: "読み方", en: "HOW TO READ" },
  navIndexSub: { ja: "INDEX", en: "CATALOGUE" },
  navTimelineSub: { ja: "TIMELINE", en: "BY YEAR" },
  navLineageSub: { ja: "LINEAGE", en: "REVIVED" },
  navAboutSub: { ja: "HOW TO READ", en: "NOTATION" },

  // 図鑑
  indexTitle: { ja: "図鑑", en: "Catalogue" },
  filter: { ja: "絞り込み", en: "Filter" },
  sortLabel: { ja: "並べ替え", en: "Sort" },
  sortNo: { ja: "型番順", en: "By no." },
  sortMade: { ja: "成立年順", en: "By year" },
  sortDisc: { ja: "失効・復活順", en: "By ending" },
  clearAll: { ja: "すべて解除", en: "Clear all" },
  group: { ja: "グループ", en: "Group" },
  category: { ja: "分類", en: "Category" },
  trend: { ja: "傾向", en: "Trend" },
  evidence: { ja: "証拠", en: "Evidence" },
  region: { ja: "地域", en: "Region" },
  country: { ja: "国", en: "Country" },
  empty: { ja: "該当するカードがありません｡", en: "No cards match." },
  countUnit: { ja: "点", en: " items" },

  // 札
  mfd: { ja: "成立 EST", en: "ESTABLISHED" },
  eol: { ja: "失効 LAPSE", en: "LAPSED" },
  restock: { ja: "復活 REVIVE", en: "REVIVED" },
  now: { ja: "現行 NOW", en: "CURRENT" },
  nowValue: { ja: "NOW", en: "NOW" },

  // 扱い
  stateUp: { ja: "現行・拡大中", en: "Rising" },
  stateSteady: { ja: "現行", en: "Current" },
  stateDown: { ja: "現行・減少中", en: "Falling" },
  stateDiscontinued: { ja: "失効", en: "Lapsed" },
  stateRestocked: { ja: "復活", en: "Revived" },

  // 年表
  timelineTitle: { ja: "年表", en: "Timeline" },
  timelineEn: { ja: "INVENTORY BY YEAR", en: "BY YEAR OF MAKING" },
  byMade: { ja: "成立年順", en: "By year made" },
  barIsSpan: { ja: "帯が期間｡", en: "The bar is the span." },
  barEnds: { ja: "左端が成立､右端が失効｡", en: "Left edge is made, right edge is ended." },
  axisCols: { ja: "グループ・型番・図版・名前", en: "Group / No. / Plate / Name" },
  eraTableCaption: { ja: "時代ごとの点数", en: "Count by era" },
  era: { ja: "時代", en: "Era" },
  years: { ja: "年", en: "Years" },
  count: { ja: "点数", en: "Count" },
  total: { ja: "合計", en: "Total" },
  undated: { ja: "成立年が特定できず､年表に載せていないもの", en: "Not dated, so not on the timeline" },

  // 凡例
  legendSpan: { ja: "期間(成立→失効)", en: "Span (made → ended)" },
  legendApprox: { ja: "成立年は概算", en: "Year is approximate" },
  legendEol: { ja: "失効", en: "Lapsed" },
  legendAfter: { ja: "制度の廃止後も残る", en: "Outlives the rule" },
  legendActive: { ja: "現役", en: "Still current" },
  legendRestock: { ja: "復活", en: "Revived" },
  legendLoop: { ja: "150年の円環", en: "The 150-year loop" },

  // 系譜
  lineageTitle: { ja: "系譜", en: "Lineage" },
  lineageEn: { ja: "BACK IN STOCK", en: "REVIVED" },
  toc: { ja: "目次", en: "Contents" },
  tocCount: { ja: "本の系譜", en: " lineages" },
  event: { ja: "出来事", en: "Event" },
  loopTail: { ja: "最後の弧で､元の場所へ", en: "The last arc returns" },
  readAllLoops: { ja: "系譜ページで､環の全部を読む →", en: "Read every lineage →" },

  // 項目ページ
  backToIndex: { ja: "← 索引にもどる", en: "← Back to the catalogue" },
  description: { ja: "説明", en: "Description" },
  descriptionEn: { ja: "DESCRIPTION", en: "DESCRIPTION" },
  factCheck: { ja: "裏取りメモ", en: "Fact check" },
  factCheckEn: { ja: "FACT CHECK", en: "FACT CHECK" },
  sameGroup: { ja: "おなじグループのカード", en: "Cards in the same group" },
  sameGroupEn: { ja: "SAME GROUP", en: "SAME GROUP" },
  sources: { ja: "出典", en: "Sources" },
  span: { ja: "存続期間", en: "Span" },
  prev: { ja: "前の標本", en: "Previous" },
  next: { ja: "次の標本", en: "Next" },
  confidence: { ja: "確度", en: "Confidence" },
  confidenceA: { ja: "公文書・統計で年月日まで特定", en: "Dated to the day by record or statistics" },
  confidenceB: { ja: "学術書などで裏づけ", en: "Supported by scholarship" },
  confidenceC: { ja: "通説の域", en: "Received wisdom" },

  // 読み方
  aboutTitle: { ja: "読み方", en: "How to read" },
  anatomy: { ja: "カードの読み方", en: "Anatomy of a card" },
  sample: { ja: "カードの見本", en: "Sample card" },
  partNo: { ja: "型番", en: "No." },
  partNoText: { ja: "グループの並び順の三桁｡", en: "Three digits, in group order." },
  partArt: { ja: "図版", en: "Plate" },
  partArtText: {
    ja: "灰色の版に描いてから網にかけたもの｡札ごとに網が違う｡",
    en: "Drawn as a grey plate, then put through a screen. Every card uses a different screen.",
  },
  partMeaning: { ja: "意味", en: "Meaning" },
  partMeaningText: { ja: "その言葉が指していたもの｡二行で収めている｡", en: "What the word pointed at. Kept to two lines." },
  partGroup: { ja: "グループ", en: "Group" },
  partGroupText: { ja: "下の線の色がグループ｡五つのグループを色で見分ける｡", en: "The line at the foot is the group. Five groups, five colours." },
  partState: { ja: "扱い", en: "State" },
  partStateText: { ja: "いまの状態｡失効・復活・現行の三つ｡失効だけ朱｡", en: "Where it stands now: lapsed, revived, or current. Lapsed is in red." },
  partName: { ja: "名前", en: "Name" },
  partNameText: { ja: "価値観の呼び名｡下に英名と読み｡", en: "What the value is called, with the English name and reading below." },
  partDates: { ja: "成立と失効", en: "Made and ended" },
  partDatesText: { ja: "成立の年と､失効の年｡c. は推定､NOW は現役｡", en: "The year made and the year ended. c. is an estimate, NOW means still current." },
  openCard: { ja: "OPEN", en: "OPEN" },
  evidenceNoteTail: { ja: "証拠の型は､カードを開いた先のページに書いてある｡", en: "The kind of evidence is on the card's own page." },
} as const;

export type UIKey = keyof typeof UI;

/** 画面の言葉を引く */
export function t(lang: Lang, key: UIKey): string {
  return UI[key][lang];
}
