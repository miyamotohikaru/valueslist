import Link from "next/link";
import { stats } from "@/data/values";

const SERIES = [
  { name: "消滅職業図鑑", href: "https://vanished-jobs-archive.kosukuma.com/" },
  { name: "診断名アーカイブ", href: "https://diagnosis-archive.vercel.app/" },
];
const READ = [
  { name: "図鑑", href: "/" },
  { name: "年表", href: "/timeline" },
  { name: "系譜", href: "/lineage" },
  { name: "読み方", href: "/about" },
];

export default function Footer() {
  return (
    <footer className="vl-foot">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="vl-foot__grid">
          <div>
            <p className="vl-foot__brand">
              <span className="vl-head__mark" aria-hidden>
                V
              </span>
              VALUES LIST
            </p>
            <p className="vl-foot__lead">
              日本の価値観を､製造・廃番・再入荷の年で並べる図鑑｡
              <br />
              全{stats.total}点｡年号と出典は各項目に記載｡
            </p>
          </div>
          <nav>
            <p className="vl-foot__k">この図鑑</p>
            <ul>
              {READ.map((r) => (
                <li key={r.href}>
                  <Link href={r.href}>{r.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav>
            <p className="vl-foot__k">情報を並べるシリーズ</p>
            <ul>
              {SERIES.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.name} ↗
                  </a>
                </li>
              ))}
              <li className="is-self">価値観一覧図鑑</li>
            </ul>
          </nav>
        </div>
        <p className="vl-foot__copy">© kosukuma · 情報を並べるシリーズ 14</p>
      </div>
    </footer>
  );
}
