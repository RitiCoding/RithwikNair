"use client";

import { useRef } from "react";
import { useParallax } from "@/lib/hooks";

export default function Marquee({
  items,
  duration = 34,
}: {
  items: string[];
  duration?: number;
}) {
  // rendered twice so the -50% keyframe loops seamlessly
  const run = [...items, ...items];

  // scroll nudges the band sideways on top of its own steady crawl
  const shiftRef = useRef<HTMLDivElement>(null);
  useParallax(shiftRef, { distance: -220, axis: "x" });

  return (
    <div
      className="marquee relative overflow-hidden py-6"
      style={{ "--mq-dur": `${duration}s` } as React.CSSProperties}
      aria-hidden
    >
      <div ref={shiftRef} className="will-change-transform">
        <div className="marquee-track">
          {run.map((item, i) => (
            <span key={i} className="flex shrink-0 items-center">
              <span className="display px-6 text-[clamp(1.6rem,4.2vw,3.4rem)] text-faint">
                {item}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent sm:w-40" />
    </div>
  );
}
