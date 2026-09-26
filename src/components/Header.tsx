"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV = [
  { href: "/", no: "01", ja: "図鑑", en: "INDEX" },
  { href: "/timeline", no: "02", ja: "年表", en: "TIMELINE" },
  { href: "/lineage", no: "03", ja: "系譜", en: "LINEAGE" },
  { href: "/about", no: "04", ja: "読み方", en: "HOW TO READ" },
];

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" || pathname.startsWith("/values") : pathname.startsWith(href);
}

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="vl-head">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 md:px-10">
        <Link href="/" className="vl-head__brand">
          <span className="vl-head__mark" aria-hidden>
            V
          </span>
          <span className="vl-head__name">VALUES LIST</span>
        </Link>
        <nav className="vl-head__nav">
          {NAV.map((n) => {
            const active = isActivePath(pathname, n.href);
            return (
              <Link key={n.href} href={n.href} className={`vl-head__link${active ? " is-on" : ""}`}>
                <span className="vl-head__no">{n.no}</span>
                {n.ja}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
