import { Fragment } from "react";
import BreakText from "@/components/BreakText";

/**
 * 短い和文を句点（｡）で明示的に改行して描く｡◇（両方で改行）・◆（携帯だけ改行）の記号も開く｡
 * 句点の直後の ◇ は句点の改行と重なるので捨てる｡
 * 長い本文には使わない（本文は vl-justify で行を埋める）｡
 */
export function Ja({ text, className = "" }: { text: string; className?: string }) {
  const parts = text
    .replace(/([｡。])◇/g, "$1")
    .split(/(?<=[｡。])/)
    .filter((s) => s.length > 0);
  return (
    <span className={className}>
      {parts.map((p, i) => (
        <Fragment key={i}>
          <BreakText text={p} />
          {i < parts.length - 1 && <br />}
        </Fragment>
      ))}
    </span>
  );
}
