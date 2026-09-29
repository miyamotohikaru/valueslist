import type { Metadata } from "next";
import { values } from "@/data/values";
import IndexView from "@/components/IndexView";

export const metadata: Metadata = {
  title: "Values List",
  description:
    "Every value has a year it was made. Japanese values set out by the year each was made, ended or came back, with the record behind each date.",
};

export default function HomeEn() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 md:px-10">
      <IndexView values={values} lang="en" />
    </div>
  );
}
