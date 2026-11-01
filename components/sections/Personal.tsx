"use client";

import { useEffect, useRef } from "react";
import Media from "../ui/Media";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";
import Title from "../ui/Title";
import { personal } from "@/lib/content";
import { useDesktop, useReducedMotion } from "@/lib/hooks";
import { addTask, clamp, damp, frameDelta } from "@/lib/ticker";

/** Tallest frame height in the pinned row; the others are a share of it. */
const STAGE = "min(64vh, 620px)";

/**
 * On wide screens the section becomes a scroll track: it's as tall as the
 * row's overhang, its contents stick to the top, and vertical scroll drives
 * the row sideways. Narrow screens and reduced motion get a plain column.
 */
export default function Personal() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const desktop = useDesktop();
  const reduced = useReducedMotion();
  const pin = desktop && !reduced;

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!pin || !section || !track) return;

    let travel = 0;
    let x = 0;
    let target = 0;
    let progress = 0;
    let visible = false;

    // the row's overhang past the viewport is exactly how much extra page
    // height the section needs to scroll it through
    const fit = () => {
      travel = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${window.innerHeight + travel}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(track);
    window.addEventListener("resize", fit);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(section);

    const stop = addTask({
      measure() {
        if (!visible) return;
        const r = section.getBoundingClientRect();
        progress = clamp(-r.top / Math.max(1, r.height - window.innerHeight));
        target = -progress * travel;
      },
      apply() {
        if (!visible) return;
        x = damp(x, target, 12, frameDelta());
        track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
        if (barRef.current) barRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      },
    });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", fit);
      section.style.height = "";
      track.style.transform = "";
    };
  }, [pin]);

  return (
    <section
      ref={sectionRef}
      data-chapter={personal.label}
      data-chapter-index={personal.index}
      className="relative z-10 bg-ink"
    >
      <div className={pin ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden" : "section-pad"}>
        <div
          ref={trackRef}
          className={
            pin
              ? "flex w-max items-end gap-[clamp(2rem,4vw,4.5rem)] px-[var(--gutter)] will-change-transform"
              : "shell flex flex-col gap-14"
          }
        >
          <div className={pin ? "w-[min(30rem,34vw)] shrink-0 pb-[2.4rem]" : ""}>
            <SectionHead index={personal.index} label={personal.label} />
            <Title text={personal.title} className="t-h2 mt-10" />
            <Reveal as="p" className="t-body mt-8 max-w-[30ch]" delay={150}>
              {personal.body}
            </Reveal>
          </div>

          {personal.gallery.map((g, i) => (
            <figure key={g.src} className="shrink-0">
              <Media
                src={g.src}
                alt={g.alt}
                ratio={g.ratio}
                focus={g.focus}
                zoom={0.06}
                distance={pin ? 0 : 50}
                delay={i * 80}
                sizes="(min-width: 768px) 40vw, 100vw"
                style={pin ? { height: `calc(${STAGE} * ${g.height})` } : undefined}
              />
              <figcaption className="t-label mt-4 flex items-center gap-3">
                <span className="block h-px w-5 bg-brand" aria-hidden />
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        {pin ? (
          <div className="shell mt-14">
            <div className="h-px bg-line">
              <div ref={barRef} className="h-full origin-left scale-x-0 bg-brand" />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
