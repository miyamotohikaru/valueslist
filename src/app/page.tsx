import { values } from "@/data/values";
import IndexView from "@/components/IndexView";

export default function Home() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 md:px-10">
      <IndexView values={values} />
    </div>
  );
}
