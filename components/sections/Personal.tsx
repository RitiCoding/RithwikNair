import PinnedGallery from "../PinnedGallery";
import Reveal from "../Reveal";
import SectionHead from "../SectionHead";
import SplitText from "../SplitText";
import { personal } from "@/lib/content";

export default function Personal() {
  return (
    <section className="relative border-t border-white/[0.06] py-24 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead index={personal.index} label={personal.label} />

        <div className="mt-10 grid gap-8 sm:mt-14 sm:grid-cols-12 sm:items-end">
          <SplitText
            text={personal.headline}
            as="h2"
            drift={-64}
            className="display text-[clamp(2.4rem,8vw,7rem)] text-paper sm:col-span-7"
          />
          <div className="space-y-5 sm:col-span-5">
            {personal.body.map((p, i) => (
              <Reveal
                key={i}
                as="p"
                delay={140 + i * 120}
                className="max-w-[46ch] text-base leading-relaxed text-muted"
              >
                {p}
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <PinnedGallery items={personal.gallery} />
    </section>
  );
}
