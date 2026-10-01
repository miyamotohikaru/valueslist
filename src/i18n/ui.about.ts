/**
 * 読み方のページ（と 404 の札）だけで使う言葉｡
 *
 * 共通の言葉は `ui.ts` の `UI` から `t()` で引く｡ここに置くのは足りないものだけ｡
 * グループの説明（`data/shelves.ts` の lead と evidenceNote）と傾向・証拠の和名には
 * 英訳が無いので､データ側は触らず､ここで英語だけを持って表示のときに差し替える｡
 * グループの名前だけは `ui.value.ts` の `shelfName` が持っているので､そちらを使う｡
 *
 * 英語の ◇（パソコンでも改行）・◆（携帯だけ改行）は､和文と同じ数ではなく
 * 意味の切れ目に置き直してある｡
 */
import { make, type Dict } from "./index";
import type { Lang } from "./lang";
import type { Evidence, ShelfMeta, Trend } from "@/data/types";

const D = {
  // 見出し
  heroEn1: { ja: "HOW TO READ", en: "NOTATION" },
  heroEn2: { ja: "THIS CATALOG", en: "& SYMBOLS" },
  heroLead: { ja: "並んだカードを､どう読むか｡", en: "How to read the cards in the groups." },
  heroSub: {
    ja: "カードの部位､証拠の二種､傾向の印､グループの分け方｡",
    en: "The parts of a card, the two kinds of evidence, the trend stamps, and how the groups are split.",
  },

  // 節の見出し（和文）｡02 は共通辞書の anatomy を使うのでここには無い
  secWhat: { ja: "この図鑑は何か", en: "What this catalogue is" },
  secEvidence: { ja: "証拠の二種", en: "Two kinds of evidence" },
  secTrend: { ja: "傾向の印", en: "Trend stamps" },
  secShelves: { ja: "グループ", en: "The groups" },
  secSources: { ja: "出典の方針", en: "Sourcing policy" },

  // 節の見出しの下の赤い英字｡英語のときは見出しと重ならない字に替える
  secWhatEn: { ja: "WHAT THIS CATALOG IS", en: "THE PREMISE" },
  secCardEn: { ja: "ANATOMY OF A CARD", en: "PART BY PART" },
  secEvidenceEn: { ja: "TWO KINDS OF EVIDENCE", en: "POINT AND LINE" },
  secTrendEn: { ja: "TREND STAMPS", en: "FIVE STAMPS" },
  secShelvesEn: { ja: "THE GROUPS", en: "GROUP BY GROUP" },
  secSourcesEn: { ja: "SOURCING POLICY", en: "WHAT WE CITE" },

  // 01 この図鑑は何か
  whatBody: {
    ja: "この図鑑は､日本と世界の価値観(規範・人生観・判断基準)を､成立年・失効年・復活年を出典にあたって特定し､カードにしたものだ｡｢昔からの伝統｣に見えるものほど成立年が新しく､｢新品｣に見えるものが中世のものの再出荷だったりする｡それを年代順に並べて､目で見えるようにするのが目的である｡",
    en: "This catalogue takes values from Japan and from around the world — norms, life views, criteria for judgement — and puts each on a card, with the year it was made, the year it was ended and the year it came back, every date checked against a source. The ones that look like ancient tradition turn out to be the newest; the ones that look brand new are often medieval, come back under another name. Setting them out by year is what makes that visible.",
  },
  threeYears: { ja: "三つの年", en: "Three years" },
  dateMade: { ja: "成立年", en: "Established" },
  dateMadeText: { ja: "普及した時期", en: "when it spread" },
  dateDisc: { ja: "失効年", en: "Lapsed" },
  dateDiscText: { ja: "制度として終わった日付", en: "the day the rule ended" },
  dateRestock: { ja: "復活", en: "Revived" },
  dateRestockText: { ja: "別の名前での復活", en: "under another name" },

  // 02 カードの読み方
  // 共通辞書の evidenceNoteTail には携帯の改行（◆）が無いので､解剖図の分はこちらで持つ
  anatomyTail: {
    ja: "証拠の型は､◆カードを開いた先のページに書いてある｡",
    en: "The kind of evidence is written ◆on the card's own page.",
  },
  spanStripTitle: { ja: "項目ページの年表", en: "The strip on a card's page" },
  sampleHead: { ja: "例: NO.{no} {name}｡", en: "e.g. NO.{no} {name}." },
  // 英語は｢近世｣を言葉で書く（データの和名を訳す口が無いため）
  sampleMade: { ja: "{made}に成立､{end}年に失効､", en: "Made in the Edo period, ended {end}," },
  sampleRestock: { ja: "{year}年に｢{as}｣として復活｡", en: "revived {year} as “{as}”." },
  glyphHatch: { ja: "斜線は､成立年が概算のとき｡", en: "Hatching means the year made is an estimate." },
  glyphBar: { ja: "太い帯は､成立から失効までの期間｡", en: "The thick bar runs from made to ended." },
  glyphNow: { ja: "矢印で終わる帯は､いまも現役｡", en: "A bar ending in an arrow is still current." },
  glyphX: { ja: "赤い×は､失効の年｡", en: "The red × is the year it ended." },
  glyphTail: { ja: "×の先の点線は､制度の廃止後も残るもの｡", en: "A dotted line past the × outlives the rule." },
  glyphDot: { ja: "赤い点は､復活の年｡", en: "The red dot is the year it came back." },

  // 03 証拠の二種
  evidenceLead: {
    ja: "年を特定する方法は､二つある｡どちらで特定したかは､◆各項目のページに書いてある｡",
    en: "There are two ways to fix a year. Which one was used is ◆written on each card's own page.",
  },
  evLawName: { ja: "法令・初出型", en: "By document" },
  evCurveName: { ja: "カーブ型", en: "By curve" },
  evLawHead: { ja: "｢点｣で語る", en: "Told as a point" },
  evLawLead: {
    ja: "禁止令の日付､翻訳語の初出､◆制度の廃止年｡年月日まで特定できる一点で､◆成立か失効の年を決める｡",
    en: "The date of a ban, the first use of a translated word, ◆the year a rule was abolished. One point you can date to the day ◆fixes the year made or ended.",
  },
  evLawNote: { ja: "太政官布告第37号(復讐禁止令)", en: "Daijokan Decree No.37 (revenge banned)" },
  evCurveHead: { ja: "｢線｣で語る", en: "Told as a line" },
  evCurveLead: {
    ja: "世論調査の賛成率､統計の推移｡実際の数値を結んだ線で､◆上昇か下落かを決める｡",
    en: "Approval in opinion polls, the drift of statistics. A line drawn through the real figures ◆says rising or falling.",
  },
  evCurveNote: {
    ja: "賛成の計 1979 → 2024◆〔総理府・内閣府の世論調査〕｡◇2022年から郵送調査に変わったため､◆前後は単純に比べられない｡",
    en: "Approval, total, 1979 → 2024 ◆(Prime Minister's Office and Cabinet Office polls).◇The survey moved to post in 2022, ◆so the two sides do not compare directly.",
  },

  // 04 傾向の印
  trendUp: { ja: "上昇", en: "Rising" },
  trendSteady: { ja: "安定", en: "Steady" },
  trendDown: { ja: "下落", en: "Falling" },
  trendDiscontinued: { ja: "失効", en: "Lapsed" },
  trendRestocked: { ja: "復活", en: "Revived" },
  trendUpNote: {
    ja: "使用頻度や賛成率が上がっている｡成立年の新しいものに多い｡",
    en: "Use or approval is going up. Common among the newer ones.",
  },
  trendSteadyNote: { ja: "大きな増減がなく､現役のまま残っている｡", en: "No big swing either way, still in use." },
  trendDownNote: { ja: "現役だが､賛成率や使用頻度が下がっている｡", en: "Still in use, but approval or use is falling." },
  trendDiscontinuedNote: { ja: "制度や語として終わった｡失効の日付がある｡", en: "Over, as a rule or as a word. It has an end date." },
  trendRestockedNote: { ja: "別の名前で復活した｡印は､元のカードに押す｡", en: "Back under another name. The stamp goes on the original card." },

  // 05 グループ
  shelvesLead: {
    ja: "成立年と､いまの状態でグループを分けている｡グループの名前を押すと､索引のそのグループへ飛ぶ｡",
    en: "The groups are split by the year made and where the value stands now. The name takes you to that group in the catalogue.",
  },
  shelfStubOnly: { ja: "半券だけのグループ", en: "No cards, only stubs" },

  shelf1Lead: {
    ja: "中世・近世に生まれた価値観｡◇法令の日付で失効になったものと､◇別の名前で復活したものがある｡",
    en: "Values born in medieval and Edo Japan.◇Some were ended on the date of a law,◇some came back under another name.",
  },
  shelf1Note: { ja: "証拠＝法令・制度の廃止日｡", en: "Evidence = the day a law or rule was abolished." },

  shelf2Lead: {
    ja: "人間の本性に見えて､◇じつは明治・大正に成立された価値観｡",
    en: "Looks like human nature.◇Actually made in Meiji or Taisho.",
  },
  shelf2Note: { ja: "証拠＝翻訳語の初出・法令の施行日｡", en: "Evidence = the first use of a translated word, or the day a law took effect." },

  shelf3Lead: {
    ja: "高度成長期に標準装備になった価値観｡◇下がったものと､◇意外に下がっていないものがある｡",
    en: "Standard equipment from the boom years.◇Some have fallen,◇some have barely moved.",
  },
  shelf3Note: { ja: "証拠＝世論調査・統計の推移(カーブ)｡", en: "Evidence = the curve of polls and statistics." },

  shelf4Lead: {
    ja: "成立年が流行語・書籍・政策文書で､◇日付まで特定できる｡◇いちばん新しいもの｡",
    en: "Made on a date you can name:◇a buzzword, a book, a policy paper.◇The newest stock here.",
  },
  shelf4Note: { ja: "証拠＝初出の記録◆(流行語大賞・答申・書籍)｡", en: "Evidence = the record of first use ◆(buzzword award, report, book)." },

  shelf5Lead: {
    ja: "古いものが､◇別の名前でグループに戻ってきたもの｡◇元のものと復活したものを､◆1枚の半券で結ぶ｡",
    en: "Old stock that came back to the shelves◇under a new name.◇The original and the reissue, ◆tied by one stub.",
  },
  shelf5Note: { ja: "証拠＝元のものの日付と､復活したものの初出｡", en: "Evidence = the original's date, and the reissue's first use." },

  shelfMetaLead: { ja: "｢江戸の伝統｣として成立された､◇本物の偽物｡", en: "Made and sold as “Edo tradition”:◇a genuine fake." },
  shelfMetaNote: { ja: "証拠＝偽史検証｡", en: "Evidence = pseudo-history, debunked." },

  // 06 出典の方針
  srcLaw: { ja: "法令", en: "Law" },
  srcLawText: { ja: "公布日と､布告・法律番号", en: "Date promulgated, with the decree or law number" },
  srcStats: { ja: "統計", en: "Statistics" },
  srcStatsText: { ja: "調査名と､調査の年", en: "Name of the survey, and its year" },
  srcBooks: { ja: "書籍", en: "Books" },
  srcBooksText: { ja: "著者・書名・刊行年", en: "Author, title, year" },
  srcWeb: { ja: "ウェブ", en: "Web" },
  srcWebText: { ja: "サイト名と､URL", en: "Site name, and URL" },

  // 索引へ戻る帯
  toIndex: { ja: "索引へ", en: "To the catalogue" },

  // 404（品切れ札）
  nfTag: { ja: "品切れ札", en: "Out-of-stock tag" },
  nfTitle1: { ja: "この型番のカードは", en: "No card carries" },
  nfTitle2: { ja: "ありません", en: "that number" },
  nfBody: {
    ja: "お探しの型番は､この一覧にない｡失効ではなく､成立の記録がない｡型番を確かめるか､索引から探してほしい｡",
    en: "The number you asked for is not in this list. It did not lapse — it was never established. Check the number, or look through the catalogue.",
  },
  nfBack: { ja: "索引へ戻る", en: "Back to the catalogue" },
} satisfies Dict;

export type AboutKey = keyof typeof D;

export const tAbout = make(D);

/** 辞書の {name} を置き換える */
export function fill(s: string, vars: Record<string, string | number | undefined>): string {
  return s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] == null ? m : String(vars[k])));
}

/** グループの通し名（1〜5 と meta）｡キーの頭に付ける文字を作る */
const shelfKey = (id: ShelfMeta["id"]) => (id === "meta" ? "shelfMeta" : `shelf${id}`);

/** グループの説明｡◇◆ の位置は英語で置き直してある */
export function shelfLead(lang: Lang, shelf: ShelfMeta) {
  return tAbout(lang, `${shelfKey(shelf.id)}Lead` as AboutKey);
}

/** グループの証拠の注記 */
export function shelfNote(lang: Lang, shelf: ShelfMeta) {
  return tAbout(lang, `${shelfKey(shelf.id)}Note` as AboutKey);
}

const TREND_KEY: Record<Trend, AboutKey> = {
  up: "trendUp",
  steady: "trendSteady",
  down: "trendDown",
  discontinued: "trendDiscontinued",
  restocked: "trendRestocked",
};

/** 傾向の和名にあたる言葉｡ja は trendMeta.ja と同じ字 */
export function trendName(lang: Lang, trend: Trend) {
  return tAbout(lang, TREND_KEY[trend]);
}

/** 傾向の説明（読み方のページの表） */
export function trendNote(lang: Lang, trend: Trend) {
  return tAbout(lang, `${TREND_KEY[trend]}Note` as AboutKey);
}

/** 証拠の型の和名にあたる言葉｡ja は evidenceMeta.ja と同じ字 */
export function evidenceName(lang: Lang, ev: Evidence) {
  return tAbout(lang, ev === "law" ? "evLawName" : "evCurveName");
}
