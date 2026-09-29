import type { Metadata } from "next";
import LineagePageView from "@/components/pages/LineagePage";

export const metadata: Metadata = {
  title: "Lineage | Values List",
  description:
    "How a value that was discontinued comes back under another name. Each lineage taken apart, layer by layer.",
};

export default function LineagePageEn() {
  return <LineagePageView lang="en" />;
}
