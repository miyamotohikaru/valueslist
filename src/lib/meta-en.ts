import type { Metadata } from "next";
import { SITE_URL, OG_IMAGE } from "./site";

/**
 * 英語ページの見出しと説明｡
 * 大もと（layout.tsx）の openGraph は日本語なので､英語のページでは
 * 上書きしないと共有したときに日本語の見出しが出る｡
 */
export function enMeta({
  title,
  description,
  path = "",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const full = `${title} | Values List`;
  return {
    title: full,
    description,
    alternates: { canonical: `${SITE_URL}/en${path}` },
    openGraph: {
      title: full,
      description,
      siteName: "Values List",
      url: `${SITE_URL}/en${path}`,
      locale: "en_US",
      type: "website",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Values List" }],
    },
    twitter: { card: "summary_large_image", title: full, description, images: [OG_IMAGE] },
  };
}
