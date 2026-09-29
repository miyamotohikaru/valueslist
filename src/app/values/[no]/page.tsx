import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OG_IMAGE, SITE_NAME } from "@/lib/site";
import { values, byNo } from "@/data/values";
import ValuePageView from "@/components/pages/ValuePage";

type Params = { params: Promise<{ no: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return values.map((v) => ({ no: v.no }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { no } = await params;
  const v = byNo(no);
  if (!v) return {};
  return {
    title: `${v.name} | 価値観一覧図鑑`,
    description: v.hitokoto,
    openGraph: {
      title: SITE_NAME,
      description: v.hitokoto,
      url: `/values/${v.no}`,
      siteName: SITE_NAME,
      locale: "ja_JP",
      type: "article",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", title: SITE_NAME, description: v.hitokoto, images: [OG_IMAGE] },
  };
}

export default async function ValuePage({ params }: Params) {
  const { no } = await params;
  const v = byNo(no);
  if (!v) notFound();
  return <ValuePageView v={v} lang="ja" />;
}
