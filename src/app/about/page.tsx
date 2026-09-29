import type { Metadata } from "next";
import AboutPageView from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: "読み方 | 価値観一覧図鑑",
  description:
    "価値観一覧表の読み方｡カードの構造､証拠の二種､傾向の印､グループの分け方､出典の方針｡",
};

export default function AboutPage() {
  return <AboutPageView lang="ja" />;
}
