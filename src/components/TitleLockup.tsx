/** 題字｡3行の幅をそろえて組む（欧文は字面ごと伸ばして､字間のばらつきを出さない） */
export default function TitleLockup({ className = "block h-auto w-full max-w-[520px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 460 332" className={className} role="img" aria-label="価値観一覧図鑑 VALUES CATALOG">
      <text x="0" y="62" fontSize="64" textLength="456" lengthAdjust="spacing" fill="var(--vl-ink)" fontFamily="var(--font-ja-display), sans-serif">
        価値観一覧図鑑
      </text>
      {[
        { t: "VALUES", y: 200 },
        { t: "CATALOG", y: 317 },
      ].map(({ t, y }) => (
        <g key={t} fontFamily="var(--font-anton), Impact, sans-serif" fontSize="136">
          {/* 2色刷りの版ずれ（墨が先に刷られ､赤が少しずれて乗る） */}
          <text x="5" y={y + 5} textLength="456" lengthAdjust="spacingAndGlyphs" fill="var(--vl-ink)" fillOpacity="0.92">
            {t}
          </text>
          <text x="0" y={y} textLength="456" lengthAdjust="spacingAndGlyphs" fill="var(--vl-red)">
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}
