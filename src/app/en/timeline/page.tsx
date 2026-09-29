import type { Metadata } from "next";
import TimelineView from "@/components/TimelineView";

export const metadata: Metadata = {
  title: "Timeline | Values List",
  description:
    "Japanese values in the order they were made. Made, ended and back in stock, as bars on one scale of time.",
};

export default function TimelinePageEn() {
  return <TimelineView lang="en" />;
}
