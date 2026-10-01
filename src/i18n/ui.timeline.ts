/**
 * 年表のページだけで使う言葉｡
 * 共通の言葉は ui.ts の UI にあるので､ここには足りないぶんだけ置く｡
 */
import { make, type Dict } from "./index";
import type { Lang } from "./lang";

const D = {
  // 時代の名前｡キーは timescale.ts の ERAS の from の年
  era500: { ja: "古代", en: "Ancient" },
  era1200: { ja: "中世", en: "Medieval" },
  era1600: { ja: "近世", en: "Edo" },
  era1868: { ja: "明治〜戦前", en: "Meiji–prewar" },
  era1945: { ja: "戦後", en: "Postwar" },
  era1989: { ja: "平成・令和", en: "Heisei–Reiwa" },

  // 時間軸のヘッダーは帯の幅が狭い｡携帯だと英語がはみ出すので､そこだけ短くする
  eraAxis500: { ja: "古代", en: "Ancient" },
  eraAxis1200: { ja: "中世", en: "Medieval" },
  eraAxis1600: { ja: "近世", en: "Edo" },
  eraAxis1868: { ja: "明治〜戦前", en: "Meiji–prewar" },
  eraAxis1945: { ja: "戦後", en: "Postwar" },
  eraAxis1989: { ja: "平成・令和", en: "Heisei" },

  // 物差し
  rulerAria: { ja: "この年表の物差し", en: "The scale of this timeline" },
  rulerSqueeze: { ja: "1368年を､ここに縮めている", en: "1,368 years, squeezed in here" },
  rulerWide: { ja: "明治からの162年を広く", en: "162 years since Meiji, spread wide" },
  rulerNote: {
    ja: "目盛りの間隔は均等ではない｡この物差しで全部を並べる｡",
    en: "The ticks are not evenly spaced. Everything sits on this one scale.",
  },

  // 帯の吹き出し（{n} は年や名前が入る）
  tipMade: { ja: "成立", en: "Established" },
  ringAria: { ja: "{n}年の円環", en: "A {n}-year loop" },
  thumbAria: { ja: "{n} のカードへ", en: "Open the card for {n}" },
} satisfies Dict;

export type TimelineKey = keyof typeof D;

export const tTimeline = make(D);

/**
 * 時代の名前｡ja は timescale.ts の ja をそのまま出し､en だけ辞書から引く｡
 * （timescale.ts は触らない約束なので､こちら側で受ける）
 *
 * where が "axis" のときは時間軸のヘッダー用の短い名前｡ja は同じ字なので変わらない｡
 */
export function eraName(
  lang: Lang,
  era: { from: number; ja: string },
  where: "full" | "axis" = "full",
) {
  const key = (where === "axis" ? `eraAxis${era.from}` : `era${era.from}`) as TimelineKey;
  return key in D ? tTimeline(lang, key) : era.ja;
}

/** 辞書の {n} を置き換える */
export function fill(s: string, n: string | number) {
  return s.replace("{n}", String(n));
}
