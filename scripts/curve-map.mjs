/**
 * カード名（掲載名）→ グラフの組み立て方。
 *
 * - key:      research/datasets.json のデータセット（一次資料から取った全年次）
 * - series:   使う系列名
 * - research: true なら research/*.json の curve（研究担当が取得した点）を使う
 * - kind:     "bar"（年ごとの件数）/ 省略時 "line"
 * - marks:    図に立てる注記。本文・裏取りメモで裏づけのある出来事だけを置く
 * - extra:    補助の図（詳細ページで主の図の下に並べる）
 * - trimFrom: この年以降を落とす（国会会議録は直近年の収録が遅れるため）
 */

const KOKKAI_NOTE =
  "国会会議録検索システムで、その語を含む発言の数を年ごとに数えたもの。直近年は会議録の収録が遅れるため2024年までを載せる。";

export const CURVE_MAP = {
  兼業が当たり前: {
    research: true,
    marks: [
      { year: 1959, text: "雇用者が過半に" },
      { year: 2018, text: "副業ガイドライン" },
    ],
  },
  "純潔・処女性": { research: true },
  勤勉こそ美徳: { research: true },

  終身雇用: {
    key: "D12_lifetime_employment_support",
    series: ["終身雇用を支持", "年功賃金を支持"],
    extra: [{ key: "D13_new_employee_lifetime_intention", series: ["今の会社に一生勤めようと思っている"] }],
  },
  年功序列: {
    research: true,
    extra: [{ key: "D12_lifetime_employment_support", series: ["年功賃金を支持", "終身雇用を支持"] }],
  },
  "夫は外で働き、妻は家庭を守る": {
    key: "D1_gender_role",
    series: ["賛成計", "反対計"],
    marks: [{ year: 2022, text: "郵送法に変更", break: true }],
    extra: [
      {
        key: "D3_households",
        series: ["専業主婦世帯", "共働き世帯"],
        marks: [
          { year: 1992, text: "共働きが初めて上回る" },
          { year: 1997, text: "以後は共働きが多い" },
        ],
      },
    ],
  },
  見合い結婚: {
    key: "D2_marriage_type",
    series: ["見合い結婚", "恋愛結婚", "ネット（SNS・アプリ等）で"],
    marks: [{ year: 1967, text: "恋愛が見合いを上回る" }],
  },
  恋愛結婚こそ本物: {
    key: "D2_marriage_type",
    series: ["恋愛結婚", "ネット（SNS・アプリ等）で"],
    extra: [{ research: true }],
  },
  寿退社: { research: true },
  石の上にも三年: {
    key: "D5_univ_turnover3y",
    series: ["大卒3年以内離職率"],
    extra: [{ key: "D5_job_changers", series: ["転職者数"] }],
  },
  "根性・気合": {
    key: "D4_kokkai_根性",
    series: ["発言数"],
    kind: "bar",
    trimFrom: 2025,
    marks: [
      { year: 1964, text: "東京五輪" },
      { year: 2012, text: "桜宮高校事件" },
    ],
  },
  飲みニケーション: {
    research: true,
    marks: [{ year: 2020, text: "設問を4択に変更", break: true }],
  },
  持ち家こそ一人前: {
    research: true,
    seriesName: "土地は有利な資産だと思う",
    extraSeries: { key: "D8_homeownership", series: ["持ち家率"] },
    title: "「土地は預貯金や株式より有利な資産だ」と思う人と、持ち家率",
    marks: [{ year: 2020, text: "意識調査が郵送法に", break: true }],
  },
  自己責任: {
    key: "D4_kokkai_自己責任",
    series: ["発言数"],
    kind: "bar",
    trimFrom: 2025,
    marks: [
      { year: 1991, text: "損失補填問題" },
      { year: 2004, text: "イラク人質事件" },
    ],
  },
  "ワーク・ライフ・バランス": {
    key: "D4_kokkai_ワーク・ライフ・バランス",
    series: ["発言数"],
    kind: "bar",
    trimFrom: 2025,
    marks: [{ year: 2007, text: "憲章の策定" }],
  },
  多様性: {
    key: "D4_kokkai_多様性",
    series: ["発言数"],
    kind: "bar",
    trimFrom: 2025,
    note: "「生物多様性」を含む発言も数に入っている。",
    marks: [
      { year: 2010, text: "生物多様性（COP10）" },
      { year: 2015, text: "渋谷区の条例" },
      { year: 2023, text: "理解増進法" },
    ],
  },
  絆: {
    key: "D4_kokkai_絆",
    series: ["発言数"],
    kind: "bar",
    trimFrom: 2025,
    note: "「羈絆」「脚絆」を含む発言も数に入っている。",
    marks: [{ year: 2011, text: "東日本大震災" }],
  },
  学歴がすべて: {
    key: "D9_university_enrollment",
    series: ["大学（学部）進学率"],
    note: "文部科学省が2025年12月に算定式を改め、過去にさかのぼって集計し直した値。",
  },
  サステナブル: { research: true },
  リスキリング: {
    key: "D4_kokkai_リスキリング",
    series: ["発言数"],
    kind: "bar",
    trimFrom: 2025,
    marks: [{ year: 2022, text: "所信表明" }],
  },
};

export { KOKKAI_NOTE };
