import type { Metadata } from "next";
import TimelineView from "@/components/TimelineView";

export const metadata: Metadata = {
  title: "年表 | 価値観一覧表",
  description:
    "日本の価値観を成立年の順に並べた年表｡成立・失効・復活を､ひとつの時間軸の上の帯で見る｡",
};

export default function TimelinePage() {
  return <TimelineView lang="ja" />;
}
