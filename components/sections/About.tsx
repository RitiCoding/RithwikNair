import Marquee from "../ui/Marquee";
import Media from "../ui/Media";
import Reveal from "../ui/Reveal";
import ScrubText from "../ui/ScrubText";
import SectionHead from "../ui/SectionHead";
import Title from "../ui/Title";
import { about, currentRoles, disciplines, site } from "@/lib/content";

export default function About() {
  const facts = [
    { label: "Currently", items: currentRoles.map((r) => `${r.role}, ${r.team}`) },
    { label: "Focus", items: about.focus },
  ];

  return (
    <section data-chapter={about.label} data-chapter-index={about.index} className="sheet-over relative z-10 bg-ink">
      <div className="shell section-pad">
        <SectionHead index={about.index} label={about.label} />

        <Title text={about.title} className="t-h2 mt-10 max-w-[13ch] md:mt-14" />

        {/* the photo sits beside the statement and the facts; phones read statement, photo, facts */}
        <div className="mt-16 grid grid-cols-12 gap-x-[var(--gap)] gap-y-14 md:mt-28">
          <ScrubText
            text={about.statement}
            className="t-lead col-span-12 text-paper md:col-span-8 md:col-start-5 md:row-start-1"
          />

          <figure className="col-span-12 sm:col-span-8 md:col-span-4 md:col-start-1 md:row-span-2 md:row-start-1 lg:col-span-3">
            <Media
              src={about.photo.src}
              alt={about.photo.alt}
              ratio={about.photo.ratio}
              zoom={0.06}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
            />
            <figcaption className="t-label mt-4 flex items-center gap-3">
              <span className="block h-px w-5 bg-brand" aria-hidden />
              {about.photo.caption}
            </figcaption>
          </figure>

          <dl className="col-span-12 grid grid-cols-2 gap-x-[var(--gap)] gap-y-10 md:col-span-8 md:col-start-5 md:row-start-2 lg:grid-cols-[1.5fr_1fr_1fr]">
            {facts.map((f, i) => (
              <Reveal key={f.label} delay={i * 90} y={18}>
                <dt className="t-label">{f.label}</dt>
                <dd className="mt-3 space-y-1.5 text-[0.98rem] leading-snug text-paper">
                  {f.items.map((item) => (
                    <span key={item} className="block">
                      {item}
                    </span>
                  ))}
                </dd>
              </Reveal>
            ))}
            <Reveal delay={180} y={18}>
              <dt className="t-label">Contact</dt>
              <dd className="mt-3 text-[0.98rem] text-paper">
                <a href={`mailto:${site.email}`} className="link-line">
                  {site.email}
                </a>
              </dd>
            </Reveal>
          </dl>
        </div>
      </div>

      <div className="border-y border-line py-7 md:py-9">
        <Marquee speed={34} reverse>
          {disciplines.map((d) => (
            <span key={d} className="flex items-center">
              <span className="accent whitespace-nowrap px-[0.5em] text-[clamp(2rem,4.6vw,4.5rem)] leading-none text-mute">
                {d}
              </span>
              <span className="block h-[6px] w-[6px] rotate-45 bg-brand" aria-hidden />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="h-[var(--section)]" aria-hidden />
    </section>
  );
}
