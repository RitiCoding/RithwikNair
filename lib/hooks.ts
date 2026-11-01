"use client";

import { useEffect, useState, type RefObject } from "react";
import { addTask, clamp } from "./ticker";

function useMedia(query: string) {
  const [match, setMatch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatch(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);

  return match;
}

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)");
export const useDesktop = () => useMedia("(min-width: 768px)");

/**
 * Adds `is-in` once the element crosses into view. One-way by design: content
 * that re-hides on scroll-up reads as a glitch rather than an effect.
 *
 * Never point this at an element that is itself clipped by a `clip-path`: the
 * clip collapses its intersection rectangle, so the threshold is never reached.
 * Observe an unclipped parent instead.
 */
export function useInView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { threshold = 0.2, rootMargin = "0px 0px -10% 0px" } = {},
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
      },
      { threshold, rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin]);
}

type MotionOptions = {
  /** Parallax travel in px over the frame's whole pass through the viewport. */
  distance?: number;
  /** Extra scale on entry that settles to rest as the frame reaches mid-screen. */
  zoom?: number;
};

/**
 * Moves an image inside its frame as the page scrolls. The image is overscaled,
 * and the drift is clamped to that overscan, so an edge can never slide into
 * view however the numbers are tuned.
 */
export function useMediaMotion(
  imgRef: RefObject<HTMLElement | null>,
  frameRef: RefObject<HTMLElement | null>,
  { distance = 60, zoom = 0 }: MotionOptions = {},
) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const img = imgRef.current;
    const frame = frameRef.current;
    if (!img || !frame) return;

    const BASE = 1.08;
    if (reduced) {
      img.style.transform = `scale(${BASE})`;
      return () => {
        img.style.transform = "";
      };
    }

    let visible = false;
    let progress = 0.5;
    let height = 1;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      rootMargin: "15% 0px 15% 0px",
    });
    io.observe(frame);

    const stop = addTask({
      measure() {
        if (!visible) return;
        const r = frame.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        height = r.height || 1;
        progress = clamp((vh - r.top) / (vh + r.height));
      },
      apply() {
        if (!visible) return;
        const scale = BASE + zoom * (1 - clamp(progress * 1.8));
        const room = ((scale - 1) * height) / 2 - 1;
        const y = Math.max(-room, Math.min(room, (progress - 0.5) * distance));
        img.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      },
    });

    return () => {
      io.disconnect();
      stop();
      img.style.transform = "";
    };
  }, [imgRef, frameRef, distance, zoom, reduced]);
}

/**
 * Sizes a single line of text to exactly fill its container's width, and keeps
 * it that way through resizes and web-font swaps.
 */
export function useFitText(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    const box = el?.parentElement;
    if (!el || !box) return;

    const fit = () => {
      el.style.fontSize = "100px";
      const natural = el.scrollWidth;
      const target = box.clientWidth;
      if (natural > 0 && target > 0) el.style.fontSize = `${(100 * target) / natural}px`;
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [ref]);
}
