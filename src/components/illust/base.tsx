import type { ReactNode } from "react";

/**
 * 図版（イラスト）の共通の地｡
 * 1950〜60年代の2色刷りのポスターにならい､色は｢墨の輪郭・クリームの面・朱の差し色｣だけ｡
 * 面の陰影は網点で作る（グラデーションは使わない）｡
 */
export const INK = "var(--vl-ink)";
export const PAPER = "var(--vl-card)";
export const RED = "var(--vl-red)";
export const RED_DEEP = "var(--vl-red-deep)";
export const MUSTARD = "var(--vl-mustard)";

export const SW = 3.6; // 外形の線
export const SW_THIN = 1.8; // 内側の線

/** 網点と､光の放射｡id が重ならないように図版ごとに接頭辞を付ける */
export function IllustDefs({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={`${id}-dots`} width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.25" fill={RED} opacity="0.55" />
      </pattern>
      <pattern id={`${id}-dots-ink`} width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.1" fill={INK} opacity="0.35" />
      </pattern>
      <clipPath id={`${id}-clip`}>
        <circle cx="80" cy="80" r="70" />
      </clipPath>
    </defs>
  );
}

/** 図版の枠｡丸い網点の地に､輪郭線の絵を載せる */
export default function IllustFrame({
  id,
  children,
  label,
  className = "",
  disc = true,
}: {
  id: string;
  children: ReactNode;
  label: string;
  className?: string;
  /** 後ろの丸い網点を出すか */
  disc?: boolean;
}) {
  return (
    <svg viewBox="0 0 160 160" className={className} role="img" aria-label={label}>
      <IllustDefs id={id} />
      {disc && (
        <>
          <circle cx="80" cy="80" r="66" fill={`url(#${id}-dots)`} opacity="0.5" />
          <circle cx="80" cy="80" r="66" fill="none" stroke={INK} strokeWidth="1.4" strokeDasharray="4 4" opacity="0.35" />
        </>
      )}
      <g strokeLinejoin="round" strokeLinecap="round">
        {children}
      </g>
    </svg>
  );
}

/** きらめき（4方向の光）｡角の余白に置く */
export function Sparkle({ x, y, r = 9, color = RED }: { x: number; y: number; r?: number; color?: string }) {
  const d = `M${x},${y - r} Q${x + r * 0.22},${y - r * 0.22} ${x + r},${y} Q${x + r * 0.22},${y + r * 0.22} ${x},${y + r} Q${x - r * 0.22},${y + r * 0.22} ${x - r},${y} Q${x - r * 0.22},${y - r * 0.22} ${x},${y - r} Z`;
  return <path d={d} fill={color} />;
}
