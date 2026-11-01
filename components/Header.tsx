"use client";

import { useEffect, useState } from "react";
import { scrollToTarget } from "@/lib/scroll";
import { addTask } from "@/lib/ticker";

type Chapter = { index: string; label: string };

/**
 * Name on the left, the current chapter on the right. The chapter is whichever
 * section spans the middle of the screen. Sections stuck under another (the
 * sticky hero) still span it, so the last one in document order wins; and the
 * footer, which sits behind the page the whole time, only counts once the page
 * has actually lifted off it.
 *
 * Positions are read every frame rather than watched with an observer, so a
 * jump (Back to top, a fast fling) can never skip a chapter boundary.
 */
export default function Header({ name }: { name: string }) {
  const [chapter, setChapter] = useState<Chapter>({ index: "00", label: "Intro" });

  useEffect(() => {
    // The header lives in the root layout and the sections in the page, which
    // can stream in after this effect runs. So look the chapters up lazily, and
    // again if they're replaced, instead of once up front.
    let nodes: HTMLElement[] = [];
    let end: HTMLElement | null = null;
    const resolve = () => {
      if (nodes.length && nodes[0].isConnected) return;
      nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]:not([data-chapter-end])"));
      end = document.querySelector<HTMLElement>("[data-chapter-end]");
    };

    let next: HTMLElement | null = null;
    let current: HTMLElement | null = null;

    return addTask({
      measure() {
        resolve();
        if (!nodes.length) return;
        const mid = window.innerHeight / 2;
        if (end && end.getBoundingClientRect().top < mid) {
          next = end;
          return;
        }
        next = nodes[0];
        for (const n of nodes) {
          const r = n.getBoundingClientRect();
          if (r.top <= mid && r.bottom > mid) next = n;
        }
      },
      apply() {
        if (!next || next === current) return;
        current = next;
        setChapter({ index: next.dataset.chapterIndex ?? "", label: next.dataset.chapter ?? "" });
      },
    });
  }, []);

  return (
    <>
      {/* content fades out as it slides under the bar instead of colliding with it */}
      <div
        aria-hidden
        className="enter-fade pointer-events-none fixed inset-x-0 top-0 z-40 h-24 bg-gradient-to-b from-ink/90 via-ink/50 to-transparent"
      />
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <div className="shell flex h-[4.5rem] items-center justify-between">
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="enter-fade pointer-events-auto text-[0.95rem] font-medium tracking-[-0.01em]"
            style={{ "--d": "250ms" } as React.CSSProperties}
          >
            {name}
          </button>

          <div
            className="enter-fade t-label flex items-center gap-3 text-white"
            style={{ "--d": "350ms" } as React.CSSProperties}
            // a visual echo of the section headings, which assistive tech already reads
            aria-hidden
          >
            <span className="opacity-50 tabular">{chapter.index}</span>
            <span className="relative block h-[1.25em] overflow-hidden">
              {/* keyed, so each change replays the roll-in */}
              <span key={chapter.label} className="block animate-[roll_0.7s_var(--ease-expo)]">
                {chapter.label}
              </span>
            </span>
          </div>
        </div>
      </header>
    </>
  );
}
