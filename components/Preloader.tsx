"use client";

import { useEffect, useRef, useState } from "react";
import { isReady, markReady, whenReady } from "@/lib/ready";

/** Never shorter than this, so a cached visit still gets a deliberate entrance. */
const MIN_MS = 1100;

const ASSETS = ["/portrait/me.webp", "/portrait/atlas.webp"];

function load(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    // a failed image shouldn't hold the page hostage: count it and move on
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}

/**
 * A counter tied to what the hero actually needs (fonts and both portraits),
 * then a hard wipe up into the page. The hero's own entrance starts as the
 * wipe begins, so the two overlap instead of playing back to back.
 */
export default function Preloader({ name }: { name: string }) {
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"load" | "leave" | "done">("load");

  useEffect(() => {
    if (isReady()) {
      // reduced motion: CSS already hides it, so just drop it on the next frame
      const id = requestAnimationFrame(() => setPhase("done"));
      return () => cancelAnimationFrame(id);
    }

    let target = 0;
    let shown = 0;
    let raf = 0;
    let leaving = false;
    const timers: number[] = [];
    const start = performance.now();

    const jobs = [document.fonts ? document.fonts.ready.then(() => {}) : Promise.resolve(), ...ASSETS.map(load)];
    let finished = 0;
    jobs.forEach((job) =>
      job.then(() => {
        finished += 1;
        target = finished / jobs.length;
      }),
    );

    const leave = () => {
      leaving = true;
      setPhase("leave");
      timers.push(window.setTimeout(markReady, 140));
      timers.push(window.setTimeout(() => setPhase("done"), 1250));
    };

    const tick = (now: number) => {
      // the count can't outrun either the real progress or the minimum time
      const goal = Math.min(target, (now - start) / MIN_MS);
      shown += (goal - shown) * 0.14;
      if (goal - shown < 0.002) shown = goal;

      if (countRef.current) countRef.current.textContent = String(Math.round(shown * 100)).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${shown.toFixed(4)})`;

      if (shown >= 1) {
        leave();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // the boot script's failsafe fired first: just get out of the way
    const off = whenReady(() => {
      if (leaving) return;
      cancelAnimationFrame(raf);
      setPhase("done");
    });

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      off();
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`preloader ${phase === "leave" ? "is-leaving" : ""}`} aria-hidden>
      <div className="preloader-inner shell flex h-full flex-col justify-between py-7">
        <div className="flex items-start justify-between gap-6">
          <span className="shrink-0 text-[0.95rem] font-medium tracking-[-0.01em]">{name}</span>
          <span className="t-label text-right text-balance">Robotics · Mechanical design</span>
        </div>
        <div className="flex items-end justify-between gap-6">
          <span className="t-label pb-2">Loading</span>
          <span ref={countRef} className="preloader-count tabular">
            000
          </span>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/10">
        <div ref={barRef} className="h-full origin-left scale-x-0 bg-brand" />
      </div>
    </div>
  );
}
