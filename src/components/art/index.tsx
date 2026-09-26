import type { ComponentType } from "react";

/**
 * 札の図版｡平らな幾何図形だけで組む｡
 * 使う色は3つ: 墨（輪郭と面）・朱（丸）・生成り（丸と抜き）｡
 * どの図版も viewBox 200×150 で､下端に物が立つ｡
 */
/** 図版の3色｡濃い地の札では札の側で入れ替える */
const INK = "var(--art-1)";
const RED = "var(--art-2)";
const CREAM = "var(--art-3)";

type P = { className?: string };

/** 仇討ち: 刀と朱の丸 */
export function ArtVendetta({ className = "" }: P) {
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden>
      <circle cx="132" cy="52" r="36" fill={RED} />
      <g transform="rotate(-38 100 78)">
        <rect x="36" y="70" width="112" height="13" fill={INK} />
        <path d="M148,70 L172,76.5 L148,83 Z" fill={INK} />
        <rect x="26" y="64" width="9" height="25" fill={INK} />
        <rect x="0" y="70" width="26" height="13" fill={INK} />
        <g stroke={CREAM} strokeWidth="2.4">
          <line x1="4" y1="70" x2="12" y2="83" />
          <line x1="12" y1="70" x2="20" y2="83" />
        </g>
      </g>
      <g stroke={INK} strokeWidth="3" strokeLinecap="round">
        <line x1="22" y1="36" x2="52" y2="36" />
        <line x1="32" y1="48" x2="58" y2="48" />
      </g>
    </svg>
  );
}

/** 忠孝: 巻物（勅語の謄本） */
export function ArtScroll({ className = "" }: P) {
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden>
      <circle cx="146" cy="46" r="30" fill={RED} />
      <rect x="44" y="26" width="86" height="104" fill={INK} />
      <g stroke={CREAM} strokeWidth="4">
        <line x1="58" y1="44" x2="58" y2="112" />
        <line x1="74" y1="44" x2="74" y2="98" />
        <line x1="90" y1="44" x2="90" y2="112" />
        <line x1="106" y1="44" x2="106" y2="92" />
      </g>
      <rect x="32" y="16" width="16" height="124" rx="8" fill={INK} />
      <rect x="126" y="16" width="16" height="124" rx="8" fill={INK} />
    </svg>
  );
}

/** 隠居: 急須と湯呑み */
export function ArtTeapot({ className = "" }: P) {
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden>
      <circle cx="140" cy="48" r="32" fill={CREAM} />
      <g stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M66,34 C58,26 74,20 66,10" />
        <path d="M86,30 C78,22 94,16 86,6" />
      </g>
      <path d="M40,74 h72 a30,30 0 0 1 0,48 h-72 a30,30 0 0 1 0,-48 Z" fill={INK} />
      <path d="M24,80 L40,86 L40,104 L22,98 Z" fill={INK} />
      <path d="M52,74 a24,14 0 0 1 48,0 Z" fill={INK} />
      <rect x="70" y="52" width="12" height="10" rx="4" fill={INK} />
      <path d="M140,96 h34 l-5,26 a12,12 0 0 1 -24,0 Z" fill={INK} />
      <rect x="20" y="126" width="160" height="8" fill={INK} />
    </svg>
  );
}

/** 終身雇用: 社員証 */
export function ArtBadge({ className = "" }: P) {
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden>
      <circle cx="140" cy="50" r="34" fill={RED} />
      <path d="M100,6 L70,34 M100,6 L130,34" stroke={INK} strokeWidth="4" fill="none" />
      <rect x="58" y="34" width="84" height="100" fill={INK} />
      <circle cx="82" cy="62" r="12" fill={CREAM} />
      <path d="M68,86 a14,14 0 0 1 28,0 Z" fill={CREAM} />
      <g stroke={CREAM} strokeWidth="5">
        <line x1="106" y1="56" x2="132" y2="56" />
        <line x1="106" y1="70" x2="132" y2="70" />
        <line x1="68" y1="104" x2="132" y2="104" />
        <line x1="68" y1="116" x2="112" y2="116" />
      </g>
      <g stroke={INK} strokeWidth="3" strokeLinecap="round">
        <line x1="18" y1="60" x2="44" y2="46" />
        <line x1="20" y1="76" x2="46" y2="62" />
      </g>
    </svg>
  );
}

/** 家（家庭の像） */
export function ArtHouse({ className = "" }: P) {
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden>
      <path d="M118,134 a40,40 0 0 1 80,0 Z" fill={RED} />
      <g stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M74,22 C66,14 82,8 74,0" />
      </g>
      <rect x="62" y="6" width="12" height="26" fill={INK} />
      <path d="M20,72 L76,26 L132,72 Z" fill={INK} />
      <rect x="34" y="70" width="84" height="64" fill={INK} />
      <rect x="46" y="84" width="26" height="26" fill={RED} />
      <rect x="88" y="94" width="20" height="40" fill={CREAM} />
      <rect x="20" y="130" width="160" height="6" fill={INK} />
    </svg>
  );
}

/** 断捨離: 開いた箱 */
export function ArtBox({ className = "" }: P) {
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden>
      <circle cx="104" cy="44" r="34" fill={CREAM} />
      <rect x="86" y="30" width="20" height="20" fill={INK} transform="rotate(-18 96 40)" />
      <g stroke={INK} strokeWidth="4" strokeLinecap="round">
        <line x1="74" y1="18" x2="80" y2="34" />
        <line x1="128" y1="24" x2="120" y2="38" />
      </g>
      <path d="M40,74 L66,62 L66,92 L40,102 Z" fill={INK} />
      <path d="M160,74 L134,62 L134,92 L160,102 Z" fill={INK} />
      <rect x="54" y="80" width="92" height="56" fill={INK} />
      <g stroke={CREAM} strokeWidth="4">
        <line x1="66" y1="98" x2="94" y2="98" />
        <line x1="106" y1="112" x2="134" y2="112" />
      </g>
      <line x1="100" y1="80" x2="100" y2="136" stroke={CREAM} strokeWidth="3" />
    </svg>
  );
}

/** 年賀状・書きもの */
export function ArtCard({ className = "" }: P) {
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden>
      <circle cx="146" cy="44" r="24" fill={CREAM} />
      <rect x="28" y="24" width="144" height="102" fill="none" stroke={INK} strokeWidth="5" />
      <path d="M52,110 L86,62 L120,110 Z" fill={INK} />
      <path d="M96,110 L124,74 L152,110 Z" fill={INK} />
      <g stroke={INK} strokeWidth="4">
        <line x1="44" y1="40" x2="70" y2="40" />
        <line x1="44" y1="52" x2="62" y2="52" />
      </g>
      <g fill={INK}>
        <rect x="84" y="34" width="10" height="10" />
        <rect x="98" y="34" width="10" height="10" />
        <rect x="112" y="34" width="10" height="10" />
      </g>
    </svg>
  );
}

/** 図版がまだ無い札｡型番から6つの型を選ぶ（並べたときに同じ顔が続かないように） */
export function ArtPlain({ className = "", seed = 0 }: P & { seed?: number }) {
  const k = seed % 6;
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden>
      {k === 0 && (
        <>
          <circle cx="132" cy="54" r="32" fill={RED} />
          <circle cx="78" cy="70" r="42" fill={INK} />
          <circle cx="78" cy="70" r="17" fill={CREAM} />
        </>
      )}
      {k === 1 && (
        <>
          <rect x="34" y="30" width="86" height="86" fill={INK} />
          <circle cx="132" cy="96" r="30" fill={RED} />
          <rect x="52" y="48" width="50" height="10" fill={CREAM} />
          <rect x="52" y="68" width="34" height="10" fill={CREAM} />
        </>
      )}
      {k === 2 && (
        <>
          <path d="M40,118 L96,30 L152,118 Z" fill={INK} />
          <circle cx="146" cy="44" r="24" fill={CREAM} />
        </>
      )}
      {k === 3 && (
        <>
          <circle cx="100" cy="72" r="46" fill={RED} />
          <path d="M100,26 A46,46 0 0 1 100,118 Z" fill={INK} />
          <rect x="24" y="126" width="152" height="8" fill={INK} />
        </>
      )}
      {k === 4 && (
        <>
          <rect x="30" y="56" width="140" height="14" fill={INK} />
          <rect x="30" y="84" width="96" height="14" fill={INK} />
          <rect x="30" y="112" width="58" height="14" fill={INK} />
          <circle cx="150" cy="34" r="22" fill={RED} />
        </>
      )}
      {k === 5 && (
        <>
          <circle cx="70" cy="60" r="34" fill={INK} />
          <circle cx="126" cy="88" r="34" fill={RED} />
          <circle cx="126" cy="88" r="14" fill={CREAM} />
        </>
      )}
    </svg>
  );
}

const BY_NO: Record<string, ComponentType<P>> = {
  "001": ArtVendetta,
  "002": ArtScroll,
  "004": ArtTeapot,
  "020": ArtBadge,
  "022": ArtHouse,
  "046": ArtBox,
  "005": ArtHouse,
};

export const hasArt = (no: string) => no in BY_NO;

export default function Art({ no, className = "" }: { no: string; className?: string }) {
  const C = BY_NO[no];
  if (C) return <C className={className} />;
  let h = 5;
  for (const c of no) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return <ArtPlain className={className} seed={h} />;
}
