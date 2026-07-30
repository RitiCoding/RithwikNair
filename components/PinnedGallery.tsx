"use client";

import { useEffect, useRef, useState } from "react";
import ParallaxImage from "./ParallaxImage";
import { useReducedMotion } from "@/lib/hooks";
import { addTask, clamp, damp } from "@/lib/ticker";

type Shot = {
  image: string;
  alt: string;
  caption: string;
  span: string;
};

const WIDTH: Record<string, string> = {
  tall: "w-[clamp(240px,26vw,380px)]",
  wide: "w-[clamp(320px,42vw,660px)]",
  small: "w-[clamp(220px,22vw,320px)]",
};

const RATIO: Record<string, string> = {
  tall: "3/4",
  wide: "16/10",
  small: "1/1",
};

/**
 * The section becomes a scroll track: it is taller than the viewport, its
 * contents stick to the top, and vertical scroll is remapped onto horizontal
 * travel across the photos. Below the breakpoint (and under reduced motion) it
 * degrades to an ordinary swipeable row, which needs no pinning to work.
 */
export default function PinnedGallery({ items }: { items: Shot[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [pin, setPin] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setPin(mq.matches && !reduced);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduced]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!pin || !section || !track) return;

    let travel = 0;
    let x = 0;
    let targetX = 0;
    let progress = 0;

    // the track's overhang past the viewport is exactly how much extra page
    // height the section needs in order to scroll it through
    const fit = () => {
      travel = Math.max(0, track.scrollWidth - window.innerWidth + 48);
      section.style.height = `${window.innerHeight + travel}px`;
    };
    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(track);
    window.addEventListener("resize", fit);

    const stop = addTask({
      measure() {
        const r = section.getBoundingClientRect();
        progress = clamp(-r.top / Math.max(1, r.height - window.innerHeight));
        targetX = -progress * travel;
      },
      apply() {
        x = damp(x, targetX, 14);
        track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
        if (barRef.current) barRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      },
    });

    return () => {
      stop();
      ro.disconnect();
      window.removeEventListener("resize", fit);
      section.style.height = "";
      track.style.transform = "";
    };
  }, [pin]);

  return (
    <div ref={sectionRef} className="relative mt-16 sm:mt-24">
      <div
        className={
          pin
            ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden"
            : "overflow-x-auto pb-4 [scrollbar-width:none]"
        }
      >
        <div
          ref={trackRef}
          className={`flex w-max gap-4 px-5 sm:gap-6 sm:px-8 ${
            pin ? "will-change-transform" : "snap-x snap-mandatory"
          }`}
        >
          {items.map((shot, i) => (
            <figure
              key={shot.image}
              className={`${WIDTH[shot.span] ?? WIDTH.small} shrink-0 ${
                pin ? "" : "snap-start"
              } ${i % 2 === 1 ? "sm:translate-y-10" : ""}`}
            >
              <ParallaxImage
                src={shot.image}
                alt={shot.alt}
                ratio={RATIO[shot.span] ?? "4/3"}
                distance={44}
                delay={60}
                sizes="(max-width: 768px) 70vw, 34vw"
              />
              <figcaption className="mt-3 flex items-center gap-2.5 text-xs text-faint">
                <span className="h-px w-4 bg-brand/70" />
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        {pin ? (
          <div className="mx-5 mt-10 h-px bg-white/10 sm:mx-8">
            <div ref={barRef} className="h-full origin-left scale-x-0 bg-brand" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
