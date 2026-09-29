"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { langOf, path, stripLang, type Lang } from "@/i18n/lang";
import { t, UI } from "@/i18n/ui";

export const NAV = [
  { href: "/", no: "01", key: "navIndex", sub: "navIndexSub" },
  { href: "/timeline", no: "02", key: "navTimeline", sub: "navTimelineSub" },
  { href: "/lineage", no: "03", key: "navLineage", sub: "navLineageSub" },
  { href: "/about", no: "04", key: "navAbout", sub: "navAboutSub" },
] as const;

export function isActivePath(pathname: string, href: string) {
  const p = stripLang(pathname);
  return href === "/" ? p === "/" || p.startsWith("/values") : p.startsWith(href);
}

/** 日本語と英語の切り替え｡いま見ているページのまま移る */
export function LangSwitch({ lang, className = "" }: { lang: Lang; className?: string }) {
  const pathname = usePathname();
  const here = stripLang(pathname);
  return (
    <span className={`vl-lang ${className}`}>
      {(["ja", "en"] as Lang[]).map((l) => (
        <Link
          key={l}
          href={path(l, here)}
          className={`vl-lang__btn${l === lang ? " is-on" : ""}`}
          hrefLang={l}
          aria-current={l === lang ? "true" : undefined}
        >
          {l === "ja" ? "JA" : "EN"}
        </Link>
      ))}
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const lang = langOf(pathname);
  return (
    <header className="vl-head">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 md:px-10">
        <Link href={path(lang, "/")} className="vl-head__brand">
          <span className="vl-head__mark" aria-hidden>
            V
          </span>
          <span className="vl-head__name">{UI.siteName[lang]}</span>
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <nav className="vl-head__nav">
            {NAV.map((n) => {
              const active = isActivePath(pathname, n.href);
              return (
                <Link key={n.href} href={path(lang, n.href)} className={`vl-head__link${active ? " is-on" : ""}`}>
                  <span className="vl-head__no">{n.no}</span>
                  {t(lang, n.key)}
                </Link>
              );
            })}
          </nav>
          <LangSwitch lang={lang} />
        </div>
      </div>
    </header>
  );
}
