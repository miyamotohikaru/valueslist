import type { ComponentType } from "react";
import Vendetta001 from "./Vendetta001";

/** 図版の描けた札だけ､新しい面で出す（今は NO.001 のみ） */
export const PLATE_ART: Record<string, ComponentType<{ className?: string }>> = {
  "001": Vendetta001,
};

export const hasPlate = (no: string) => no in PLATE_ART;
