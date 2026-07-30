"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

/** Counts up to `value` the first time it scrolls into view. */
export default function Counter({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const target = parseInt(value, 10);
    // anything that isn't a plain number just renders as written
    if (Number.isNaN(target) || reduced) {
      el.textContent = value;
      return;
    }

    const suffix = value.replace(/^\d+/, "");
    el.textContent = `0${suffix}`;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        const start = performance.now();
        const duration = 900;
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = `${Math.round(target * eased)}${suffix}`;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [value, reduced]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
