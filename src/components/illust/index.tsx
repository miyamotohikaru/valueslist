import type { ComponentType } from "react";
import Vendetta from "./Vendetta";
import LoyaltyFilial from "./LoyaltyFilial";
import Shudo from "./Shudo";
import Inkyo from "./Inkyo";

/**
 * 型番ごとの図版。まだ描いていない型番は null を返す（カードは図版なしで組む）。
 * 図は viewBox 160×160 の正方形。色は墨・クリーム・朱の3色だけ。
 */
const ILLUST: Record<string, ComponentType<{ className?: string }>> = {
  "001": Vendetta,
  "002": LoyaltyFilial,
  "003": Shudo,
  "004": Inkyo,
};

export const hasIllust = (no: string) => no in ILLUST;

export default function Illust({ no, className = "" }: { no: string; className?: string }) {
  const C = ILLUST[no];
  if (!C) return null;
  return <C className={className} />;
}
