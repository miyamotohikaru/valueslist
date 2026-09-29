import type { Metadata } from "next";
import { enMeta } from "@/lib/meta-en";
import LineagePageView from "@/components/pages/LineagePage";

export const metadata: Metadata = enMeta({
  title: "Lineage",
  description:
    "How a value that was discontinued comes back under another name. Each lineage taken apart, layer by layer.",
  path: "/lineage",
});

export default function LineagePageEn() {
  return <LineagePageView lang="en" />;
}
