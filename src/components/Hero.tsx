import Link from "next/link";
import { values, stats } from "@/data/values";
import ValueCard from "./ValueCard";

/** 表紙｡墨の地に大きな見出しと､3枚の札を重ねて置く */
export default function Hero() {
  const picks = ["001", "046", "004"].map((no) => values.find((v) => v.no === no)!).filter(Boolean);

  return (
    <section className="vl-hero">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <p className="vl-hero__kicker">CATALOGUE OF JAPANESE VALUES / VOL.01</p>
        <h1 className="vl-hero__title">
          その価値観には､
          <br />
          製造年がある｡
        </h1>
        <p className="vl-hero__lead">
          日本の価値観を､製造・廃番・再入荷の年で棚に並べ､
          <br />
          一次資料で裏を取った図鑑｡全{stats.total}点｡
        </p>

        <div className="vl-hero__btns">
          <a href="#index" className="vl-btn vl-btn--fill">
            図鑑をひらく <span aria-hidden>→</span>
          </a>
          <Link href="/timeline" className="vl-btn vl-btn--line">
            年表で見る
          </Link>
        </div>

        <div className="vl-hero__cards" aria-hidden>
          {picks.map((v, i) => (
            <div key={v.no} className="vl-hero__card" style={{ ["--i" as string]: i }}>
              <ValueCard v={v} interactive={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
