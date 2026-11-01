"use client";

import { useEffect, useRef } from "react";
import Icon from "../ui/Icon";
import SectionHead from "../ui/SectionHead";
import Title from "../ui/Title";
import { contact, site } from "@/lib/content";
import { useFitText, useReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import { addTask, clamp } from "@/lib/ticker";

/**
 * The footer sits fixed beneath the page, which lifts off it at the end. As it
 * uncovers, the content settles down into place and the giant name rises
 * letter by letter.
 */
export default function Contact({ year }: { year: number }) {
  const footerRef = useRef<HTMLElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useFitText(markRef);

  useEffect(() => {
    const footer = footerRef.current;
    const mark = markRef.current;
    const page = document.querySelector<HTMLElement>(".page");
    if (!footer || !mark || !page || reduced) return;

    const letters = Array.from(mark.children) as HTMLElement[];
    let p = 0;
    let last = -1;

    return addTask({
      measure() {
        const vh = window.innerHeight;
        // 0 while the page still covers the footer, 1 once it's fully clear
        p = clamp((vh - page.getBoundingClientRect().bottom) / Math.max(1, footer.offsetHeight));
      },
      apply() {
        if (Math.abs(p - last) < 0.0005) return;
        last = p;
        letters.forEach((l, i) => {
          const t = clamp(p * 1.4 - i * 0.03);
          l.style.transform = `translate3d(0, ${((1 - t) * 105).toFixed(2)}%, 0)`;
        });
        if (topRef.current) topRef.current.style.transform = `translate3d(0, ${((1 - p) * -70).toFixed(1)}px, 0)`;
      },
    });
  }, [reduced]);

  // a plain space would collapse inside its inline-block, so hold it open
  const letters = Array.from(site.name).map((c) => (c === " " ? " " : c));

  return (
    <footer ref={footerRef} className="contact flex min-h-[100svh] flex-col">
      <div ref={topRef} className="shell flex flex-1 flex-col pt-[clamp(6rem,11vw,9.5rem)]">
        <SectionHead index={contact.index} label={contact.label} />
        <Title text={contact.title} className="t-h2 mt-10 max-w-[15ch] md:mt-14" />

        <div className="mt-auto flex flex-col gap-10 pt-16 md:flex-row md:items-end md:justify-between">
          <a href={`mailto:${site.email}`} className="contact-email group inline-flex items-center gap-[0.3em]">
            <span className="link-line pb-[0.08em]">{site.email}</span>
            <Icon
              name="arrow"
              className="h-[0.62em] w-[0.62em] text-brand transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>

          <ul className="flex items-center gap-8">
            {site.links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="t-label flex items-center gap-2.5 text-paper transition-colors duration-300 hover:text-brand"
                >
                  <Icon name={l.icon} className="h-4 w-4" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell pt-14 pb-6">
        <div className="overflow-hidden">
          <div ref={markRef} className="footer-mark" aria-hidden>
            {letters.map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
          <span className="t-label">
            © {year} {site.name}
          </span>
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="t-label flex items-center gap-2 text-paper transition-colors duration-300 hover:text-brand"
          >
            Back to top
            <Icon name="up" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
