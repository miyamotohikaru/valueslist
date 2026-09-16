/**
 * 小さなラベル。欧文・数字の部分だけをタイプライター体（字間あり）で組み、
 * 和文の部分は本文の書体のまま字間を付けない（Courier に和文の字形はない）。
 *   <TypeLabel text="FIG.2 · 日付の帳票" />
 */
export default function TypeLabel({ text, tracking = "0.1em" }: { text: string; tracking?: string }) {
  const parts = text.split(/([\x20-\x7e·]+)/).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        /^[\x20-\x7e·]+$/.test(p) ? (
          <span key={i} className="font-type" style={{ letterSpacing: tracking }}>
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
