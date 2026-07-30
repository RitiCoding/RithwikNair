"use client";

import { useRef, type ElementType } from "react";
import { useInView, useParallax } from "@/lib/hooks";

type SplitTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** ms added per word */
  stagger?: number;
  delay?: number;
  /** px of scroll-linked horizontal drift; negative moves left */
  drift?: number;
};

/**
 * Headline that rises word-by-word out of a clipped baseline, and optionally
 * drifts sideways as the page scrolls. Words keep their spaces so the text
 * still selects and reads normally.
 */
export default function SplitText({
  text,
  as: Tag = "h2",
  className = "",
  stagger = 42,
  delay = 0,
  drift = 0,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const driftRef = useRef<HTMLElement>(null);

  useInView(ref, { threshold: 0.2 });
  useParallax(driftRef, { distance: drift, axis: "x" });

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className}>
      <span ref={driftRef} className="block will-change-transform">
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            <span className="split-word">
              <span style={{ "--wd": `${delay + i * stagger}ms` } as React.CSSProperties}>
                {word}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
