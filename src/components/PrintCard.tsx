import Link from "next/link";
import type { Trend, Value } from "@/data/types";
import HalftoneArt, { type ArtInk } from "./print/HalftoneArt";
import type { Technique } from "./print/screen";

/**
 * 刷り札｡
 *
 * 図版は墨の版と色の版を2枚刷って重ねてある｡
 * スクロールすると上の墨が下がって､色が上から回ってくる｡
 */

const CREAM = "#f2eee2";

/**
 * 網の種類｡型番の順に5つを回す｡並べたとき隣と上下で網が変わる｡
 */
const TECHS: { tech: Technique; label: string }[] = [
  { tech: "halftone", label: "網点 HALFTONE · AM" },
  { tech: "linescreen", label: "線網 LINE SCREEN" },
  { tech: "stipple", label: "点刻 STIPPLE" },
  { tech: "contour", label: "等高 CONTOUR" },
  { tech: "solarise", label: "反転 SOLARISATION" },
];

/** 刷り色｡8色を回す｡棚の色ではないので､同じ棚でも一枚ずつ違う */
const INKS = [
  "#c8431d", // 朱
  "#26348c", // 藍
  "#9e2b45", // 臙脂
  "#2f6b45", // 緑
  "#a8761a", // 金茶
  "#5b3a86", // 紫
  "#17706b", // 青緑
  "#7a4a22", // 焦茶
];

/** 札の地と図版の枠の地｡6組を回す */
const GROUNDS = [
  { card: "#f3f0e7", panel: "#eae5d6" },
  { card: "#f1eee4", panel: "#e7e4d6" },
  { card: "#f3efe4", panel: "#ece6d8" },
  { card: "#f0eee3", panel: "#e4e5d5" },
  { card: "#f3f0e6", panel: "#ebe4d2" },
  { card: "#f2efe6", panel: "#e6e6dd" },
];

type Recipe = {
  tech: Technique;
  /** 網の呼び名（和 / 欧） */
  label: string;
  ink: ArtInk;
  /** 札の地｡図版の枠の地はこれより少し沈める */
  card: string;
  panel: string;
};

/**
 * 型番から刷りの指定を作る｡
 *
 * 網は5枚ひと回り､色は8色ひと回り､地は6組ひと回りにしてある｡
 * 周期が互いに素なので､並べたとき同じ組み合わせが近くに来ない｡
 * 7枚に1枚は地ごと裏返して刷る｡
 */
export function recipeOf(no: string): Recipe {
  const n = Number(no);
  const t = TECHS[(n - 1) % TECHS.length];
  const ink = INKS[(n - 1) % INKS.length];
  const ground = GROUNDS[(n - 1) % GROUNDS.length];
  const flip = n % 7 === 3;
  return {
    tech: t.tech,
    label: t.label,
    card: ground.card,
    panel: ground.panel,
    ink: flip
      ? // 色が回ると地ごと裏返る｡下の版が透けないよう墨の版にも地を敷く
        { inkFg: "#1c1b19", inkBg: ground.panel, colorFg: CREAM, colorBg: ink }
      : { inkFg: "#1c1b19", inkBg: "transparent", colorFg: ink, colorBg: "transparent" },
  };
}

/** いまの扱い｡札の右上に出す */
const STATE: Record<Trend, string> = {
  up: "現行・拡大中",
  steady: "現行",
  down: "現行・減少中",
  discontinued: "廃番",
  restocked: "再入荷",
};

/** 左に製造年､右に廃番年か再入荷年｡無ければ現行 */
function dates(v: Value) {
  const made = v.made ? `${v.made.approx ? "c." : ""}${v.made.year}` : "—";
  if (v.restocked) return [
    { k: "製造 MFD", t: made },
    { k: "再入荷 RESTOCK", t: String(v.restocked.year) },
  ];
  if (v.discontinued) return [
    { k: "製造 MFD", t: made },
    { k: "廃番 EOL", t: String(v.discontinued.year) },
  ];
  return [
    { k: "製造 MFD", t: made },
    { k: "現行 NOW", t: "NOW" },
  ];
}

export default function PrintCard({ v, interactive = true }: { v: Value; interactive?: boolean }) {
  const r = recipeOf(v.no);
  const [left, right] = dates(v);
  const shelfNo = v.shelf === "meta" ? "M" : String(v.shelf);

  // 外の枠で幅を測る｡札そのものに container-type を置くと
  // 札自身の padding には効かないので､いつも同じ大きさにならない
  const Wrap = interactive ? Link : "div";
  const wrapProps = interactive ? { href: `/values/${v.no}` } : {};

  return (
    <Wrap className="vl-print-wrap" {...(wrapProps as { href: string })}>
      <article
        className="vl-print"
        style={{
          ["--card" as string]: r.card,
          ["--panel" as string]: r.panel,
        }}
      >
        <div className="vl-print__top">
          <span>
            {/* 刷り色は一枚ずつ違うので､棚（分類）はこの番号で見分ける */}
            <span className="vl-print__shelf" aria-label={`棚 ${shelfNo}`}>
              {shelfNo}
            </span>
            NO.{v.no}
          </span>
          <span className={v.trend === "discontinued" ? "is-eol" : undefined}>{STATE[v.trend]}</span>
        </div>

        <HalftoneArt no={v.no} tech={r.tech} ink={r.ink} />

        <h3 className="vl-print__name">{v.name}</h3>
        <p className="vl-print__latin">
          <span>{v.en.toUpperCase()}</span>
          <span>{v.reading}</span>
        </p>
        <p className="vl-print__body">{v.meaning ?? v.hitokoto}</p>

        <div className="vl-print__data">
          <div>
            <span className="vl-print__k">{left.k}</span>
            <b className="vl-print__v">{left.t}</b>
          </div>
          <div>
            <span className="vl-print__k">{right.k}</span>
            <b className="vl-print__v">{right.t}</b>
          </div>
        </div>

        <div className="vl-print__foot">
          <span>{r.label}</span>
        </div>
      </article>
    </Wrap>
  );
}
