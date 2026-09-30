/**
 * カードを開いた先のページだけで使う言葉｡
 *
 * 共通の言葉は `ui.ts` の `UI` から `t()` で引く｡ここに置くのは足りないものだけ｡
 * カードの中身（名前・意味・ひとこと・本文・裏取りメモ・年の見出し）は
 * `data/values.en.json` の持ち物なので､ここには入れない（`data/i18n.ts` の `localize` が重ねる）｡
 * 傾向と証拠の型の言葉は `ui.about.ts` が持っているので､そちらを使う（二重に持たない）｡
 */
import { make, type Dict } from "./index";
import type { Lang } from "./lang";
import type { Category, ShelfMeta } from "@/data/types";

const D = {
  // 仕様表
  specTitle: { ja: "仕様", en: "Specification" },
  specMade: { ja: "成立", en: "Established" },
  specEnded: { ja: "失効", en: "Lapsed" },
  specState: { ja: "いまの状態", en: "State now" },
  specCurrent: { ja: "現役", en: "Still current" },
  specRestock: { ja: "復活", en: "Revived" },
  specEvidence: { ja: "証拠の型", en: "Kind of evidence" },

  // 存続期間の箱
  spanLegend: { ja: "続いていた期間", en: "In circulation" },
  spanEnded: { ja: "失効", en: "ended" },
  spanRestocked: { ja: "復活", en: "revived" },
  spanNow: { ja: "いま", en: "now" },

  // 日付の帳票
  stillInStock: { ja: "いまも現役", en: "Still in stock" },
  nothingFollows: { ja: "以下余白", en: "Nothing follows" },

  // 裏取りメモ
  factsToCome: { ja: "裏取りメモは準備中｡", en: "Fact check to come." },
  sourcesToCome: { ja: "出典は準備中｡", en: "Sources to come." },

  // グループの名前（shelves.ts の英語は判子用の大文字なので､画面にはこちらを出す）
  shelf1: { ja: "前近代成立・失効ゾーン", en: "Pre-modern, lapsed" },
  shelf2: { ja: "近代成立ゾーン", en: "Established in the modern age" },
  shelf3: { ja: "戦後成立・下落ゾーン", en: "Postwar, falling" },
  shelf4: { ja: "現役・上昇ゾーン", en: "Current, rising" },
  shelf5: { ja: "長距離復活ゾーン", en: "Revived" },
  shelfMeta: { ja: "メタ標本", en: "The counterfeit" },

  // 分類（categoryMeta の英語は判子用の大文字）
  catNorm: { ja: "規範", en: "Norm" },
  catLife: { ja: "人生観", en: "Life view" },
  catCriterion: { ja: "判断基準", en: "Criterion" },

  // 読み上げ用の名札
  ariaHitokoto: { ja: "ひとこと", en: "In one line" },
  ariaSpec: { ja: "仕様と証拠", en: "Spec and evidence" },
  ariaDates: { ja: "日付の根拠", en: "Where the dates come from" },
  ariaExtra: { ja: "補助の統計", en: "Further statistics" },
  ariaCard: { ja: "この標本のカード", en: "The card for this specimen" },
  ariaNav: { ja: "前後の標本", en: "Previous and next" },
  ariaMadeYear: { ja: "成立年", en: "Year made" },

  // メタ標本
  ariaMeta: { ja: "メタ標本", en: "Meta specimen" },
  fakeVintage: { ja: "偽ヴィンテージ", en: "FAKE VINTAGE" },
  metaLeadA: { ja: "｢伝統｣にも､", en: "Even a “tradition”" },
  metaLeadB: { ja: "成立年がある｡", en: "has a year it was made." },
  seeSpecimen: { ja: "標本を見る", en: "See the specimen" },
} satisfies Dict;

export const tValue = make(D);

const SHELF_KEY = {
  "1": "shelf1",
  "2": "shelf2",
  "3": "shelf3",
  "4": "shelf4",
  "5": "shelf5",
  meta: "shelfMeta",
} as const;

/** グループの名前 */
export function shelfName(lang: Lang, shelf: ShelfMeta): string {
  if (lang === "ja") return shelf.name;
  return tValue(lang, SHELF_KEY[String(shelf.id) as keyof typeof SHELF_KEY]);
}

const CAT_KEY = { 規範: "catNorm", 人生観: "catLife", 判断基準: "catCriterion" } as const;

/** 分類の名前｡日本語はデータの語をそのまま出す */
export function categoryName(lang: Lang, c: Category): string {
  if (lang === "ja") return c;
  return tValue(lang, CAT_KEY[c]);
}

/** 復活のときの新しい名前｡｢（〜 として）｣ */
export function asName(lang: Lang, as: string): string {
  return lang === "ja" ? `（${as} として）` : `(as ${as})`;
}

/** 帳票の見出し｡2行に割って返す */
export function datedByLines(lang: Lang, name: string): [string, string] {
  if (lang === "ja") return [`${name}の日付は､`, "この文書で決まる｡"];
  return [`The dates for ${name}`, "are set by this document."];
}
