import raw from "./values.json";
import type { Value, ShelfId } from "./types";

export const values: Value[] = (raw as Value[]).slice().sort((a, b) => a.no.localeCompare(b.no));

export const byNo = (no: string) => values.find((v) => v.no === no);

export const byShelf = (shelf: ShelfId) => values.filter((v) => v.shelf === shelf);

export const stats = {
  total: values.length,
  shelves: 5,
  law: values.filter((v) => v.evidence === "law").length,
  curve: values.filter((v) => v.evidence === "curve").length,
  discontinued: values.filter((v) => v.trend === "discontinued").length,
  restocked: values.filter((v) => v.trend === "restocked").length,
};

/** 製造年（概算含む）で昇順 */
export const byMadeYear = () =>
  values
    .filter((v) => v.made)
    .slice()
    .sort((a, b) => (a.made!.year - b.made!.year) || a.no.localeCompare(b.no));

export const prevNext = (no: string) => {
  const i = values.findIndex((v) => v.no === no);
  return {
    prev: i > 0 ? values[i - 1] : null,
    next: i >= 0 && i < values.length - 1 ? values[i + 1] : null,
  };
};
