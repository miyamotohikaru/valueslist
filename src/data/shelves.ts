import type { ShelfMeta, Trend, Category, Evidence } from "./types";

export const shelves: ShelfMeta[] = [
  {
    id: 1,
    no: "1",
    name: "前近代製・廃番ゾーン",
    en: "PRE-MODERN / DISCONTINUED",
    lead: "中世・近世に生まれた価値観｡◇法令の日付で廃番になったものと､◇別の名前で再入荷したものがある｡",
    evidenceNote: "証拠＝法令・制度の廃止日｡",
  },
  {
    id: 2,
    no: "2",
    name: "明治製造ゾーン",
    en: "MADE IN MEIJI",
    lead: "人間の本性に見えて､◇じつは明治・大正に製造された価値観｡◇この店の奥の間｡",
    evidenceNote: "証拠＝翻訳語の初出・法令の施行日｡",
  },
  {
    id: 3,
    no: "3",
    name: "戦後製造・下落ゾーン",
    en: "POSTWAR / FALLING",
    lead: "高度成長期に標準装備になった価値観｡◇下がったものと､◇意外に下がっていないものがある｡",
    evidenceNote: "証拠＝世論調査・統計の推移（カーブ）｡",
  },
  {
    id: 4,
    no: "4",
    name: "現役・上昇ゾーン",
    en: "CURRENT / RISING",
    lead: "製造年が流行語・書籍・政策文書で､◇日付まで特定できる｡◇いちばん新しい在庫｡",
    evidenceNote: "証拠＝初出の記録◆（流行語大賞・答申・書籍）｡",
  },
  {
    id: 5,
    no: "5",
    name: "長距離再入荷ゾーン",
    en: "BACK IN STOCK",
    lead: "古い在庫が､◇別の名前で棚に戻ってきたもの｡◇元の商品と再入荷品を､◆1枚の半券で結ぶ｡",
    evidenceNote: "証拠＝元の商品の日付と､再入荷品の初出｡",
    virtual: true,
  },
  {
    id: "meta",
    no: "M",
    name: "メタ標本",
    en: "COUNTERFEIT",
    lead: "｢江戸の伝統｣として製造された､◇本物の偽物｡",
    evidenceNote: "証拠＝偽史検証｡",
  },
];

export const shelfById = (id: ShelfMeta["id"]) => shelves.find((s) => s.id === id)!;

export const trendMeta: Record<Trend, { mark: string; ja: string; en: string; tone: string }> = {
  up: { mark: "↑", ja: "上昇", en: "RISING", tone: "teal" },
  steady: { mark: "→", ja: "安定", en: "STEADY", tone: "navy" },
  down: { mark: "↘", ja: "下落", en: "FALLING", tone: "mustard" },
  discontinued: { mark: "×", ja: "廃番", en: "DISCONTINUED", tone: "red" },
  restocked: { mark: "↻", ja: "再入荷", en: "RESTOCKED", tone: "red" },
};

export const categoryMeta: Record<Category, { en: string }> = {
  規範: { en: "NORM" },
  人生観: { en: "LIFE VIEW" },
  判断基準: { en: "CRITERION" },
};

export const evidenceMeta: Record<Evidence, { ja: string; en: string }> = {
  law: { ja: "法令・初出型", en: "DATED BY DOCUMENT" },
  curve: { ja: "カーブ型", en: "DATED BY CURVE" },
};
