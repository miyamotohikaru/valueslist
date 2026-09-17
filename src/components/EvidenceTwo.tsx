import { evidenceMeta } from "@/data/shelves";
import { Ja } from "@/lib/ja";
import { values } from "@/data/values";

const noOf = (name: string) => values.find((v) => v.name === name)?.no ?? "—";

/**
 * ｢証拠の二種｣— 年を特定する方法を､2枚のパネルで並べて説明する図｡
 * 左: 法令・初出型（日付という｢点｣）／右: カーブ型（統計という｢線｣）｡
 * アイコンは赤の線画（分解図と同じ調子）｡
 */
const RED = "var(--vl-red)";
const INK = "var(--vl-ink)";
const PAPER = "var(--vl-card)";
const MONO = "var(--font-courier), monospace";
const ANTON = "var(--font-anton), Impact, sans-serif";

/** 日付のゴム印（持ち手と､押した跡） */
function StampIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      {/* 持ち手 */}
      <rect x="49" y="4" width="22" height="15" rx="6" fill={RED} />
      <rect x="56" y="17" width="8" height="10" fill={RED} />
      <polygon points="30,27 90,27 96,39 24,39" fill={RED} />
      {/* 押した跡 */}
      <g transform="rotate(-5 60 70)">
        <rect x="18" y="52" width="84" height="36" rx="5" fill="none" stroke={RED} strokeWidth="2.4" />
        <rect x="22.5" y="56.5" width="75" height="27" rx="3" fill="none" stroke={RED} strokeWidth="1" />
        <text
          x="60"
          y="76.5"
          textAnchor="middle"
          fontSize="16"
          fontFamily={ANTON}
          fill={RED}
          letterSpacing="1"
        >
          1873.02.07
        </text>
      </g>
      {/* インクの飛び */}
      <circle cx="13" cy="46" r="1.4" fill={RED} opacity="0.55" />
      <circle cx="108" cy="47" r="1.1" fill={RED} opacity="0.55" />
      <circle cx="110" cy="92" r="1.6" fill={RED} opacity="0.45" />
      <circle cx="10" cy="93" r="1.1" fill={RED} opacity="0.45" />
    </svg>
  );
}

/** 折れ線（賛成率が下がる線） */
function CurveIcon({ className = "" }: { className?: string }) {
  const pts: [number, number][] = [
    [26, 22],
    [42, 30],
    [58, 36],
    [74, 47],
    [90, 57],
    [104, 66],
  ];
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <defs>
        <pattern id="ev2-dots" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1" fill={RED} opacity="0.45" />
        </pattern>
      </defs>
      {/* 軸と目盛 */}
      <path d="M18,10 V80 H112" fill="none" stroke={INK} strokeWidth="1.6" />
      {[28, 46, 64].map((y) => (
        <line key={y} x1="15" x2="21" y1={y} y2={y} stroke={INK} strokeWidth="1" />
      ))}
      {/* 線の下の網点 */}
      <path d={`${d} L104,80 L26,80 Z`} fill="url(#ev2-dots)" />
      {/* 折れ線 */}
      <path d={d} fill="none" stroke={RED} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3" fill={PAPER} stroke={RED} strokeWidth="2" />
      ))}
    </svg>
  );
}

type PanelProps = {
  ja: string;
  en: string;
  icon: React.ReactNode;
  head: string;
  lead: string;
  specimenNo: string;
  specimenName: string;
  specimenBig: React.ReactNode;
  specimenNote: string;
};

function Panel({ ja, en, icon, head, lead, specimenNo, specimenName, specimenBig, specimenNote }: PanelProps) {
  return (
    <article className="vl-offset flex flex-col border-2 border-vl-ink bg-vl-card">
      {/* 帯 */}
      <div className="flex items-center justify-between gap-3 bg-vl-ink px-4 py-2 text-vl-paper">
        <span className="text-[14px] font-bold">{ja}</span>
        <span className="font-display-en text-[13px] tracking-[0.12em] text-vl-mustard">{en}</span>
      </div>

      {/* 図と説明 */}
      <div className="grid grid-cols-[64px_1fr] items-start gap-4 px-4 pt-5 pb-4 md:grid-cols-[108px_1fr] md:px-5">
        <div className="w-full">{icon}</div>
        <div>
          <p className="font-display-ja text-[20px] leading-tight md:text-[22px]">{head}</p>
          <p className="mt-2 text-[14px] leading-[1.9]">
            <Ja text={lead} />
          </p>
        </div>
      </div>

      {/* 標本 */}
      <div className="mx-4 mb-4 mt-auto border-2 border-dashed border-vl-line px-4 py-3 md:mx-5 md:mb-5">
        <p className="flex flex-wrap items-baseline gap-x-2 text-[12px]">
          <span className="whitespace-nowrap font-bold text-vl-red-deep">NO.{specimenNo}</span>
          <span className="font-bold">{specimenName}</span>
        </p>
        <p className="font-display-en mt-1 text-[30px] leading-none tracking-[0.02em] md:text-[34px]">{specimenBig}</p>
        <p className="mt-2 text-[13px] font-bold leading-[1.6]">
          <Ja text={specimenNote} />
        </p>
      </div>
    </article>
  );
}

export default function EvidenceTwo({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid gap-8 md:grid-cols-2 md:gap-6">
        <Panel
          ja={evidenceMeta.law.ja}
          en={evidenceMeta.law.en}
          icon={<StampIcon className="w-full" />}
          head="｢点｣で語る"
          lead="禁止令の日付､翻訳語の初出､◆制度の廃止年｡年月日まで特定できる一点で､◆製造か廃番の年を決める｡"
          specimenNo={noOf("仇討ち")}
          specimenName="仇討ち"
          specimenBig="1873.02.07"
          specimenNote="太政官布告第37号（復讐禁止令）"
        />
        <Panel
          ja={evidenceMeta.curve.ja}
          en={evidenceMeta.curve.en}
          icon={<CurveIcon className="w-full" />}
          head="｢線｣で語る"
          lead="世論調査の賛成率､統計の推移｡実際の数値を結んだ線で､◆上昇か下落かを決める｡"
          specimenNo={noOf("夫は外で働き､妻は家庭を守る")}
          specimenName="夫は外で働き､妻は家庭を守る"
          specimenBig={
            <>
              72.6<span className="text-[0.55em]">%</span>
              <span className="mx-2 text-vl-red">→</span>
              33.1<span className="text-[0.55em]">%</span>
            </>
          }
          specimenNote="賛成の計 1979 → 2024◆〔総理府・内閣府の世論調査〕｡◇2022年から郵送調査に変わったため､◆前後は単純に比べられない｡"
        />
      </div>

      {/* 注記 */}
      <div className="mt-6 flex flex-col gap-2 border-t-2 border-vl-ink pt-3 md:flex-row md:items-baseline md:justify-between">
        <p className="text-[14px] leading-[1.9]">
          前近代の項目に賛成率の欄を置くと嘘になるので､
          <br />
          項目ページの図を､二種に分けた｡
        </p>
      </div>
    </div>
  );
}
