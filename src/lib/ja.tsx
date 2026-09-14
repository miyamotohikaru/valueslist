import { Fragment } from "react";

/**
 * 和文を句点（。）で明示的に改行して描く。
 * 自動折り返しに任せず、文の切れ目で行を変えるための小道具。
 */
export function Ja({ text, className = "" }: { text: string; className?: string }) {
  const parts = text.split(/(?<=。)/).filter((s) => s.length > 0);
  return (
    <span className={className}>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {p}
          {i < parts.length - 1 && <br />}
        </Fragment>
      ))}
    </span>
  );
}
