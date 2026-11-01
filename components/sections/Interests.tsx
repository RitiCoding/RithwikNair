"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Media from "../ui/Media";
import SectionHead from "../ui/SectionHead";
import Title from "../ui/Title";
import { interests } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";
import { addTask, damp, frameDelta } from "@/lib/ticker";

const items = interests.items;
const pad = (n: number) => String(n).padStart(2, "0");

/** How fast a picture covers the panel; higher is snappier. */
const SPEED = 8;
/** An incoming picture starts this much larger... */
const ZOOM = 0.08;
/** ...and this far (% of the panel) back toward the edge it enters from. */
const DRIFT = 10;
/** Another item must be this many px closer to mid-screen to take over, so resting on a boundary can't flicker. */
const HOLD = 32;

/** `p` is how much of the panel the picture covers; `from` is 1 for up from the bottom, -1 for down from the top. */
type Layer = { p: number; target: number; from: 1 | -1 };

/**
 * Text scrolls on the right; on the left a pinned panel shows the picture for
 * whichever item is nearest the middle of the screen.
 *
 * Each change pushes the new picture on top, covering whatever is showing from
 * the edge the page is moving toward: up from the bottom when scrolling down,
 * down from the top when scrolling up. Going back mid-wipe sends the pictures
 * above the one you returned to out the way they came. Coverage eases toward
 * its target every frame, so one change can interrupt another at any point
 * without a jump, and once a picture covers the panel the ones under it drop.
 */
export default function Interests() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const frames = layerRefs.current;
    const pictures = frames.map((f) => f?.querySelector("img") ?? null);
    // decode ahead of time, so a picture's first wipe never shows a blank strip
    pictures.forEach((pic) => pic?.decode().catch(() => {}));
    const layers: Layer[] = items.map((_, i) => ({ p: i ? 0 : 1, target: i ? 0 : 1, from: 1 }));
    // the pictures on screen, bottom to top
    let stack = [0];

    const paint = (i: number) => {
      const frame = frames[i];
      if (!frame) return;
      const level = stack.indexOf(i);
      const { p, from } = layers[i];
      const cut = ((1 - p) * 100).toFixed(3);
      frame.style.zIndex = String(level + 1);
      frame.style.clipPath =
        level < 0 ? "inset(100% 0 0 0)" : from > 0 ? `inset(${cut}% 0 0 0)` : `inset(0 0 ${cut}% 0)`;
      const pic = pictures[i];
      if (pic) {
        const y = from * DRIFT * (1 - p);
        pic.style.transform = `translate3d(0, ${y.toFixed(3)}%, 0) scale(${(1 + ZOOM * (1 - p)).toFixed(4)})`;
      }
    };
    items.forEach((_, i) => paint(i));

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(section);

    let current = 0;
    let next = 0;

    const show = (to: number) => {
      const at = stack.indexOf(to);
      if (at < 0) {
        layers[to] = { p: 0, target: 1, from: to > current ? 1 : -1 };
        stack.push(to);
        return;
      }
      // still showing underneath: send everything above it back out
      layers[to].target = 1;
      for (const i of stack.slice(at + 1)) layers[i].target = 0;
    };

    const stop = addTask({
      measure() {
        if (!visible) return;
        const mid = window.innerHeight / 2;
        const off = (i: number) => {
          const r = itemRefs.current[i]?.getBoundingClientRect();
          return r ? Math.abs(r.top + r.height / 2 - mid) : Infinity;
        };
        let best = off(current) - HOLD;
        next = current;
        for (let i = 0; i < items.length; i++) {
          const d = off(i);
          if (d < best) {
            best = d;
            next = i;
          }
        }
      },
      apply() {
        if (next !== current) {
          show(next);
          current = next;
          setActive(next);
        }

        let moved = false;
        for (const i of stack) {
          const l = layers[i];
          if (l.p === l.target) continue;
          l.p = reduced ? l.target : damp(l.p, l.target, SPEED, frameDelta());
          if (Math.abs(l.target - l.p) < 0.001) l.p = l.target;
          moved = true;
        }
        if (!moved) return;

        const before = stack;
        // once the top picture covers the panel, nothing under it can show
        const top = layers[stack[stack.length - 1]];
        if (top.p === 1 && top.target === 1) stack = stack.slice(-1);
        // and pictures that have fully withdrawn leave
        stack = stack.filter((i) => layers[i].p > 0 || layers[i].target > 0);
        before.forEach(paint);
      },
    });

    return () => {
      io.disconnect();
      stop();
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      data-chapter={interests.label}
      data-chapter-index={interests.index}
      className="relative z-10 bg-ink"
    >
      <div className="shell section-pad">
        <SectionHead index={interests.index} label={interests.label} />
        <Title text={interests.title} className="t-h2 mt-10 md:mt-14" />

        <div className="mt-16 grid grid-cols-12 gap-x-[var(--gap)] md:mt-20">
          <div className="hidden md:col-span-5 md:block">
            <div className="sticky top-[13vh] flex h-[74vh] flex-col">
              <div className="relative isolate flex-1 overflow-hidden bg-ink-2">
                {items.map((it, i) => (
                  <div
                    key={it.no}
                    ref={(el) => {
                      layerRefs.current[i] = el;
                    }}
                    className="interest-layer"
                  >
                    {/* loaded up front so no picture can wipe in before it has arrived */}
                    <Image
                      src={it.shot.src}
                      alt={it.shot.alt}
                      fill
                      loading="eager"
                      fetchPriority="low"
                      sizes="(min-width: 768px) 40vw, 1px"
                      className="object-cover"
                      style={{ objectPosition: it.shot.focus }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="t-label relative block h-[1.25em] overflow-hidden text-paper">
                  <span key={active} className="block animate-[roll_0.7s_var(--ease-expo)]">
                    {items[active].title}
                  </span>
                </span>
                <span className="t-label tabular">
                  {pad(active + 1)} <span className="text-dim">/ {pad(items.length)}</span>
                </span>
              </div>
            </div>
          </div>

          <ol className="col-span-12 md:col-span-6 md:col-start-7">
            {items.map((it, i) => (
              <li
                key={it.no}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                data-on={i === active}
                className="interest-item border-t border-line py-12 first:border-t-0 md:border-t-0 md:py-0"
              >
                <Media
                  src={it.shot.src}
                  alt={it.shot.alt}
                  ratio={4 / 5}
                  focus={it.shot.focus}
                  sizes="100vw"
                  className="mb-8 md:hidden"
                />
                <span className="t-label tabular text-brand">{it.no}</span>
                <h3 className="t-h3 mt-5">{it.title}</h3>
                <p className="t-body mt-6 max-w-[40ch]">{it.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
