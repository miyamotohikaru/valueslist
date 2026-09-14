"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, isActivePath } from "./Header";

/** 携帯の下部タブ */
export default function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-vl-ink bg-vl-paper md:hidden">
      <ul className="grid grid-cols-4">
        {NAV.map((n) => {
          const active = isActivePath(pathname, n.href);
          return (
            <li key={n.href}>
              <Link
                href={n.href}
                className={`flex flex-col items-center py-2 leading-none ${
                  active ? "bg-vl-ink text-vl-paper" : "text-vl-ink"
                }`}
              >
                <span className="text-[13px] font-bold tracking-[0.15em]">{n.ja}</span>
                <span className="font-display-en mt-1 text-[9px] tracking-[0.15em] opacity-70">
                  {n.en}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
