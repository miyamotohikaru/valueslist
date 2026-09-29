import type { Metadata } from "next";
import { enMeta } from "@/lib/meta-en";
import TimelineView from "@/components/TimelineView";

export const metadata: Metadata = enMeta({
  title: "Timeline",
  description:
    "Japanese values in the order they were made. Made, ended and back in stock, as bars on one scale of time.",
  path: "/timeline",
});

export default function TimelinePageEn() {
  return <TimelineView lang="en" />;
}
