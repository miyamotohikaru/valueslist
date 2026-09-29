import { Fragment } from "react";
import { lineages } from "@/data/lineages";
import { localizeLineage } from "@/data/lineages.i18n";
import { type Lang } from "@/i18n/lang";
import { t } from "@/i18n/ui";
import LineageIndex from "@/components/LineageIndex";
import LineageDiagram from "@/components/LineageDiagram";

/** 系譜のページの中身｡日本語（/lineage）と英語（/en/lineage）で同じものを使う */
export default function LineagePage({ lang }: { lang: Lang }) {
  const list = lineages.map((l) => localizeLineage(l, lang));
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8">
      {/* 見出しと目次 */}
      <section className="grid gap-5 py-6 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-end lg:gap-12">
        <div>
          <h1 className="font-display-ja text-[26px] leading-[1.1] md:mt-4 md:text-[64px]">{t(lang, "lineageTitle")}</h1>
          <p className="font-display-en mt-1 text-[22px] leading-[1] tracking-[0.01em] text-vl-red md:vl-misreg md:mt-2 md:text-[92px] md:leading-[0.86]">
            {t(lang, "lineageEn")}
          </p>
        </div>
        <LineageIndex lineages={list} lang={lang} />
      </section>

      <div className="vl-rule" />

      {/* 系譜ごとの分解図 */}
      {list.map((l, i) => (
        <Fragment key={l.id}>
          <LineageDiagram lineage={l} index={i} lang={lang} />
          <div className="vl-rule" />
        </Fragment>
      ))}

      <div className="h-12 md:h-20" />
    </div>
  );
}
