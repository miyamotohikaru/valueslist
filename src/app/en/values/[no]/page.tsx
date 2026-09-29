import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OG_IMAGE } from "@/lib/site";
import { values, byNo } from "@/data/values";
import { localize } from "@/data/i18n";
import ValuePageView from "@/components/pages/ValuePage";

const SITE = "Values List";

type Params = { params: Promise<{ no: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return values.map((v) => ({ no: v.no }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { no } = await params;
  const raw = byNo(no);
  if (!raw) return {};
  // 題も一文も英訳から取る（訳が入るまでは日本語のまま）
  const v = localize(raw, "en");
  return {
    title: `${v.name} | ${SITE}`,
    description: v.hitokoto,
    openGraph: {
      title: SITE,
      description: v.hitokoto,
      url: `/en/values/${v.no}`,
      siteName: SITE,
      locale: "en_US",
      type: "article",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE }],
    },
    twitter: { card: "summary_large_image", title: SITE, description: v.hitokoto, images: [OG_IMAGE] },
  };
}

export default async function ValuePageEn({ params }: Params) {
  const { no } = await params;
  const v = byNo(no);
  if (!v) notFound();
  return <ValuePageView v={v} lang="en" />;
}
