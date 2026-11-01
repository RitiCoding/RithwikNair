import Counter from "../ui/Counter";
import Media from "../ui/Media";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";
import Title from "../ui/Title";
import { work, type WorkEntry } from "@/lib/content";

function Highlights({ items }: { items: string[] }) {
  return (
    <ul className="highlights">
      {items.map((h, i) => (
        <li key={h} className="text-[0.95rem] leading-snug text-paper">
          <span className="t-label tabular pt-[0.2em] text-dim">{String(i + 1).padStart(2, "0")}</span>
          <span>{h}</span>
        </li>
      ))}
    </ul>
  );
}

function Meta({ entry }: { entry: WorkEntry }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
      <span className="t-label tabular text-brand">{entry.no}</span>
      <span className="t-label">{entry.program}</span>
    </div>
  );
}

function Heading({ entry }: { entry: WorkEntry }) {
  return (
    <>
      <p className="t-label mt-8 text-paper">{entry.short}</p>
      <h3 className="t-h3 mt-3">{entry.team}</h3>
      {entry.role ? (
        <p className="mt-4 text-[1.02rem] font-medium tracking-[-0.01em] text-brand">{entry.role}</p>
      ) : null}
    </>
  );
}

/** Images in an equal-height band, then the details underneath. */
function RowEntry({ entry }: { entry: WorkEntry }) {
  return (
    <article className="border-t border-line pt-10 md:pt-14">
      <div className="grid grid-cols-12 gap-x-[var(--gap)]">
        <Reveal className="col-span-12 md:col-span-7" y={20}>
          <Meta entry={entry} />
          <Heading entry={entry} />
        </Reveal>
      </div>

      <div className="media-row mt-10 md:mt-14">
        {entry.media.map((m, i) => (
          <Media
            key={m.src}
            src={m.src}
            alt={m.alt}
            ratio={m.ratio}
            focus={m.focus}
            delay={i * 110}
            zoom={i === 0 ? 0.12 : 0.06}
            distance={i === 0 ? 70 : 44}
            sizes={i === 0 ? "(min-width: 768px) 55vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
            style={{ flexGrow: m.ratio }}
          />
        ))}
      </div>

      <div className="mt-10 grid grid-cols-12 gap-x-[var(--gap)] gap-y-10 md:mt-14">
        <Reveal as="p" className="t-body col-span-12 md:col-span-5" y={18}>
          {entry.body}
        </Reveal>
        <Reveal className="col-span-12 md:col-span-6 md:col-start-7" delay={100} y={18}>
          <Highlights items={entry.highlights} />
        </Reveal>
      </div>
    </article>
  );
}

/**
 * Column placement at md and up for [image, details]: a landscape image gets
 * the wider column, and a flipped entry puts the image on the right. Phones
 * always stack the image first.
 */
const SPLIT = {
  tall: [
    ["md:col-span-5", "md:col-span-6 md:col-start-7"],
    ["md:col-span-5 md:col-start-8 md:row-start-1", "md:col-span-6 md:col-start-1 md:row-start-1"],
  ],
  wide: [
    ["md:col-span-6", "md:col-span-5 md:col-start-8"],
    ["md:col-span-6 md:col-start-7 md:row-start-1", "md:col-span-5 md:col-start-1 md:row-start-1"],
  ],
};

/** One image beside the details. */
function SplitEntry({ entry, flip }: { entry: WorkEntry; flip: boolean }) {
  const m = entry.media[0];
  const wide = m.ratio >= 1;
  const [mediaCols, textCols] = SPLIT[wide ? "wide" : "tall"][flip ? 1 : 0];
  return (
    <article className="grid grid-cols-12 gap-x-[var(--gap)] gap-y-10 border-t border-line pt-10 md:pt-14">
      <div className={`col-span-12 ${mediaCols}`}>
        <Media
          src={m.src}
          alt={m.alt}
          ratio={m.ratio}
          focus={m.focus}
          zoom={0.1}
          sizes={wide ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 40vw, 100vw"}
        />
      </div>
      <div className={`col-span-12 flex flex-col ${textCols}`}>
        <Reveal y={20}>
          <Meta entry={entry} />
          <Heading entry={entry} />
        </Reveal>
        <Reveal as="p" className="t-body mt-8 max-w-[44ch]" delay={80} y={18}>
          {entry.body}
        </Reveal>
        <Reveal className="mt-10 md:mt-auto" delay={140} y={18}>
          <Highlights items={entry.highlights} />
        </Reveal>
      </div>
    </article>
  );
}

export default function Work() {
  // split entries alternate sides
  let splits = 0;

  return (
    <section data-chapter={work.label} data-chapter-index={work.index} className="relative z-10 bg-ink">
      <div className="shell section-pad">
        <SectionHead index={work.index} label={work.label} />

        <div className="mt-10 grid grid-cols-12 gap-x-[var(--gap)] gap-y-8 md:mt-14 md:items-end">
          <Title text={work.title} className="t-h2 col-span-12 md:col-span-7" />
          <Reveal as="p" className="t-body col-span-12 max-w-[40ch] md:col-span-4 md:col-start-9" delay={150}>
            {work.intro}
          </Reveal>
        </div>

        <dl className="mt-16 grid grid-cols-3 border-y border-line md:mt-24">
          {work.stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 110}
              y={16}
              className={`flex flex-col-reverse gap-4 py-8 md:py-12 ${i > 0 ? "border-l border-line pl-4 md:pl-8" : "pr-4"}`}
            >
              <dt className="t-label">{s.label}</dt>
              <dd>
                <Counter value={s.value} className="stat-num tabular block" />
              </dd>
            </Reveal>
          ))}
        </dl>

        <div className="mt-24 space-y-28 md:mt-36 md:space-y-40">
          {work.entries.map((entry) =>
            entry.layout === "split" ? (
              <SplitEntry key={entry.no} entry={entry} flip={splits++ % 2 === 1} />
            ) : (
              <RowEntry key={entry.no} entry={entry} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
