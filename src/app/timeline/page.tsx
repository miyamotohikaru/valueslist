import type { Metadata } from "next";
import TimelineView from "@/components/TimelineView";

export const metadata: Metadata = {
  title: "年表 | 価値観一覧図鑑",
  description:
    "日本の価値観を製造年の順に並べた年表。製造・廃番・再入荷を、ひとつの時間軸の上の帯で見る。",
};

export default function TimelinePage() {
  return <TimelineView />;
}
