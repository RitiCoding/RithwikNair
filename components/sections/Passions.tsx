import ParallaxImage from "../ParallaxImage";
import Reveal from "../Reveal";
import SectionHead from "../SectionHead";
import SplitText from "../SplitText";
import { passions } from "@/lib/content";

export default function Passions() {
  return (
    <section className="relative py-24 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead index={passions.index} label={passions.label} />

        <SplitText
          text={passions.headline}
          as="h2"
          drift={-70}
          className="display mt-10 max-w-[14ch] text-[clamp(2.4rem,8vw,7rem)] text-paper sm:mt-14"
        />

        <div className="mt-16 grid gap-x-10 gap-y-20 sm:mt-28 sm:grid-cols-2 sm:gap-y-36">
          {passions.items.map((item, i) => (
            <article
              key={item.no}
              // stagger the columns so the grid reads as a slope, not a table
              className={i % 2 === 1 ? "sm:mt-32" : undefined}
            >
              <Reveal y={40}>
                <ParallaxImage
                  src={item.image}
                  alt={item.alt}
                  ratio={item.ratio}
                  distance={80}
                  sizes="(max-width: 640px) 100vw, 46vw"
                />
              </Reveal>

              <Reveal delay={140} className="mt-7 flex gap-5 sm:mt-9">
                <span className="eyebrow shrink-0 pt-1.5 text-brand">{item.no}</span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-paper sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted sm:text-base">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
