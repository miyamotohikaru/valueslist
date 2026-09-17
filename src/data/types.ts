export type Trend = "up" | "steady" | "down" | "discontinued" | "restocked";
export type Category = "規範" | "人生観" | "判断基準";
export type Evidence = "law" | "curve";
export type ShelfId = 1 | 2 | 3 | 4 | 5 | "meta";

export type DatePoint = {
  label: string; // 表示用（例: "1873 復讐禁止令"）
  year: number; // 数値年（概算可）
  approx?: boolean;
  fact?: string; // 何をもってその年とするか
  source?: string;
  as?: string; // 再入荷のときの新しい名前
};

export type KeyFact = { text: string; source?: string };

export type Series = { name: string; points: [number, number][] };

export type Curve = {
  kind?: "line" | "bar"; // 省略時は line｡年ごとの件数など密なデータは bar
  /** 見出し｡◆ は携帯だけの改行 */
  title: string;
  /** 小見出し（見出しの括弧書き・定義）｡◆◇ の改行記号を含むことがある */
  subtitle?: string;
  unit: string;
  source: string;
  note?: string;
  series: Series[];
  /**
   * 図に打つ注記（年 → 短い文）｡
   * break: true のとき､その年の前で線を切って点線でつなぐ（調査方法の変更などで前後を比べられない）
   */
  marks?: { year: number; text: string; break?: boolean }[];
};

export type Value = {
  no: string; // "001"
  name: string;
  reading: string;
  en: string;
  category: Category;
  shelf: ShelfId;
  evidence: Evidence;
  trend: Trend;
  made: DatePoint | null;
  discontinued: DatePoint | null;
  restocked: DatePoint | null;
  hitokoto: string;
  body: string[];
  keyfacts: KeyFact[];
  curve?: Curve | null;
  /** 補助の図（詳細ページで主の証拠の下に並べる） */
  extraCurves?: Curve[];
  lineageId?: string;
  sources: string[];
  confidence: "A" | "B" | "C";
};

export type ShelfMeta = {
  id: ShelfId;
  no: string; // "1"〜"5" / "M"
  name: string;
  en: string;
  lead: string;
  evidenceNote: string;
  /** カードを持たない棚（第5棚＝再入荷ペアの陳列）｡絞り込みには出さない */
  virtual?: boolean;
};
