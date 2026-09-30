import type { Value } from "./types";
import { values } from "./values";

/**
 * 系譜｡node.ref は values の name（掲載名）を指す｡カードのない出来事は ref なしで置く｡
 * すべての年と出来事は､各カードの本文・裏取りメモ（research/）で裏づけのあるものに限る｡
 */
export type LineageNode = {
  ref?: string;
  label: string;
  year?: number;
  yearLabel?: string;
  note?: string;
};

/**
 * - restock: 失効・下落のあと､別の名前で戻ってきたもの（最後の層に REVIVED の札）
 * - relabel: 同じ対象に､社会が別の名札を付け替えてきたもの
 * - theme:   親子関係ではなく､同じグループで入れ替わってきたものを年代順に並べたもの
 */
export type LineageKind = "restock" | "relabel" | "theme";

export type Lineage = {
  id: string;
  kind: LineageKind;
  title: string;
  en: string;
  lead: string;
  span: string;
  spanLabel: string;
  nodes: LineageNode[];
};

export const lineageKindMeta: Record<LineageKind, { ja: string; en: string }> = {
  restock: { ja: "復活", en: "REVIVED" },
  relabel: { ja: "名札の付け替え", en: "RELABELED" },
  theme: { ja: "主題の並び", en: "SAME SHELF" },
};

export const lineages: Lineage[] = [
  {
    id: "umare",
    kind: "restock",
    title: "生まれで決まる → 立身出世 → 自己責任 → 親ガチャ",
    en: "The 150-Year Loop",
    lead: "近世の身分は生まれで決まった｡明治の布告が武士の特権を外し､学制は学問で身を立てよと説いた｡2004年には｢自己責任｣が人質に向けられ､2021年に｢親ガチャ｣が流行語トップテンに入った｡年代順に並べると､生まれを否定した150年が､生まれを嘆く言葉に戻ってくる｡",
    span: "150年",
    spanLabel: "身分解体の布告から流行語まで",
    nodes: [
      { ref: "生まれで決まる", label: "生まれで決まる", year: 1700, yearLabel: "近世", note: "禄高と役職を分限帳に記した｡" },
      { ref: "立身出世", label: "立身出世", year: 1872, yearLabel: "1872 学制", note: "｢学問は身を立るの財本｣" },
      { ref: "自己責任", label: "自己責任", year: 2004, yearLabel: "2004", note: "イラク人質事件で一般語になる｡" },
      { ref: "親ガチャ", label: "親ガチャ", year: 2021, yearLabel: "2021 流行語", note: "生まれを確率の言葉で語る｡" },
    ],
  },
  {
    id: "inkyo",
    kind: "restock",
    title: "隠居 → FIRE",
    en: "Retire Early, Twice",
    lead: "隠居は近世の標準的な人生設計だった｡明治民法は､原則60歳以上を要件とする法律行為として定めた｡1948年に条文ごと消え､退き時は定年制が決めるようになった｡2020年､米国生まれの頭字語として帰ってきた｡",
    span: "72年",
    spanLabel: "隠居の条文が消えてから",
    nodes: [
      { ref: "隠居", label: "隠居", year: 1700, yearLabel: "近世", note: "家督を譲り､家産で暮らす｡" },
      { label: "隠居の条文が消える", year: 1948, yearLabel: "1948 改正民法", note: "家制度とともに廃止された｡" },
      { label: "定年制が標準に", year: 1968, yearLabel: "1968 69.0%", note: "定年制を持つ企業の割合｡2022年は94.4%｡" },
      { ref: "FIRE", label: "FIRE", year: 2020, yearLabel: "2020 邦訳", note: "Financial Independence, Retire Early" },
    ],
  },
  {
    id: "shudo",
    kind: "relabel",
    title: "衆道 → 多様性",
    en: "Relabeled, Again and Again",
    lead: "同性間の関係の扱いを､社会は何度も別の名札で書き換えてきた｡近世の衆道は年長の男性と少年の関係として公然と語られ､明治のはじめには鶏姦が処罰の対象になり､大正には｢変態｣と呼ばれた｡米国精神医学会が1973年､WHOが1990年に同性愛を病名から外し､2015年には自治体が同性カップルに証明書を出した｡",
    span: "142年",
    spanLabel: "処罰の条文から証明書まで",
    nodes: [
      { ref: "衆道", label: "衆道", year: 1687, yearLabel: "1687 男色大鑑", note: "年長の男性と少年の関係として語られた｡" },
      { label: "鶏姦の処罰", year: 1873, yearLabel: "1873 改定律例", note: "懲役九十日｡1882年の旧刑法で消える｡" },
      { label: "病理化", year: 1915, yearLabel: "1915 変態性欲論", note: "通俗性欲学が｢変態｣として語る｡" },
      { label: "病名から外れる", year: 1973, yearLabel: "1973 APA", note: "1990年にはWHOも外した｡" },
      { ref: "多様性", label: "多様性", year: 2015, yearLabel: "2015 渋谷区", note: "パートナーシップ証明｡2023年に理解増進法｡" },
    ],
  },
  {
    id: "kekkon",
    kind: "theme",
    title: "恋愛 → 見合い結婚 → 恋愛結婚こそ本物 → 婚活",
    en: "Love, Imported",
    lead: "｢恋愛｣の日本語での初出例は1870年の翻訳書である｡1930年代に結婚した夫婦の7割は見合いで､恋愛結婚が上回るのは1965〜69年の結婚からだった｡2000年代に9割近くまで増えた恋愛結婚は､2019〜21年の結婚では､｢ネットで｣知り合った夫婦に追い上げられている｡",
    span: "約150年",
    spanLabel: "翻訳語からネットの出会いまで",
    nodes: [
      { ref: "恋愛", label: "恋愛", year: 1870, yearLabel: "1870 西国立志編", note: "love の翻訳語として現れる｡" },
      { ref: "見合い結婚", label: "見合い結婚", year: 1935, yearLabel: "1930年代 69.0%", note: "結婚した夫婦の7割が見合い｡" },
      { ref: "恋愛結婚こそ本物", label: "恋愛結婚こそ本物", year: 1967, yearLabel: "1965〜69 逆転", note: "2005〜09年の結婚で88.0%｡" },
      { ref: "婚活", label: "婚活", year: 2007, yearLabel: "2007 AERA", note: "結婚は｢活動｣になる｡" },
      { label: "ネットで知り合う", year: 2020, yearLabel: "2019〜21 15.2%", note: "見合い結婚の9.9%を上回る｡" },
    ],
  },
  {
    id: "mottainai",
    kind: "restock",
    title: "もったいない → MOTTAINAI",
    en: "Restocked Twice",
    lead: "鎌倉期の『宇治拾遺物語』で､｢不届き｣の意味に使われた語は､14世紀の『太平記』では物を惜しむ意味でも使われている｡2005年に､ケニアの環境活動家が国連で世界に広めようと提案し､2019年には､食べ物を無駄にしない意識の醸成をうたう､食品ロス削減推進法が施行された｡",
    span: "約780年",
    spanLabel: "宇治拾遺物語から国連演説まで",
    nodes: [
      { ref: "もったいない", label: "もったいない", year: 1221, yearLabel: "1221頃 宇治拾遺物語", note: "｢もったいなき主かな｣＝不届きな主だ｡" },
      { label: "MOTTAINAI", year: 2005, yearLabel: "2005 国連演説", note: "ワンガリ・マータイが提案した｡" },
      { label: "食品ロス削減推進法", year: 2019, yearLabel: "2019 施行", note: "食べ物を無駄にしない意識の醸成をうたう｡" },
    ],
  },
  {
    id: "mujo",
    kind: "restock",
    title: "無常観 → マインドフルネス",
    en: "Meditation, Reimported",
    lead: "無常を観じる瞑想は仏教の核にある｡1979年に米国の医学部で医療プログラムになり､2007年にGoogleの社内研修になり､2016年には､NHKスペシャルがストレス対処法として取り上げた｡中世文学の無常観の直系ではなく､同じ仏教のものが米国を回って戻ったものである｡",
    span: "804年",
    spanLabel: "方丈記から放送まで",
    nodes: [
      { ref: "無常観", label: "無常観", year: 1212, yearLabel: "1212 方丈記", note: "ゆく河の流れは絶えずして｡" },
      { label: "MBSR", year: 1979, yearLabel: "1979 米国", note: "マサチューセッツ大学の医療プログラム｡" },
      { label: "Search Inside Yourself", year: 2007, yearLabel: "2007 Google", note: "社内研修として開発された｡" },
      { label: "キラーストレス", year: 2016, yearLabel: "2016 NHK", note: "ストレス対処法として取り上げた｡" },
    ],
  },
  {
    id: "hataraku",
    kind: "theme",
    title: "勤勉こそ美徳 → 根性・気合 → 24時間戦えますか → ワーク・ライフ・バランス",
    en: "How Hard to Work",
    lead: "親子関係ではなく､同じグループで入れ替わってきた働き方の規範を年代順に並べる｡江戸後期の通俗道徳､東京五輪の根性､1989年のCMソング､2007年の憲章｡",
    span: "約200年",
    spanLabel: "通俗道徳から憲章まで",
    nodes: [
      { ref: "勤勉こそ美徳", label: "勤勉こそ美徳", year: 1800, yearLabel: "江戸後期", note: "勤勉・倹約・孝行・正直｡" },
      { ref: "根性・気合", label: "根性・気合", year: 1964, yearLabel: "1964 東京五輪", note: "スポーツの根性論が広まる｡" },
      { ref: "24時間戦えますか", label: "24時間戦えますか", year: 1989, yearLabel: "1989 CM", note: "新語・流行語大賞で銅賞｡" },
      { ref: "ワーク・ライフ・バランス", label: "ワーク・ライフ・バランス", year: 2007, yearLabel: "2007 憲章", note: "仕事と生活の調和｡" },
    ],
  },
  {
    id: "koyo",
    kind: "restock",
    title: "兼業が当たり前 → 終身雇用 → 副業解禁",
    en: "One Company, for a While",
    lead: "前近代の村には､農業のかたわら商いや職人仕事を持つ家も少なくなかった｡アベグレンは､日本の雇用を lifetime commitment と呼んだ｡その翌年の1959年､雇われて働く人が就業者の過半数になる｡2018年､厚生労働省はモデル就業規則から副業の禁止を消した｡",
    span: "59年",
    spanLabel: "雇用者が過半になってから",
    nodes: [
      { ref: "兼業が当たり前", label: "兼業が当たり前", year: 1700, yearLabel: "前近代", note: "農間余業と内職｡" },
      { ref: "終身雇用", label: "終身雇用", year: 1958, yearLabel: "1958 アベグレン", note: "lifetime commitment と呼ばれた｡" },
      { label: "雇用者が過半に", year: 1959, yearLabel: "1959 51.9%", note: "就業者に占める雇用者の割合｡" },
      { label: "副業ガイドライン", year: 2018, yearLabel: "2018 厚労省", note: "モデル就業規則から禁止規定を削除｡" },
    ],
  },
  {
    id: "ko",
    kind: "theme",
    title: "結・講 → クラウドファンディング",
    en: "Pass the Hat",
    lead: "頼母子講は1275年の文書に現れる｡無尽は1915年に法律で免許制になり､1951年に無尽会社が相互銀行となり､1989年には相互銀行52行が普通銀行に転換した｡クラウドファンディングは､2011年に購入型サービスが始まった｡講の直系ではなく､形の似た品が別の工場から入荷したものである｡",
    span: "22年",
    spanLabel: "銀行への転換から",
    nodes: [
      { ref: "結・講", label: "結・講", year: 1275, yearLabel: "1275 頼母子", note: "高野山文書に現れる｡" },
      { label: "無尽業法", year: 1915, yearLabel: "1915", note: "営業無尽を免許制にした｡" },
      { label: "相互銀行法", year: 1951, yearLabel: "1951", note: "無尽会社が相互銀行になる｡" },
      { label: "普通銀行へ転換", year: 1989, yearLabel: "1989", note: "相互銀行52行が一斉に転換した｡" },
      { label: "クラウドファンディング", year: 2011, yearLabel: "2011 READYFOR", note: "直系ではなく､形の似た別の品｡" },
    ],
  },
  // ───────────────────────── 第2次（日本と世界をまたぐもの）
  {
    id: "shiken",
    kind: "theme",
    title: "科挙 → 立身出世 → 学歴がすべて → 専より紅",
    en: "Chosen by Examination",
    lead: "家柄ではなく試験で人を選ぶ仕組みは､598年の中国に始まる｡1300年続いて1905年9月2日の上諭一枚で止まり､1952年に高考として戻ってきた｡日本は1872年の学制が｢學問ハ身ヲ立ルノ財本｣と説き､1960年代に｢学歴社会｣という言葉ができた｡中国ではそのあと11年半､大学入試に試験がなかった｡",
    span: "1379年",
    spanLabel: "科挙の詔から､試験が戻るまで",
    nodes: [
      { ref: "科挙", label: "科挙", year: 598, yearLabel: "598 隋の詔", note: "家柄ではなく試験の成績で官を選ぶ｡" },
      { ref: "立身出世", label: "立身出世", year: 1872, yearLabel: "1872 学制", note: "｢學問ハ身ヲ立ルノ財本｣" },
      { label: "科挙の停止", year: 1905, yearLabel: "1905.9.2 上諭", note: "丙午科から郷会試を一律停止｡" },
      { label: "高考", year: 1952, yearLabel: "1952 全国統一考試", note: "停止から47年後に試験が戻る｡" },
      { ref: "学歴がすべて", label: "学歴がすべて", year: 1960, yearLabel: "1960年代", note: "｢学歴社会｣の語が定着する｡" },
      { ref: "専より紅", label: "専より紅", year: 1966, yearLabel: "1966 試験の取消", note: "推薦に切り替え､1977年に戻った｡" },
    ],
  },
  {
    id: "shoyu",
    kind: "theme",
    title: "人は土地に付いてくる → 人を年季で買う → 人は財産である → 人を所有できる",
    en: "The End of Owning People",
    lead: "人が人を所有できるという前提は､国ごとに別の日付で終わった｡ロシアは1861年の解放令､日本は1872年の太政官布告第295号､ブラジルは1888年の黄金法､サウジアラビアは1962年である｡終わらせたのはどれも一片の法令で､条文は短い｡黄金法は本文が二条しかない｡",
    span: "101年",
    spanLabel: "ロシアの解放令からサウジの廃止まで",
    nodes: [
      { ref: "人は土地に付いてくる", label: "人は土地に付いてくる", year: 1861, yearLabel: "1861 解放令", note: "2300万人以上が対象になった｡" },
      { ref: "人を年季で買う", label: "人を年季で買う", year: 1872, yearLabel: "1872 布告第295号", note: "人身売買を厳禁と定めた｡" },
      { ref: "人は財産である", label: "人は財産である", year: 1888, yearLabel: "1888 黄金法", note: "本文は二条だけ｡" },
      { ref: "人を所有できる", label: "人を所有できる", year: 1962, yearLabel: "1962 十箇条計画", note: "解放された人数と補償額が残る｡" },
    ],
  },
  {
    id: "karada",
    kind: "theme",
    title: "お歯黒と引眉 → 辮髪 → 纏足",
    en: "The State Comes for the Body",
    lead: "近代化はまず身体の見た目に及んだ｡日本は1870年に華族の染歯掃眉を停止し､翌年の散髪脱刀令が髷を解いてよいと定めた｡中国では1645年に剃らねば死罪だった辮髪が､1912年3月5日には切らねば違法になる｡その8日後には纏足を禁じる文が出た｡どれも一枚の布告で､身体の慣習が終わっている｡",
    span: "42年",
    spanLabel: "染歯掃眉の停止から剪辮・禁纏足まで",
    nodes: [
      { ref: "お歯黒と引眉", label: "お歯黒と引眉", year: 1870, yearLabel: "1870 染歯掃眉の停止", note: "禁じられたのは華族の元服する者｡" },
      { label: "散髪脱刀令", year: 1871, yearLabel: "1871 太政官第399号", note: "髷を解いてよいと定めた｡" },
      { ref: "辮髪", label: "辮髪", year: 1912, yearLabel: "1912.3.5 剪辮", note: "1645年には剃らねば死罪だった｡" },
      { ref: "纏足", label: "纏足", year: 1912, yearLabel: "1912.3.13 勧禁纏足", note: "剪辮の8日後に出た｡" },
    ],
  },
  {
    id: "ie",
    kind: "theme",
    title: "家名の存続がすべて → 戸主制",
    en: "The Household, Exported",
    lead: "日本の家制度は1898年の明治民法で条文になり､1947年から1948年にかけて消えた｡その間の1923年7月1日､朝鮮総督府が朝鮮民事令を改めて日本式の戸籍を施行している｡移植された家制度は本国が捨てたあとも生き残り､廃止は2008年1月1日だった｡日本が手放してから60年後である｡",
    span: "110年",
    spanLabel: "明治民法から韓国の戸主制廃止まで",
    nodes: [
      { ref: "家名の存続がすべて", label: "家名の存続がすべて", year: 1898, yearLabel: "1898 明治民法", note: "戸主と家督相続が条文になる｡" },
      { label: "日本式の戸籍を朝鮮へ", year: 1923, yearLabel: "1923.7.1 朝鮮民事令改正", note: "民籍法を廃し､戸籍制度を施行｡" },
      { label: "日本の家制度が消える", year: 1948, yearLabel: "1948 改正民法", note: "応急措置法と改正民法による｡" },
      { ref: "戸主制", label: "戸主制", year: 2008, yearLabel: "2008.1.1 廃止", note: "日本が捨ててから60年後｡" },
    ],
  },
  {
    id: "sanseiken",
    kind: "theme",
    title: "政治は男のもの → 女に選挙権はいらない",
    en: "When Women Got the Vote",
    lead: "女性に投票を認めた最初の国は1893年のニュージーランドである｡日本では1900年の治安警察法第5条が女性の政治結社加入を禁じ､軍人・警察官と同じ列に｢女子｣が並んでいた｡廃止は1945年11月21日｡スイスの連邦憲法は｢すべてのスイス人｣と書きながら女性を含めず､連邦裁判所は二度その根拠に慣習を挙げた｡決まったのは1971年2月7日の国民投票である｡",
    span: "78年",
    spanLabel: "ニュージーランドからスイスまで",
    nodes: [
      { label: "ニュージーランド", year: 1893, yearLabel: "1893", note: "女性に投票を認めた最初の国｡" },
      { ref: "政治は男のもの", label: "政治は男のもの", year: 1945, yearLabel: "1945 治安警察法の廃止", note: "翌年4月に39人が当選した｡" },
      { ref: "女に選挙権はいらない", label: "女に選挙権はいらない", year: 1971, yearLabel: "1971.2.7 国民投票", note: "賛成65.7%｡" },
    ],
  },
  {
    id: "taibatsu",
    kind: "theme",
    title: "子どもは叩いて育てる → 体罰はしつけ",
    en: "Ending the Right to Hit",
    lead: "親が子を叩く権利は､慣行ではなく法の後ろ盾を持っていた｡日本では学校の体罰が1879年に禁じられ､家庭の懲戒権は1898年の明治民法第882条で条文になる｡家庭のほうがあとまで残った｡家庭内を含めて世界で最初に全面的に禁じたのは1979年7月1日のスウェーデンで､日本が民法第822条を削ったのは2022年12月16日である｡",
    span: "143年",
    spanLabel: "学校の禁止から家庭の削除まで",
    nodes: [
      { label: "学校の体罰を禁じる", year: 1879, yearLabel: "1879 教育令", note: "家庭はこのあと143年残った｡" },
      { ref: "子どもは叩いて育てる", label: "子どもは叩いて育てる", year: 1979, yearLabel: "1979.7.1 世界初", note: "家庭内を含めて全面的に禁じた｡" },
      { ref: "体罰はしつけ", label: "体罰はしつけ", year: 2022, yearLabel: "2022.12.16 民法822条の削除", note: "懲戒権の条文が消えた｡" },
    ],
  },
];

export const lineageById = (id: string) => lineages.find((l) => l.id === id);

export const resolveNode = (n: LineageNode): Value | undefined =>
  n.ref ? values.find((v) => v.name === n.ref) : undefined;

/** あるカードが属する系譜（複数可） */
/**
 * あるカードが属する系譜（複数可）｡
 * 名前ではなく型番で突き合わせる｡英語で見ているときは v.name が英名に
 * なっていて､節の ref（和名）と一致しないため｡
 */
export const lineagesOf = (v: Value): Lineage[] =>
  lineages.filter((l) => l.nodes.some((n) => resolveNode(n)?.no === v.no));
