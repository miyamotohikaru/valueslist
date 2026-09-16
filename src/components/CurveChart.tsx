import type { Curve } from "@/data/types";
import { SourceText } from "@/lib/source";
import BreakText from "./BreakText";
import TypeLabel from "./TypeLabel";

/**
 * カーブ型の証拠。世論調査の賛成率（折れ線）や年次の件数（棒）を、印刷物の図版として描く。
 * - 同じデータから PC 用（640 幅）と携帯用（360 幅）の二枚を描き、コンテナ幅で切り替える
 * - 系列1の線の下に網点の面を敷く
 * - marks の break: true の年は、その前で線を切って点線でつなぐ（調査方法の変更など）
 */

type Layout = {
  W: number;
  H: number;
  ml: number;
  mr: number;
  mt: number;
  mb: number;
  fs: number; // 軸ラベルの文字サイズ（viewBox 基準）
  maxXTicks: number;
  r: number; // 点の半径
  lw: number; // 線の太さ
};

const FULL: Layout = { W: 640, H: 360, ml: 52, mr: 16, mt: 46, mb: 38, fs: 13, maxXTicks: 8, r: 4.6, lw: 3.2 };
const COMPACT: Layout = { W: 360, H: 300, ml: 42, mr: 10, mt: 46, mb: 34, fs: 12.5, maxXTicks: 5, r: 3.8, lw: 2.8 };

const RED = "var(--vl-red)";
const NAVY = "var(--vl-navy)";
const INK = "var(--vl-ink)";
const LINE = "var(--vl-line)";
const CARD = "var(--vl-card)";
const PAPER = "var(--vl-paper)";
const MONO = "var(--font-courier), monospace";
const SANS = "var(--font-zen-kaku), sans-serif";

function estWidth(text: string, fs: number) {
  let w = 0;
  for (const ch of text) w += ch.charCodeAt(0) > 0x2e80 ? fs : fs * 0.62;
  return w;
}

function fmt(n: number) {
  return Number.isInteger(n) ? n.toLocaleString("en-US") : n.toFixed(1);
}

function niceStep(max: number, target = 4) {
  const raw = Math.max(max, 1e-9) / target;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const s = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return s * mag;
}

function xStep(range: number, maxTicks: number) {
  for (const s of [1, 2, 5, 10, 20, 25, 50, 100, 200]) if (range / s <= maxTicks) return s;
  return 500;
}

function hash(s: string) {
  let h = 5;
  for (const c of s) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  return h.toString(36);
}

/** 点列を、break の年の前で切った区間に分ける */
function segments(points: [number, number][], breaks: number[]) {
  const out: [number, number][][] = [];
  let cur: [number, number][] = [];
  points.forEach((p, i) => {
    if (i > 0 && breaks.some((b) => points[i - 1][0] < b && p[0] >= b)) {
      out.push(cur);
      cur = [];
    }
    cur.push(p);
  });
  if (cur.length) out.push(cur);
  return out;
}

function Plot({ curve, L, accent, className }: { curve: Curve; L: Layout; accent: string; className: string }) {
  const { W, H, ml, mr, mt, mb, fs, maxXTicks, r, lw } = L;
  const isBar = curve.kind === "bar";
  const palette = [accent, NAVY, "var(--vl-teal)", "var(--vl-brown)"];
  const series = curve.series
    .map((s) => ({ name: s.name, points: s.points.slice().sort((a, b) => a[0] - b[0]) }))
    .filter((s) => s.points.length > 0);
  const all = series.flatMap((s) => s.points);
  if (all.length === 0) return null;
  const uid = `${hash(curve.title)}-${W}`;
  const breaks = (curve.marks ?? []).filter((m) => m.break).map((m) => m.year);

  const years = all.map((p) => p[0]);
  const vals = all.map((p) => p[1]);
  const yr0 = Math.min(...years);
  const yr1 = Math.max(...years);
  const vMax = Math.max(0, ...vals);

  // Y 軸: 最大値の 1 割以上の余白を取る。% で 100 に収まるなら 0-100
  const isPct = curve.unit.trim() === "%";
  let top: number;
  let step: number;
  if (isPct && vMax * 1.08 <= 100) {
    top = 100;
    step = 25;
  } else {
    step = niceStep((vMax || 1) * 1.1);
    top = Math.ceil(((vMax || 1) * 1.1) / step) * step;
  }
  const yTicks: number[] = [];
  for (let t = 0; t <= top + 1e-9; t += step) yTicks.push(Math.round(t * 1e6) / 1e6);

  const span = Math.max(1, yr1 - yr0);
  const pad = isBar ? 0.5 + span * 0.01 : Math.max(0.6, span * 0.045);
  const x0 = yr0 - pad;
  const x1 = yr1 + pad;
  const pw = W - ml - mr;
  const ph = H - mt - mb;
  const X = (yr: number) => ml + ((yr - x0) / (x1 - x0)) * pw;
  const Y = (v: number) => mt + ph - (v / top) * ph;
  const xs = xStep(x1 - x0, maxXTicks);
  const xTicks: number[] = [];
  for (let t = Math.ceil(x0 / xs) * xs; t <= x1; t += xs) xTicks.push(t);

  const unitW = pw / (x1 - x0);
  const nS = series.length;
  const bw = Math.max(1.4, (unitW * 0.72) / nS);
  const short = curve.unit.length <= 2 ? curve.unit : "";

  // 値ラベル（線: 最初と最後 / 棒: ピークと最後）
  type Lab = { x: number; y: number; text: string; color: string };
  const labels: Lab[] = [];
  const lfs = fs + 1;
  const clampX = (x: number, w: number) => Math.min(W - mr - w / 2, Math.max(ml + w / 2, x));
  series.forEach((s, si) => {
    const color = palette[si % palette.length];
    const pts = s.points;
    const picks = isBar
      ? (() => {
          const last = pts[pts.length - 1];
          let peak = pts[0];
          for (const p of pts) if (p[1] > peak[1]) peak = p;
          return peak === last ? [last] : [peak, last];
        })()
      : pts.length === 1
        ? [pts[0]]
        : [pts[0], pts[pts.length - 1]];
    for (const p of picks) {
      const text = `${fmt(p[1])}${short}`;
      const w = estWidth(text, lfs) + 6;
      const x = clampX(X(p[0]), w);
      const above = Y(p[1]) - r - 7;
      const clash = labels.find((l) => Math.abs(l.x - x) < w && Math.abs(l.y - above) < lfs + 4);
      labels.push({ x, y: clash || above < mt + lfs ? Y(p[1]) + r + lfs + 4 : above, text, color });
    }
  });

  // 注記の札（重なるときは段をずらす）
  const tfs = fs - 0.5;
  const tagH = tfs + 9;
  const placed: { x0: number; x1: number; row: number }[] = [];
  const marks = (curve.marks ?? [])
    .filter((m) => m.year >= x0 && m.year <= x1)
    .slice()
    .sort((a, b) => a.year - b.year)
    .map((m) => {
      const w = estWidth(m.text, tfs) + 14;
      const x = X(m.year);
      let left = x + 5;
      if (left + w > W - mr) left = x - 5 - w;
      let row = 0;
      while (placed.some((p) => p.row === row && !(left + w < p.x0 || left > p.x1))) row++;
      placed.push({ x0: left, x1: left + w, row });
      return { ...m, x, left, w, y: mt + 6 + row * (tagH + 4) };
    });

  // 凡例（右から並べる）
  const legend: { x: number; name: string; color: string }[] = [];
  if (nS > 1) {
    let x = W - mr;
    for (let i = nS - 1; i >= 0; i--) {
      const w = estWidth(series[i].name, fs) + 28;
      x -= w;
      legend.push({ x, name: series[i].name, color: palette[i % palette.length] });
      x -= 12;
    }
  }
  const legendFits = legend.length === 0 || legend[legend.length - 1].x > ml + estWidth(`UNIT · ${curve.unit}`, fs) + 12;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`block h-auto w-full ${className}`} role="img" aria-label={curve.title.replace(/[◆◇]/g, "")}>
      <defs>
        <pattern id={`dots-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.25" fill={palette[0]} />
        </pattern>
      </defs>
      <rect x={ml} y={mt} width={pw} height={ph} fill={CARD} />
      {yTicks.slice(1).map((t) => (
        <line key={`gy${t}`} x1={ml} y1={Y(t)} x2={ml + pw} y2={Y(t)} stroke={LINE} strokeWidth="1" strokeDasharray="1 4" strokeLinecap="round" />
      ))}
      <text x={2} y={mt - 16} fontSize={fs} fontWeight="700" fill={INK} fontFamily={MONO} letterSpacing="0.8">
        UNIT · {curve.unit}
      </text>
      {legendFits &&
        legend.map((l) => (
          <g key={l.name}>
            <line x1={l.x} y1={mt - 20} x2={l.x + 18} y2={mt - 20} stroke={l.color} strokeWidth={lw} />
            <circle cx={l.x + 9} cy={mt - 20} r={3.4} fill={l.color} stroke={CARD} strokeWidth="1.2" />
            <text x={l.x + 24} y={mt - 16} fontSize={fs} fontWeight="700" fill={INK} fontFamily={SANS}>
              {l.name}
            </text>
          </g>
        ))}

      {/* 系列 */}
      {series.map((s, si) => {
        const color = palette[si % palette.length];
        if (isBar) {
          return (
            <g key={s.name}>
              {s.points.map((p) => {
                const x = X(p[0]) - (bw * nS) / 2 + si * bw;
                const y = Y(p[1]);
                return <rect key={p[0]} x={x} y={y} width={bw} height={Math.max(0, Y(0) - y)} fill={color} />;
              })}
            </g>
          );
        }
        const segs = segments(s.points, breaks);
        const path = (pts: [number, number][]) =>
          pts.map((p, i) => `${i ? "L" : "M"}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(" ");
        const dense = s.points.length > 24;
        return (
          <g key={s.name}>
            {si === 0 &&
              segs
                .filter((g) => g.length > 1)
                .map((g, gi) => (
                  <path
                    key={`a${gi}`}
                    d={`${path(g)} L${X(g[g.length - 1][0]).toFixed(1)},${Y(0).toFixed(1)} L${X(g[0][0]).toFixed(1)},${Y(0).toFixed(1)} Z`}
                    fill={`url(#dots-${uid})`}
                    opacity="0.38"
                  />
                ))}
            {segs.map((g, gi) => (
              <path key={`l${gi}`} d={path(g)} fill="none" stroke={color} strokeWidth={lw} strokeLinejoin="round" strokeLinecap="round" />
            ))}
            {segs.slice(1).map((g, gi) => {
              const a = segs[gi][segs[gi].length - 1];
              const b = g[0];
              return (
                <line
                  key={`b${gi}`}
                  x1={X(a[0])}
                  y1={Y(a[1])}
                  x2={X(b[0])}
                  y2={Y(b[1])}
                  stroke={color}
                  strokeWidth={lw * 0.6}
                  strokeDasharray="3 4"
                  strokeLinecap="round"
                />
              );
            })}
            {s.points
              .filter((p, i) => !dense || i === 0 || i === s.points.length - 1 || marks.some((m) => m.year === p[0]))
              .map((p) => (
                <circle key={p[0]} cx={X(p[0])} cy={Y(p[1])} r={r} fill={color} stroke={CARD} strokeWidth="1.4" />
              ))}
          </g>
        );
      })}

      {/* 注記 */}
      {marks.map((m) => (
        <g key={`${m.year}${m.text}`}>
          <line x1={m.x} y1={mt} x2={m.x} y2={mt + ph} stroke={RED} strokeWidth="1.4" strokeDasharray="3 3" />
          <rect x={m.left} y={m.y} width={m.w} height={tagH} rx="2" fill={RED} />
          <text x={m.left + 7} y={m.y + tagH - 6} fontSize={tfs} fontWeight="700" fill={PAPER} fontFamily={SANS}>
            {m.text}
          </text>
        </g>
      ))}

      {/* 値ラベル */}
      {labels.map((l, i) => (
        <text
          key={i}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          fontSize={lfs}
          fontWeight="700"
          fill={l.color}
          fontFamily={MONO}
          stroke={CARD}
          strokeWidth="4"
          paintOrder="stroke"
        >
          {l.text}
        </text>
      ))}

      {/* 軸 */}
      <line x1={ml} y1={mt} x2={ml} y2={mt + ph} stroke={INK} strokeWidth="2.2" />
      <line x1={ml} y1={mt + ph} x2={ml + pw} y2={mt + ph} stroke={INK} strokeWidth="2.2" />
      {yTicks.map((t) => (
        <g key={`y${t}`}>
          <line x1={ml - 5} y1={Y(t)} x2={ml} y2={Y(t)} stroke={INK} strokeWidth="1.8" />
          <text x={ml - 8} y={Y(t) + fs * 0.36} textAnchor="end" fontSize={fs} fill={INK} fontFamily={MONO}>
            {fmt(t)}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={`x${t}`}>
          <line x1={X(t)} y1={mt + ph} x2={X(t)} y2={mt + ph + 5} stroke={INK} strokeWidth="1.8" />
          <text x={X(t)} y={mt + ph + 8 + fs} textAnchor="middle" fontSize={fs} fill={INK} fontFamily={MONO}>
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function CurveChart({
  curve,
  accent = RED,
  className = "",
  fig = "FIG.2",
}: {
  curve: Curve;
  accent?: string;
  className?: string;
  fig?: string;
}) {
  const isBar = curve.kind === "bar";
  const multi = curve.series.length > 1;
  return (
    <figure className={`vl-offset relative border-2 border-vl-ink bg-vl-card ${className}`}>
      <div className="border-b-2 border-vl-ink px-4 py-3 md:px-5">
        {/* 印は図番号の行に置き、見出しは幅いっぱいに使う（見出しは句読点か ◆ でだけ折れる） */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] font-bold text-vl-ink-soft">
            <TypeLabel text={`${fig} · ${isBar ? "年ごとの件数" : "統計の推移"}`} />
          </p>
          <span className="vl-stamp font-display-en shrink-0 text-[12px] text-vl-red-deep md:text-[13px]">DATED BY CURVE</span>
        </div>
        <p className="mt-2 text-[15px] leading-snug font-bold md:text-[16px]">
          <BreakText text={curve.title} />
        </p>
        {curve.subtitle && (
          <p className="mt-1 text-[13px] leading-snug">
            <BreakText text={curve.subtitle} />
          </p>
        )}
      </div>
      <div className="@container px-2 pt-3 pb-1 md:px-3">
        <Plot curve={curve} L={FULL} accent={accent} className="hidden @lg:block" />
        <Plot curve={curve} L={COMPACT} accent={accent} className="@lg:hidden" />
        {/* 携帯で凡例が図に入りきらないとき用の凡例 */}
        {multi && (
          <ul className="flex flex-wrap gap-x-4 gap-y-1 px-2 pb-2 text-[12px] font-bold @lg:hidden">
            {curve.series.map((s, i) => (
              <li key={s.name} className="flex items-center gap-1.5">
                <span className="inline-block h-[4px] w-[16px]" style={{ background: [accent, NAVY, "var(--vl-teal)", "var(--vl-brown)"][i % 4] }} aria-hidden />
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <figcaption className="border-t-2 border-vl-ink/15 px-4 py-3 md:px-5">
        <p className="text-[12px] leading-relaxed">
          <span className="font-type mr-1 font-bold tracking-[0.08em] text-vl-ink-soft">SOURCE ·</span>
          <SourceText s={curve.source} compact />
        </p>
        {curve.note && <p className="vl-justify mt-1 text-[12px] leading-relaxed text-vl-ink-soft">{curve.note}</p>}
      </figcaption>
    </figure>
  );
}
