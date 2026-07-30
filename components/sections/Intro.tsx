import Marquee from "../Marquee";
import Reveal from "../Reveal";
import SectionHead from "../SectionHead";
import SplitText from "../SplitText";
import { intro } from "@/lib/content";

export default function Intro() {
  return (
    <section className="relative py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead index={intro.index} label={intro.label} />

        <SplitText
          text={intro.headline}
          as="h2"
          className="mt-10 max-w-[18ch] text-[clamp(1.9rem,5.4vw,4.4rem)] font-semibold leading-[1.03] tracking-[-0.035em] text-paper sm:mt-14"
        />

        <div className="mt-12 grid gap-8 sm:mt-20 sm:grid-cols-12">
          <div className="flex flex-col gap-7 sm:col-start-6 sm:col-end-12">
            {intro.body.map((p, i) => (
              <Reveal
                key={i}
                as="p"
                delay={120 * i}
                className="max-w-[58ch] text-base leading-relaxed text-muted sm:text-lg"
              >
                {p}
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20 sm:mt-32">
        <Marquee items={intro.marquee} />
      </div>
    </section>
  );
}
