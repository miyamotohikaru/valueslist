/** 題字。3行の幅をそろえるため SVG の textLength で組む（字間で幅を合わせる） */
export default function TitleLockup({ className = "block h-auto w-full max-w-[520px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 460 318" className={className} role="img" aria-label="価値観一覧図鑑 VALUES CATALOG">
      <text x="0" y="62" fontSize="64" textLength="456" lengthAdjust="spacing" fill="var(--vl-ink)" fontFamily="var(--font-dela), sans-serif">
        価値観一覧図鑑
      </text>
      {[
        { t: "VALUES", y: 190 },
        { t: "CATALOG", y: 312 },
      ].map(({ t, y }) => (
        <g key={t} fontFamily="var(--font-anton), Impact, sans-serif" fontSize="136">
          {/* 2色刷りの版ずれ（紺が先に刷られ、赤が少しずれて乗る） */}
          <text x="6" y={y + 6} textLength="452" lengthAdjust="spacing" fill="var(--vl-navy)">
            {t}
          </text>
          <text x="0" y={y} textLength="452" lengthAdjust="spacing" fill="var(--vl-red)">
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}
