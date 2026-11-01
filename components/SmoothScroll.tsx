"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "@/lib/hooks";
import { whenReady } from "@/lib/ready";
import { setLenis } from "@/lib/scroll";
import { addPreFrame } from "@/lib/ticker";

export default function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      // a long, soft tail: the page should feel weighted, not springy
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });
    setLenis(lenis);
    if (process.env.NODE_ENV !== "production") {
      // dev only: lets QA jump to exact scroll positions from the console
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    // held still behind the intro, and always starting from the top
    lenis.stop();
    const off = whenReady(() => {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
      lenis.start();
    });

    // advance inside the shared loop, ahead of every task's read phase
    const stop = addPreFrame((time) => lenis.raf(time));

    return () => {
      off();
      stop();
      setLenis(null);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
