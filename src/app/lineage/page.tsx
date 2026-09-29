import type { Metadata } from "next";
import LineagePageView from "@/components/pages/LineagePage";

export const metadata: Metadata = {
  title: "系譜 | 価値観一覧図鑑",
  description: "失効になった価値観が､別の名前で復活するまでの道筋｡系譜ごとに層へ分解して並べる｡",
};

export default function LineagePage() {
  return <LineagePageView lang="ja" />;
}
