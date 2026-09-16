# 価値観一覧図鑑 / Values Catalog

「情報を並べるシリーズ」14。日本の価値観（規範・人生観・判断基準）を、
製造年・廃番年・再入荷年で棚に並べる図鑑。姉妹サイト: 消滅職業図鑑 / 診断名アーカイブ。

- 本番: https://valueslist.vercel.app （Vercel プロジェクト `valueslist` / team kosukuma-dev / master が本番）
- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4。env 不要。

## 開発

```bash
npm ci
npm run dev -- --port 3014
```

## 構成

- `src/data/values.json` … 全カード（裏取り済み）。`scripts/merge-research.mjs` で研究JSONから生成し、手で整える。
- `src/data/lineages.ts` … 系譜（再入荷のライン）。`ref` はカードの `name` を指す。
- `src/data/shelves.ts` … 棚・傾向・分類・証拠タイプのメタ情報。
- `src/lib/timescale.ts` … 年→位置の区分線形スケール（中世〜近世を圧縮）。
- `src/lib/ja.tsx` … `<Ja>`: 和文を句点で明示改行して描く。
- ページ: `/`（索引・棚）`/values/[no]`（詳細）`/timeline`（年表）`/lineage`（系譜）`/about`（読み方）

## 共有時の絵（OGP）

`/og-card` が 1200×630 の版下。焼き方:

```bash
node ~/.claude/skills/shot/shot.mjs http://localhost:3014/og-card --w 1200 --vh 630 --viewport --scale 1 --pc --name og
# → og-1200.png を public/og.png にコピーし、src/app/layout.tsx の OG_VERSION を上げる
```

## デザイン

アメリカンレトロ（1950-60s のカタログ／ダイナー／レコードショップ）。
トークンは `src/app/globals.css`。写真は使わず、すべて SVG / CSS。
