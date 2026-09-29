import type { Metadata } from "next";
import Link from "next/link";
import { path, type Lang } from "@/i18n/lang";
import { tAbout } from "@/i18n/ui.about";
import { Ja } from "@/lib/ja";

export const metadata: Metadata = {
  title: "見つかりません | 価値観一覧表",
};

/**
 * 404 — 品切れ札｡
 * 吊り紐＋穴あきの札に､ゴム印｢OUT OF STOCK｣｡索引へ戻す｡
 *
 * この札は /en/... で出ることもあるが､Next.js の not-found には道筋が渡らず
 * （usePathname も使えない）言語が分からない｡なので日本語で出す｡
 * 文言はすべて辞書から引いてあるので､言語が分かるようになれば lang を変えるだけでよい｡
 */
const LANG: Lang = "ja";

export default function NotFound() {
  const lang = LANG;
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-24">
      <div className="mx-auto max-w-[520px]">
        {/* 吊り紐 */}
        <div className="flex justify-center" aria-hidden>
          <div className="h-10 w-[2px] bg-vl-ink md:h-14" />
        </div>

        {/* 札 */}
        <article className="vl-offset relative rotate-[-1.5deg] border-2 border-vl-ink bg-vl-card">
          {/* 穴 */}
          <span
            aria-hidden
            className="absolute left-1/2 top-3 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-vl-ink bg-vl-paper"
          />
          <div className="flex items-center justify-between px-5 pt-3 text-[12px] font-bold text-vl-ink-soft">
            <span className="font-type tracking-[0.1em]">NO.404</span>
            <span>{tAbout(lang, "nfTag")}</span>
          </div>

          <div className="px-6 pb-8 pt-6 text-center md:px-10 md:pb-10">
            <span className="vl-stamp font-display-en text-[22px] text-vl-red md:text-[26px]">× OUT OF STOCK</span>

            <h1 className="font-display-ja mt-6 text-[24px] leading-[1.3] md:text-[30px]">
              {tAbout(lang, "nfTitle1")}
              <br />
              {tAbout(lang, "nfTitle2")}
            </h1>
            <p className="font-display-en mt-2 text-[15px] tracking-[0.2em] text-vl-red-deep md:text-[17px]">
              NO SUCH ITEM ON THE SHELVES
            </p>

            <p className="mt-6 text-[13px] leading-[1.95] text-vl-ink-soft md:text-[14px]">
              <Ja text={tAbout(lang, "nfBody")} />
            </p>

            <Link
              href={path(lang, "/")}
              className="vl-offset-sm mt-8 inline-flex items-baseline gap-3 border-2 border-vl-ink bg-vl-ink px-5 py-3 text-[14px] font-bold text-vl-paper hover:bg-vl-red"
            >
              {tAbout(lang, "nfBack")} <span className="font-display-en text-[14px] tracking-[0.12em]">INDEX →</span>
            </Link>
          </div>

          <div className="vl-checker h-[10px] w-full opacity-90" aria-hidden />
        </article>
      </div>
    </div>
  );
}
