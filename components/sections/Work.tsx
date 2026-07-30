import Counter from "../Counter";
import ParallaxImage from "../ParallaxImage";
import Reveal from "../Reveal";
import SectionHead from "../SectionHead";
import SplitText from "../SplitText";
import { work } from "@/lib/content";

export default function Work() {
  return (
    <section className="relative border-t border-white/[0.06] py-24 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead index={work.index} label={work.label} />

        <div className="mt-10 grid gap-8 sm:mt-14 sm:grid-cols-12 sm:items-end">
          <SplitText
            text={work.headline}
            as="h2"
            drift={64}
            className="display text-[clamp(2.4rem,8vw,7rem)] text-paper sm:col-span-7"
          />
          <Reveal
            as="p"
            delay={160}
            className="max-w-[46ch] text-base leading-relaxed text-muted sm:col-span-5 sm:text-lg"
          >
            {work.intro}
          </Reveal>
        </div>

        {/* stat row */}
        <div className="mt-16 grid grid-cols-3 gap-4 border-y border-white/[0.06] py-8 sm:mt-24 sm:py-12">
          {work.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 110} y={20} className="text-center sm:text-left">
              <Counter
                value={stat.value}
                className="display block text-[clamp(2rem,6vw,4.5rem)] text-brand"
              />
              <div className="eyebrow mt-2">{stat.label}</div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 space-y-28 sm:mt-32 sm:space-y-44">
          {work.entries.map((entry, i) => (
            <article
              key={entry.no}
              className="grid gap-8 sm:grid-cols-12 sm:items-center sm:gap-12"
            >
              <Reveal
                y={44}
                className={
                  i % 2 === 0
                    ? "sm:col-span-6 sm:col-start-1"
                    : "sm:col-span-6 sm:col-start-7 sm:row-start-1"
                }
              >
                <ParallaxImage
                  src={entry.image}
                  alt={entry.alt}
                  ratio={entry.ratio}
                  distance={90}
                  sizes="(max-width: 640px) 100vw, 48vw"
                />
              </Reveal>

              <div
                className={
                  i % 2 === 0
                    ? "sm:col-span-5 sm:col-start-8"
                    : "sm:col-span-5 sm:col-start-1 sm:row-start-1"
                }
              >
                <Reveal delay={120}>
                  <div className="flex items-baseline gap-4">
                    <span className="eyebrow text-brand">{entry.no}</span>
                    <span className="eyebrow">{entry.years}</span>
                  </div>

                  <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-paper sm:text-3xl">
                    {entry.team}
                  </h3>
                  <p className="mt-2 text-sm text-brand">{entry.role}</p>

                  <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-muted">
                    {entry.body}
                  </p>

                  <ul className="mt-8 space-y-0">
                    {entry.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-3 border-t border-white/[0.07] py-3 text-sm text-paper/80"
                      >
                        <span className="mt-[0.55em] block h-1 w-1 shrink-0 rounded-full bg-brand" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
