import type { Metadata } from "next";
import { Noto_Sans_JP, Roboto_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TabBar from "@/components/TabBar";
import { SITE_URL, OG_IMAGE } from "@/lib/site";
import "./globals.css";

/**
 * 書体は2つだけ｡
 * - 和文と欧文の本体: Noto Sans JP（400/500/700/900）
 * - 小さなラベルと番号: Roboto Mono（400/500）
 */
const sans = Noto_Sans_JP({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = Roboto_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const DESCRIPTION =
  "その価値観には､製造年がある｡日本の価値観を､製造・廃番・再入荷の年で棚に並べ､一次資料で裏を取った図鑑｡";


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "価値観一覧図鑑 | Values Catalog",
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    title: "価値観一覧図鑑",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "価値観一覧図鑑",
    locale: "ja_JP",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "価値観一覧図鑑" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "価値観一覧図鑑",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body
        className={`${sans.variable} ${mono.variable}`}
      >
        <Header />
        <main className="pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
        <Footer />
        <TabBar />
      </body>
    </html>
  );
}
