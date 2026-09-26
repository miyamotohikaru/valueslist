import { values } from "@/data/values";
import IndexView from "@/components/IndexView";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <IndexView values={values} />
      </div>
    </>
  );
}
