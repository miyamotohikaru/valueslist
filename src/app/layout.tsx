import type { Metadata } from "next";
import {
  Anton,
  Alfa_Slab_One,
  Yellowtail,
  Courier_Prime,
  Dela_Gothic_One,
  Zen_Kaku_Gothic_New,
} from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const alfa = Alfa_Slab_One({ weight: "400", subsets: ["latin"], variable: "--font-alfa" });
const yellowtail = Yellowtail({ weight: "400", subsets: ["latin"], variable: "--font-yellowtail" });
const courier = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier",
});
const dela = Dela_Gothic_One({ weight: "400", subsets: ["latin"], variable: "--font-dela" });
const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen-kaku",
});

export const metadata: Metadata = {
  title: "価値観一覧図鑑 | Values Catalog",
  description: "その価値観には、製造年がある。日本の価値観を、製造・廃番・再入荷の年で並べる図鑑。",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body
        className={`${anton.variable} ${alfa.variable} ${yellowtail.variable} ${courier.variable} ${dela.variable} ${zenKaku.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
