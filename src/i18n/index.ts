/**
 * 言葉の引き方をここに集める｡
 *
 * 画面ごとの言葉は area ごとのファイル（ui.index.ts / ui.timeline.ts …）に分けて置く｡
 * どのファイルも `{ キー: { ja, en } }` という同じ形にしておく｡
 */
export type { Lang } from "./lang";
export { LANGS, path, langOf, stripLang } from "./lang";
export { UI, t } from "./ui";

import type { Lang } from "./lang";

export type Dict = Record<string, { ja: string; en: string }>;

/** その辞書から言葉を引く小さな関数を作る */
export function make<D extends Dict>(dict: D) {
  return (lang: Lang, key: keyof D) => dict[key][lang];
}
