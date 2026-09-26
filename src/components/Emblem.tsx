/**
 * 円形の紋章｡円周に回した文字と､中央の｢No.14｣｡赤とクリームの2色＋墨の縁｡
 * サイトの｢顔｣として､ヒーロー・フッター・共有画像で使い回す｡
 */
export default function Emblem({
  size = 160,
  className = "",
  ring = "VALUES CATALOG · 価値観一覧図鑑 · FACT-CHECKED ·",
}: {
  size?: number;
  className?: string;
  ring?: string;
}) {
  const pid = `vl-emblem-ring-${size}`;
  const star = (cx: number, cy: number, r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 === 0 ? r : r * 0.42;
      const a = (Math.PI * i) / 5 - Math.PI / 2;
      pts.push(`${(cx + Math.cos(a) * rr).toFixed(2)},${(cy + Math.sin(a) * rr).toFixed(2)}`);
    }
    return pts.join(" ");
  };
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label="価値観一覧図鑑 情報を並べるシリーズ No.14">
      <defs>
        <path id={pid} d="M100,100 m-73,0 a73,73 0 1,1 146,0 a73,73 0 1,1 -146,0" />
      </defs>
      <circle cx="100" cy="100" r="97" fill="var(--vl-red)" stroke="var(--vl-ink)" strokeWidth="3" />
      <circle cx="100" cy="100" r="89" fill="none" stroke="var(--vl-paper)" strokeWidth="1.6" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="var(--vl-paper)" strokeWidth="1.6" />
      <text
        className="vl-emblem-ring"
        fill="var(--vl-paper)"
        fontSize="16.5"
        fontFamily="var(--font-sans), sans-serif"
        letterSpacing="1.2"
      >
        <textPath href={`#${pid}`} startOffset="0" textLength="452" lengthAdjust="spacingAndGlyphs">
          {ring}
        </textPath>
      </text>
      <circle cx="100" cy="100" r="51" fill="var(--vl-paper)" stroke="var(--vl-ink)" strokeWidth="2.5" />
      <text x="100" y="86" textAnchor="middle" fontSize="13" letterSpacing="2" fill="var(--vl-ink)" fontFamily="var(--font-sans), sans-serif">
        SERIES No.
      </text>
      <text x="100" y="131" textAnchor="middle" fontSize="48" fill="var(--vl-red)" fontFamily="var(--font-sans), sans-serif">
        14
      </text>
      <polygon points={star(66, 112, 8)} fill="var(--vl-ink)" />
      <polygon points={star(134, 112, 8)} fill="var(--vl-ink)" />
    </svg>
  );
}
