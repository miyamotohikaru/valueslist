import type { Metadata } from "next";
import AboutPageView from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: "How to read | Values List",
  description:
    "How to read the Values List: the parts of a card, the two kinds of evidence, the trend stamps, the groups, and what gets cited.",
};

export default function AboutPageEn() {
  return <AboutPageView lang="en" />;
}
