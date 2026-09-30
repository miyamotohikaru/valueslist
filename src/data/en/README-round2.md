# 追加76枚（049〜124）の英訳

`values.json` の日本語を英語に直して、`part-7.json` 以降に置く。
読むときに重ねる仕組みなので、**訳の無い項目は日本語のまま出る**（i18n.ts）。

## 形

```json
{
  "049": {
    "name": "Imperial Exams",
    "reading": "keju",
    "hitokoto": "…",
    "meaning": "…",
    "body": ["…", "…", "…"],
    "made": { "label": "…", "fact": "…" },
    "discontinued": { "label": "…", "fact": "…" },
    "restocked": { "label": "…", "fact": "…", "as": "…" },
    "keyfacts": [{ "text": "…" }, …],
    "curve": { "title": "…", "subtitle": "…", "unit": "…", "note": "…", "series": ["…"], "marks": ["…"] }
  }
}
```

- `name` は **`values.json` の `en` をそのまま**入れる（札の題。すでに短く整えてある）
- `reading` は**ローマ字**。日本のものは読みのローマ字（katakiuchi）、
  外国のものは**その国の言葉のローマ字**（keju / yangban / chanzu / dongseong dongbon）
- `keyfacts` は日本語と**同じ順・同じ数**。`source` は入れない（日本語側のものを使う）
- `body` は3段落。段落の数も同じ
- 無い項目（`restocked` が null など）は書かない

## 文体（part-1〜6 に合わせる）

- **事実と日付を落とさない。** 法令名・条文番号・機関名・数字は残す
- 直訳しない。英語として読める文にする。ただし**飾らない**。短く、言い切る
- 固有名は英語の通用形（太政官布告 → Grand Council Proclamation、
  優生保護法 → Eugenic Protection Law）。初出で原語を括弧で添えてよい
- 日本語側の「｡､｢｣」は英語では通常の `.` `,` `"` にする
