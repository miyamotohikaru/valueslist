"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV = [
  { href: "/", ja: "索引", en: "INDEX" },
  { href: "/timeline", ja: "年表", en: "TIMELINE" },
  { href: "/lineage", ja: "系譜", en: "LINEAGE" },
  { href: "/about", ja: "読み方", en: "HOW TO READ" },
];

export function isActivePath(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/" || pathname.startsWith("/values")
    : pathname.startsWith(href);
}

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 bg-vl-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-display-en bg-vl-red px-2 py-1 text-[13px] leading-none tracking-[0.12em] text-vl-paper">
            No.14
          </span>
          <span className="font-display-ja text-[18px] leading-none md:text-[20px]">価値観一覧図鑑</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => {
            const active = isActivePath(pathname, n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex flex-col items-center leading-none ${
                  active ? "text-vl-red" : "text-vl-ink hover:text-vl-red"
                }`}
              >
                <span className="text-[14px] font-bold tracking-[0.2em]">{n.ja}</span>
                <span
                  className={`font-display-en mt-1 text-[11px] tracking-[0.14em] ${
                    active ? "border-b-2 border-vl-red" : "text-vl-ink-soft"
                  }`}
                >
                  {n.en}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="vl-rule" />
    </header>
  );
}
