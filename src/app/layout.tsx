import type { Metadata } from "next";
import {
  Anton,
  Alfa_Slab_One,
  Yellowtail,
  Courier_Prime,
  M_PLUS_Rounded_1c,
  Zen_Kaku_Gothic_New,
} from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TabBar from "@/components/TabBar";
import { SITE_URL, OG_IMAGE } from "@/lib/site";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const alfa = Alfa_Slab_One({ weight: "400", subsets: ["latin"], variable: "--font-alfa" });
const yellowtail = Yellowtail({ weight: "400", subsets: ["latin"], variable: "--font-yellowtail" });
const courier = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier",
});
// 見出しの和文。太くて読みやすい丸ゴシック（レトロな看板の字に近い）
const jaDisplay = M_PLUS_Rounded_1c({ weight: "800", subsets: ["latin"], variable: "--font-ja-display" });
const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen-kaku",
});

const DESCRIPTION =
  "その価値観には、製造年がある。日本の価値観を、製造・廃番・再入荷の年で棚に並べ、一次資料で裏を取った図鑑。";


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
        className={`${anton.variable} ${alfa.variable} ${yellowtail.variable} ${courier.variable} ${jaDisplay.variable} ${zenKaku.variable} vl-grain`}
      >
        <Header />
        <main className="pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
        <Footer />
        <TabBar />
      </body>
    </html>
  );
}
