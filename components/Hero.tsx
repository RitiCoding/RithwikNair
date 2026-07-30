"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import RevealPortrait from "./RevealPortrait";
import { hero, site } from "@/lib/content";
import { addTask, clamp } from "@/lib/ticker";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Full-bleed opening: the portrait is sized off the viewport and anchored by the
 * subject's head, so the face stays put while the frame grows. The wordmark sits
 * behind it, and the cut-out portraits let the type read around the shoulders.
 * Scrolling away lifts the portrait and pushes the two halves of the name apart.
 */

// the baked portraits put the head centre at 28.7% of frame height
const HEAD_AT = 0.287;

export default function Hero() {
  const portraitRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [touched, setTouched] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let p = 0;

    return addTask({
      measure() {
        p = clamp(window.scrollY / (window.innerHeight || 1));
      },
      apply() {
        const eased = p * p;

        if (portraitRef.current) {
          portraitRef.current.style.transform = `translate3d(-50%, ${(-p * 120).toFixed(
            1,
          )}px, 0) scale(${(1 - eased * 0.07).toFixed(4)})`;
          // hold the portrait a little longer than a square falloff would, so the
          // scroll shear has time to read before it fades out
          portraitRef.current.style.opacity = String(clamp(1 - Math.pow(p, 2.6) * 1.15));
        }
        if (leftRef.current) {
          leftRef.current.style.transform = `translate3d(${(-p * 18).toFixed(1)}vw, 0, 0)`;
        }
        if (rightRef.current) {
          rightRef.current.style.transform = `translate3d(${(p * 18).toFixed(1)}vw, 0, 0)`;
        }
        const fade = String(clamp(1 - p * 2.4));
        if (topRef.current) topRef.current.style.opacity = fade;
        if (bottomRef.current) bottomRef.current.style.opacity = fade;
      },
    });
  }, [reduced]);

  const handleTouch = useCallback(() => setTouched(true), []);

  const mark = hero.wordmark.toUpperCase();
  const split = Math.ceil(mark.length / 2);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {/* faint red horizon behind everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-[80vh] -translate-y-1/2"
        style={{
          background:
            "radial-gradient(58% 48% at 50% 50%, rgba(255,33,24,0.2), rgba(255,33,24,0.03) 46%, transparent 72%)",
        }}
      />

      <h1
        aria-label={hero.wordmark}
        className="display pointer-events-none absolute inset-x-0 top-[63svh] z-10 flex -translate-y-1/2 justify-center text-[clamp(3.5rem,18.5vw,17rem)] text-paper/90"
      >
        <span ref={leftRef} className="inline-block will-change-transform">
          {mark.slice(0, split)}
        </span>
        <span ref={rightRef} className="inline-block will-change-transform">
          {mark.slice(split)}
        </span>
      </h1>

      <div
        ref={portraitRef}
        // centring lives in the inline transform, not a utility class, because
        // Tailwind's -translate-x-1/2 sets `translate` and would compound with it
        className="absolute left-1/2 z-20 will-change-transform"
        style={{
          // cap by width too, so the subject doesn't overrun a narrow screen
          ["--ph" as string]: "min(96svh, 142vw)",
          height: "var(--ph)",
          top: `calc(38svh - ${HEAD_AT} * var(--ph))`,
          transform: "translate3d(-50%, 0, 0)",
        }}
      >
        <RevealPortrait className="h-full" onTouch={handleTouch} />
      </div>

      <div
        ref={topRef}
        className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-6 px-5 pt-8 sm:px-8"
      >
        <span className="eyebrow">{hero.eyebrow}</span>
        <span className="eyebrow hidden sm:block">2026</span>
      </div>

      <div
        ref={bottomRef}
        className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-6 px-5 pb-8 sm:px-8"
      >
        <p className="max-w-[24ch] text-sm leading-snug text-muted sm:max-w-[34ch] sm:text-base">
          {site.tagline}
        </p>

        <div className="flex items-center gap-6">
          <span
            className={`eyebrow hidden items-center gap-2 transition-opacity duration-700 sm:flex ${
              touched ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
            {hero.hint}
          </span>

          <span className="eyebrow flex items-center gap-3">
            {hero.scroll}
            <span className="relative block h-8 w-px overflow-hidden bg-paper/20">
              <span className="absolute inset-x-0 top-0 h-3 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-brand" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
