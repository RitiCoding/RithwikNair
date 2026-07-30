"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { addTask, clamp } from "./ticker";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return coarse;
}

/**
 * Adds `is-in` once the element crosses into view. One-way by design, because
 * content that re-hides on scroll-up reads as a glitch rather than an effect.
 */
export function useInView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { threshold = 0.18, rootMargin = "0px 0px -12% 0px" } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-in");
        io.disconnect();
        // release the compositor hint once the transition has settled
        window.setTimeout(() => el.classList.add("reveal-done"), 2200);
      },
      { threshold, rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin]);
}

type ParallaxOptions = {
  /** Total travel in px across the element's full pass through the viewport. */
  distance?: number;
  /** Constant overscale that gives the drift room to move inside its frame. */
  baseScale?: number;
  /** Extra scale at mid-pass, e.g. 0.04 → up to +4%. */
  zoom?: number;
  axis?: "y" | "x";
};

/**
 * Maps an element's progress through the viewport onto a transform.
 * Progress is 0 as the element's top touches the bottom of the screen and
 * 1 once its bottom clears the top.
 */
export function useParallax<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { distance = 90, baseScale = 1, zoom = 0, axis = "y" }: ParallaxOptions = {},
) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // nothing to animate, so don't take a slot in the frame loop
    if (distance === 0 && zoom === 0 && baseScale === 1) return;

    if (reduced) {
      el.style.transform = `scale(${baseScale})`;
      return () => {
        el.style.transform = "";
      };
    }

    let progress = 0.5;
    let visible = true;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      rootMargin: "20% 0px 20% 0px",
    });
    io.observe(el);

    const stop = addTask({
      measure() {
        if (!visible) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        progress = clamp((vh - rect.top) / (vh + rect.height));
      },
      apply() {
        if (!visible) return;
        const offset = (progress - 0.5) * distance;
        const scale = baseScale + zoom * (1 - Math.abs(progress - 0.5) * 2);
        const move =
          axis === "y"
            ? `translate3d(0, ${offset.toFixed(2)}px, 0)`
            : `translate3d(${offset.toFixed(2)}px, 0, 0)`;
        el.style.transform = `${move} scale(${scale.toFixed(4)})`;
      },
    });

    return () => {
      io.disconnect();
      stop();
      el.style.transform = "";
    };
  }, [ref, distance, baseScale, zoom, axis, reduced]);
}

/** Scroll progress of the whole document, 0 → 1. */
export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let p = 0;
    return addTask({
      measure() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        p = max > 0 ? clamp(window.scrollY / max) : 0;
      },
      apply() {
        el.style.transform = `scaleX(${p.toFixed(4)})`;
      },
    });
  }, []);

  return ref;
}
