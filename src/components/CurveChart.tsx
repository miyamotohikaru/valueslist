import type { Curve } from "@/data/types";
import { SourceText } from "@/lib/source";

/**
 * カーブ型の証拠。世論調査の賛成率（折れ線）や年次の件数（棒）を描く。
 * 同じデータから PC 用（640 幅）と携帯用（360 幅）の二枚を描き、
 * コンテナ幅で切り替える（携帯で軸の文字が潰れないように）。
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
  r: number; // 点マーカーの半径
  lw: number; // 線の太さ
};

const FULL: Layout = { W: 640, H: 340, ml: 58, mr: 20, mt: 50, mb: 40, fs: 12, maxXTicks: 8, r: 4, lw: 2.5 };
const COMPACT: Layout = { W: 360, H: 290, ml: 46, mr: 12, mt: 46, mb: 34, fs: 11, maxXTicks: 5, r: 3, lw: 2 };

const RED = "var(--vl-red)";
const NAVY = "var(--vl-navy)";
const INK = "var(--vl-ink)";
const LINE = "var(--vl-line)";
const SOFT = "var(--vl-ink-soft)";
const CARD = "var(--vl-card)";
const PAPER = "var(--vl-paper)";
const MONO = "var(--font-courier), monospace";
const SANS = "var(--font-zen-kaku), sans-serif";

/** 和文は 1em、欧文は 0.62em として幅を見積もる */
function estWidth(text: string, fs: number) {
  let w = 0;
  for (const ch of text) w += ch.charCodeAt(0) > 0x2e80 ? fs : fs * 0.62;
  return w;
}

function fmt(n: number) {
  return Number.isInteger(n) ? n.toLocaleString("en-US") : n.toFixed(1);
}

/** 目盛の刻み（1・2・2.5・5 系） */
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

function Plot({ curve, L, accent, className }: { curve: Curve; L: Layout; accent: string; className: string }) {
  const { W, H, ml, mr, mt, mb, fs, maxXTicks, r, lw } = L;
  const isBar = curve.kind === "bar";
  const palette = [accent, NAVY, "var(--vl-teal)", "var(--vl-brown)"];
  const series = curve.series
    .map((s) => ({ name: s.name, points: s.points.slice().sort((a, b) => a[0] - b[0]) }))
    .filter((s) => s.points.length > 0);
  const all = series.flatMap((s) => s.points);
  if (all.length === 0) return null;

  const years = all.map((p) => p[0]);
  const vals = all.map((p) => p[1]);
  const yr0 = Math.min(...years);
  const yr1 = Math.max(...years);
  const vMax = Math.max(0, ...vals);

  // Y 軸: % は 0-100 に固定、それ以外は最大値を丸める
  const isPct = curve.unit.trim() === "%";
  let top: number;
  let step: number;
  if (isPct && vMax <= 100) {
    top = 100;
    step = 25;
  } else {
    step = niceStep(vMax || 1);
    top = Math.ceil((vMax || 1) / step) * step;
  }
  const yTicks: number[] = [];
  for (let t = 0; t <= top + 1e-9; t += step) yTicks.push(Math.round(t * 1e6) / 1e6);

  // X 軸: データ範囲に少し余白
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

  const unitW = pw / (x1 - x0); // 1 年ぶんの幅
  const nS = series.length;
  const bw = Math.max(1.2, (unitW * 0.7) / nS);
  const short = curve.unit.length <= 2 ? curve.unit : "";

  // 値ラベル（線: 最初と最後 / 棒: ピークと最後）
  type Lab = { x: number; y: number; text: string; color: string; anchor: "start" | "middle" | "end" };
  const labels: Lab[] = [];
  const clampX = (x: number, w: number) => Math.min(W - mr - w / 2, Math.max(ml + w / 2, x));
  series.forEach((s, si) => {
    const color = palette[si % palette.length];
    const pts = s.points;
    if (isBar) {
      const last = pts[pts.length - 1];
      let peak = pts[0];
      for (const p of pts) if (p[1] > peak[1]) peak = p;
      const picks = peak === last ? [last] : [peak, last];
      for (const p of picks) {
        const text = `${fmt(p[1])}${short}`;
        const w = estWidth(text, fs) + 4;
        labels.push({ x: clampX(X(p[0]), w), y: Y(p[1]) - 5, text, color, anchor: "middle" });
      }
    } else {
      const first = pts[0];
      const last = pts[pts.length - 1];
      for (const p of first === last ? [first] : [first, last]) {
        const text = `${fmt(p[1])}${short}`;
        const w = estWidth(text, fs) + 4;
        // 2 本目の系列で最後の点が近いときは下に逃がす
        const prior = labels.find((l) => Math.abs(l.x - clampX(X(p[0]), w)) < w && Math.abs(l.y - (Y(p[1]) - r - 5)) < fs + 4);
        const below = !!prior;
        labels.push({
          x: clampX(X(p[0]), w),
          y: below ? Y(p[1]) + r + fs + 3 : Y(p[1]) - r - 5,
          text,
          color,
          anchor: "middle",
        });
      }
    }
  });

  // 注記の札（重なるときは段をずらす）
  const tagH = fs + 8;
  const placed: { x0: number; x1: number; row: number }[] = [];
  const marks = (curve.marks ?? [])
    .filter((m) => m.year >= x0 && m.year <= x1)
    .slice()
    .sort((a, b) => a.year - b.year)
    .map((m) => {
      const w = estWidth(m.text, fs - 1) + 12;
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
      const w = estWidth(series[i].name, fs) + 26;
      x -= w;
      legend.push({ x, name: series[i].name, color: palette[i % palette.length] });
      x -= 12;
    }
  }

  const markerEvery = (n: number) => n <= 24;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`block h-auto w-full ${className}`}
      role="img"
      aria-label={curve.title}
    >
      {/* プロット面 */}
      <rect x={ml} y={mt} width={pw} height={ph} fill={CARD} stroke={LINE} strokeWidth="1" />
      {/* グリッド */}
      {yTicks.slice(1).map((t) => (
        <line key={`gy${t}`} x1={ml} y1={Y(t)} x2={ml + pw} y2={Y(t)} stroke={LINE} strokeWidth="0.8" strokeDasharray="2 3" />
      ))}
      {xTicks.map((t) => (
        <line key={`gx${t}`} x1={X(t)} y1={mt} x2={X(t)} y2={mt + ph} stroke={LINE} strokeWidth="0.8" strokeDasharray="2 3" />
      ))}
      {/* 単位 */}
      <text x={2} y={mt - 14} fontSize={fs} fill={SOFT} fontFamily={MONO} letterSpacing="1.5">
        UNIT · {curve.unit}
      </text>
      {/* 凡例 */}
      {legend.map((l) => (
        <g key={l.name}>
          <line x1={l.x} y1={mt - 18} x2={l.x + 16} y2={mt - 18} stroke={l.color} strokeWidth={lw} />
          <circle cx={l.x + 8} cy={mt - 18} r={3} fill={CARD} stroke={l.color} strokeWidth="1.8" />
          <text x={l.x + 22} y={mt - 14} fontSize={fs} fontWeight="700" fill={INK} fontFamily={SANS}>
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
        const d = s.points.map((p, i) => `${i ? "L" : "M"}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(" ");
        const dots = markerEvery(s.points.length)
          ? s.points
          : s.points.filter((p, i) => i === 0 || i === s.points.length - 1 || marks.some((m) => m.year === p[0]));
        return (
          <g key={s.name}>
            <path d={d} fill="none" stroke={color} strokeWidth={lw} strokeLinejoin="round" strokeLinecap="round" />
            {dots.map((p) => (
              <circle key={p[0]} cx={X(p[0])} cy={Y(p[1])} r={r} fill={CARD} stroke={color} strokeWidth={lw * 0.8} />
            ))}
          </g>
        );
      })}
      {/* 注記 */}
      {marks.map((m) => (
        <g key={`${m.year}${m.text}`}>
          <line x1={m.x} y1={mt} x2={m.x} y2={mt + ph} stroke={RED} strokeWidth="1.2" strokeDasharray="3 3" />
          <rect x={m.left} y={m.y} width={m.w} height={tagH} fill={RED} />
          <text x={m.left + 6} y={m.y + tagH - 6} fontSize={fs - 1} fontWeight="700" fill={PAPER} fontFamily={SANS}>
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
          textAnchor={l.anchor}
          fontSize={fs}
          fontWeight="700"
          fill={l.color}
          fontFamily={MONO}
          stroke={CARD}
          strokeWidth="3"
          paintOrder="stroke"
        >
          {l.text}
        </text>
      ))}
      {/* 軸 */}
      <line x1={ml} y1={mt} x2={ml} y2={mt + ph} stroke={INK} strokeWidth="2" />
      <line x1={ml} y1={mt + ph} x2={ml + pw} y2={mt + ph} stroke={INK} strokeWidth="2" />
      {yTicks.map((t) => (
        <g key={`y${t}`}>
          <line x1={ml - 4} y1={Y(t)} x2={ml} y2={Y(t)} stroke={INK} strokeWidth="1.5" />
          <text x={ml - 8} y={Y(t) + fs * 0.36} textAnchor="end" fontSize={fs} fill={INK} fontFamily={MONO}>
            {fmt(t)}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={`x${t}`}>
          <line x1={X(t)} y1={mt + ph} x2={X(t)} y2={mt + ph + 5} stroke={INK} strokeWidth="1.5" />
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
  return (
    <figure className={`vl-offset relative border-2 border-vl-ink bg-vl-card ${className}`}>
      <div className="border-b-2 border-vl-ink px-4 py-3 md:px-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-type text-[10px] tracking-[0.25em] whitespace-nowrap text-vl-ink-soft">
            {fig} · {isBar ? "ANNUAL COUNT" : "TREND CURVE"}
            <span className="hidden md:inline"> · 統計の推移</span>
          </p>
          <span className="vl-stamp font-display-en shrink-0 text-[10px] text-vl-red md:text-[13px]">
            DATED BY CURVE
          </span>
        </div>
        <p className="mt-1.5 text-[13px] leading-snug font-bold md:text-[14px]">{curve.title}</p>
      </div>
      <div className="@container px-2 pt-3 pb-1 md:px-4">
        <Plot curve={curve} L={FULL} accent={accent} className="hidden @lg:block" />
        <Plot curve={curve} L={COMPACT} accent={accent} className="@lg:hidden" />
      </div>
      <figcaption className="border-t border-vl-line px-4 py-3 md:px-5">
        <p className="font-type text-[10px] leading-relaxed tracking-[0.12em] text-vl-ink-soft md:text-[11px]">
          SOURCE · <SourceText s={curve.source} compact />
        </p>
        {curve.note && <p className="mt-1 text-[11px] leading-relaxed text-vl-ink-soft">{curve.note}</p>}
      </figcaption>
    </figure>
  );
}
