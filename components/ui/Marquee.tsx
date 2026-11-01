"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks";
import { addTask, damp, frameDelta, scrollVelocity } from "@/lib/ticker";

/**
 * An endless horizontal run. It drifts at a steady pace, speeds up with scroll
 * speed, and turns around when the page changes scroll direction.
 */
export default function Marquee({
  children,
  speed = 40,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  /** px per second at rest */
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const box = boxRef.current;
    const track = trackRef.current;
    if (!box || !track || reduced) return;

    // the track holds two identical runs; wrapping at half its width is seamless
    let half = track.scrollWidth / 2;
    const ro = new ResizeObserver(() => (half = track.scrollWidth / 2));
    ro.observe(track);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(box);

    let x = 0;
    let dir = reverse ? 1 : -1;
    let boost = 0;

    const stop = addTask({
      measure() {},
      apply() {
        if (!visible || half <= 0) return;
        const dt = frameDelta();
        const v = scrollVelocity();
        if (Math.abs(v) > 0.4) dir = (v > 0 ? -1 : 1) * (reverse ? -1 : 1);
        boost = damp(boost, Math.min(Math.abs(v) * 0.8, 12), 5, dt);
        x += dir * speed * dt * (1 + boost);
        if (x <= -half) x += half;
        else if (x > 0) x -= half;
        track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
      },
    });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, [speed, reverse, reduced]);

  return (
    <div ref={boxRef} className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
