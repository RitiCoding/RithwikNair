"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";
import { addTask, clamp } from "@/lib/ticker";

/**
 * A paragraph whose words light up one after another as it scrolls through
 * the viewport, so reading pace follows scroll pace.
 */
export default function ScrubText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-w]"));

    if (reduced) {
      spans.forEach((s) => (s.style.opacity = "1"));
      return;
    }

    let progress = 0;
    const shown = new Float32Array(spans.length).fill(-1);

    return addTask({
      measure() {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // from the top edge reaching 85% of the screen to the bottom edge reaching 45%
        progress = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.4));
      },
      apply() {
        const n = spans.length;
        for (let i = 0; i < n; i++) {
          const o = 0.16 + 0.84 * clamp(progress * n * 1.1 - i);
          // only touch the DOM when a word actually changes
          if (Math.abs(o - shown[i]) > 0.003) {
            spans[i].style.opacity = o.toFixed(3);
            shown[i] = o;
          }
        }
      },
    });
  }, [reduced]);

  return (
    <p ref={ref} className={`scrub ${className}`}>
      {words.map((w, i) => (
        <span key={i} data-w="">
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
