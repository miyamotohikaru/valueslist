import Link from "next/link";
import Emblem from "./Emblem";

const SERIES = [
  { name: "消滅職業図鑑", href: "https://vanished-jobs-archive.kosukuma.com/" },
  { name: "診断名アーカイブ", href: "https://diagnosis-archive.vercel.app/" },
];

export default function Footer() {
  return (
    <footer className="mt-20">
      <div className="vl-checker h-[18px] w-full opacity-90" />
      <div className="bg-vl-navy text-vl-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_1fr_1fr] md:px-8">
          <div className="flex items-start gap-5">
            <Emblem size={96} className="block h-auto w-[84px] shrink-0 rotate-[-8deg] md:w-[96px]" />
            <div>
              <p className="font-display-en text-[40px] leading-[0.9] tracking-[0.02em] md:text-[52px]">
                VALUES
                <br />
                CATALOG
              </p>
              <p className="font-display-ja mt-3 text-[18px]">価値観一覧図鑑</p>
              <p className="mt-4 text-[13px] leading-[1.8] text-vl-paper/90">
                日本の価値観を、
                <br />
                製造・廃番・再入荷の年で並べる図鑑。
                <br />
                年号と出典は各項目に記載。
                <br />
                数値は各調査の公表値。
              </p>
            </div>
          </div>
          <div>
            <p className="text-[12px] font-bold tracking-[0.08em] text-vl-mustard">情報を並べるシリーズ</p>
            <ul className="mt-3 space-y-2 text-[13px]">
              {SERIES.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="vl-link" target="_blank" rel="noreferrer">
                    {s.name}
                  </a>
                </li>
              ))}
              <li className="text-vl-paper/60">価値観一覧図鑑（このサイト）</li>
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-bold tracking-[0.08em] text-vl-mustard">この店の読み方</p>
            <ul className="mt-3 space-y-2 text-[13px]">
              <li>
                <Link href="/about#evidence" className="vl-link">
                  証拠の二種
                </Link>
              </li>
              <li>
                <Link href="/about#trend" className="vl-link">
                  傾向の印
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="vl-link">
                  製造年順の年表
                </Link>
              </li>
              <li>
                <Link href="/lineage" className="vl-link">
                  再入荷の系譜
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-vl-paper/20">
          <p className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-2 gap-y-1 px-4 py-4 text-[12px] text-vl-paper/75 md:px-8">
            <span className="font-type tracking-[0.1em]">© kosukuma</span>
            <span aria-hidden>·</span>
            <span className="font-bold">情報を並べるシリーズ 14</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
