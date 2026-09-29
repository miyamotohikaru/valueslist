"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, isActivePath } from "./Header";
import { langOf, path } from "@/i18n/lang";
import { t } from "@/i18n/ui";

/** 携帯の下部タブ */
export default function TabBar() {
  const pathname = usePathname();
  const lang = langOf(pathname);
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-vl-ink bg-vl-paper md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4 items-stretch">
        {NAV.map((n) => {
          const active = isActivePath(pathname, n.href);
          return (
            <li key={n.href}>
              <Link
                href={path(lang, n.href)}
                className={`flex h-full flex-col items-center justify-center py-2 text-center leading-none ${
                  active ? "bg-vl-ink text-vl-paper" : "text-vl-ink"
                }`}
              >
                <span className="text-center text-[13px] leading-[1.25] font-bold tracking-[0.15em]">{t(lang, n.key)}</span>
                {/* 英語は上下とも英語になって幅に入らないので､下の行は日本語のときだけ */}
                {lang === "ja" && (
                  <span className="font-display-en mt-1 text-[11px] tracking-[0.1em] opacity-80">
                    {t(lang, n.sub)}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
