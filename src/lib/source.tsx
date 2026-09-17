import { Fragment } from "react";

/**
 * 出典の文字列（｢資料名 https://… ／ 書名, 年｣のように混ざっている）を読みやすく描く｡
 * - URL はドメイン名だけの短いリンクにする（全文は href に残る）
 * - compact: 図の出典欄など狭い場所用｡URL を落として資料名だけにする（名前がないときはドメイン名）
 */
const URL_RE = /https?:\/\/[^\s（(｢『）)｣』，,､；;<>]+/g;

export function splitSources(s: string): string[] {
  return s
    .split(/\s*(?:／|；|;)\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function host(u: string) {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u.slice(0, 32);
  }
}

function Part({ part, compact }: { part: string; compact: boolean }) {
  const urls = part.match(URL_RE) ?? [];
  const text = part.replace(URL_RE, "").replace(/[\s（(]+[）)]\s*$/, "").replace(/\s{2,}/g, " ").trim();
  if (compact) return <>{text || (urls[0] ? host(urls[0]) : part)}</>;
  return (
    <>
      {text}
      {urls.map((u, i) => (
        <Fragment key={i}>
          {text || i > 0 ? " " : ""}
          <a href={u} className="vl-link whitespace-nowrap" target="_blank" rel="noreferrer">
            {host(u)}↗
          </a>
        </Fragment>
      ))}
    </>
  );
}

export function SourceText({ s, compact = false }: { s: string; compact?: boolean }) {
  const parts = splitSources(s);
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="text-vl-ink-soft"> ／ </span>}
          <Part part={p} compact={compact} />
        </Fragment>
      ))}
    </>
  );
}
