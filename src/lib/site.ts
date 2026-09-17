import { OG_VERSION } from "@/app/og-version";

export const SITE_URL = "https://valueslist.vercel.app";
export const SITE_NAME = "価値観一覧図鑑";
// 共有したときに出る絵｡版下は /og-card､焼き直しは node tools/shoot-og.mjs
export const OG_IMAGE = `${SITE_URL}/og.png?v=${OG_VERSION}`;
