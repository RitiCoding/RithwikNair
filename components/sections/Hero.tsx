"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import RevealPortrait from "../RevealPortrait";
import Marquee from "../ui/Marquee";
import { currentRoles, hero, site } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";
import { addTask, clamp } from "@/lib/ticker";

/** The baked portraits put the head's centre 28.7% of the way down the frame. */
const HEAD_AT = 0.287;

/**
 * The opening scene. It stays pinned while the About section slides up over it,
 * dimming and settling back as it's covered. The name runs behind the cut-out
 * portrait, so it passes behind the shoulders.
 */
export default function Hero() {
  const portraitRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const [touched, setTouched] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let p = 0;
    let last = -1;

    return addTask({
      measure() {
        p = clamp(window.scrollY / (window.innerHeight || 1));
      },
      apply() {
        if (p === last) return;
        last = p;
        if (portraitRef.current) {
          portraitRef.current.style.transform = `translate3d(-50%, ${(-p * 60).toFixed(1)}px, 0) scale(${(1 - p * 0.08).toFixed(4)})`;
        }
        if (shadeRef.current) shadeRef.current.style.opacity = (p * 0.85).toFixed(3);
        if (footRef.current) footRef.current.style.opacity = clamp(1 - p * 2.2).toFixed(3);
      },
    });
  }, [reduced]);

  const handleTouch = useCallback(() => setTouched(true), []);

  return (
    <section
      data-chapter="Intro"
      data-chapter-index="00"
      className="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden bg-ink"
    >
      <h1 className="sr-only">
        {site.name}. {site.tagline}.
      </h1>

      {/* a low red horizon behind the figure */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[12%] h-[80%]"
        style={{
          background:
            "radial-gradient(52% 46% at 50% 52%, rgba(255,51,34,0.17), rgba(255,51,34,0.03) 48%, transparent 72%)",
        }}
      />

      {/* the name, running behind the portrait */}
      <div aria-hidden className="absolute inset-x-0 top-[63svh] z-10 -translate-y-1/2 overflow-hidden">
        <div className="enter-mask" style={{ "--d": "80ms" } as React.CSSProperties}>
          <Marquee speed={46}>
            {[0, 1].map((k) => (
              // the type size lives on the wrapper so the separator, sized in em, scales with the name
              <span key={k} className="t-hero flex items-center text-paper">
                <span className="whitespace-nowrap pr-[0.06em]">{hero.marquee}</span>
                <span className="hero-sep" />
              </span>
            ))}
          </Marquee>
        </div>
      </div>

      {/* sized off the viewport and anchored by the head, so the face holds
          still while the frame scales; centring lives in the inline transform,
          because Tailwind's translate utilities would compound with it */}
      <div
        ref={portraitRef}
        className="absolute left-1/2 z-20 will-change-transform"
        style={
          {
            "--ph": "min(96svh, 142vw)",
            height: "var(--ph)",
            top: `calc(38svh - ${HEAD_AT} * var(--ph))`,
            transform: "translate3d(-50%, 0, 0)",
          } as React.CSSProperties
        }
      >
        <div className="enter-clip h-full" style={{ "--d": "180ms" } as React.CSSProperties}>
          <RevealPortrait className="h-full" label="Drag" onTouch={handleTouch} />
        </div>
      </div>

      <div ref={footRef} className="absolute inset-x-0 bottom-0 z-30">
        <div className="shell flex items-end justify-between gap-8 pb-7 md:pb-9">
          <div className="enter-fade" style={{ "--d": "620ms" } as React.CSSProperties}>
            <p className="flex items-center gap-3 text-[clamp(1.05rem,1.5vw,1.35rem)] font-medium tracking-[-0.02em]">
              <span className="block h-[7px] w-[7px] rotate-45 bg-brand" aria-hidden />
              {site.tagline}
            </p>
            <ul className="mt-4 space-y-1.5">
              {currentRoles.map((r) => (
                <li key={r.team} className="t-label">
                  {r.role} <span className="text-dim">·</span> <span className="text-paper">{r.team}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* phones get the roles full width; swiping needs no cue there */}
          <div
            className="enter-fade hidden items-end gap-7 pb-0.5 sm:flex"
            style={{ "--d": "720ms" } as React.CSSProperties}
          >
            <span
              className={`t-label transition-opacity duration-700 ${touched ? "opacity-0" : "opacity-100"}`}
            >
              {hero.hint}
            </span>
            <span className="t-label flex items-center gap-3 text-paper">
              {hero.scroll}
              <span className="relative block h-9 w-px overflow-hidden bg-white/15" aria-hidden>
                <span className="scroll-cue absolute inset-x-0 top-0 h-1/3 bg-brand" />
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* darkens the scene as the next section slides over it */}
      <div ref={shadeRef} aria-hidden className="pointer-events-none absolute inset-0 z-40 bg-ink opacity-0" />
    </section>
  );
}
