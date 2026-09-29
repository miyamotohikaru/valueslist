import type { Metadata } from "next";
import { enMeta } from "@/lib/meta-en";
import AboutPageView from "@/components/pages/AboutPage";

export const metadata: Metadata = enMeta({
  title: "How to read",
  description:
    "How to read the Values List: the parts of a card, the two kinds of evidence, the trend stamps, the groups, and what gets cited.",
  path: "/about",
});

export default function AboutPageEn() {
  return <AboutPageView lang="en" />;
}
