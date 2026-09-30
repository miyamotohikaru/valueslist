/**
 * 年 → 0..1 の区分線形スケール｡
 * 古代〜近世を圧縮し､明治以降を広く取る（この図鑑の主戦場が近代だから）｡
 *
 * 左端は 500年｡科挙（598）・姥捨て（950）・纏足（1100）が入ったので､
 * 1200年で切ると3枚の帯が左端に貼り付いて1200年始まりに見えてしまう｡
 */
const STOPS: [number, number][] = [
  [500, 0],
  [1200, 0.07],
  [1600, 0.22],
  [1868, 0.4],
  [1945, 0.62],
  [2030, 1],
];

export const ERA_MIN = 500;
export const ERA_MAX = 2030;

export function scaleYear(year: number): number {
  const y = Math.min(ERA_MAX, Math.max(ERA_MIN, year));
  for (let i = 1; i < STOPS.length; i++) {
    const [y0, p0] = STOPS[i - 1];
    const [y1, p1] = STOPS[i];
    if (y <= y1) return p0 + ((y - y0) / (y1 - y0)) * (p1 - p0);
  }
  return 1;
}

export const ERAS: { from: number; to: number; ja: string; en: string }[] = [
  { from: 500, to: 1200, ja: "古代", en: "ANCIENT" },
  { from: 1200, to: 1600, ja: "中世", en: "MEDIEVAL" },
  { from: 1600, to: 1868, ja: "近世", en: "EDO" },
  { from: 1868, to: 1945, ja: "明治〜戦前", en: "MEIJI–" },
  { from: 1945, to: 1989, ja: "戦後", en: "POSTWAR" },
  { from: 1989, to: 2030, ja: "平成・令和", en: "HEISEI–" },
];

export function eraOf(year: number) {
  return ERAS.find((e) => year >= e.from && year < e.to) ?? ERAS[ERAS.length - 1];
}
