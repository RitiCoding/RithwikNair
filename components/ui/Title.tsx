"use client";

import { Fragment, useRef, type ElementType } from "react";
import { useInView } from "@/lib/hooks";

type Word = { text: string; accent: boolean; tail: string };

/** "*robots*." becomes an accented "robots" followed by a plain "." */
function parse(text: string): Word[] {
  return text.split(" ").map((raw) => {
    const m = raw.match(/^\*(.+)\*(.*)$/);
    return m ? { text: m[1], accent: true, tail: m[2] } : { text: raw, accent: false, tail: "" };
  });
}

/**
 * A headline whose words rise out of a clipped baseline in sequence.
 * Wrap one word in *asterisks* to set it in the serif italic.
 */
export default function Title({
  text,
  as: Tag = "h2",
  className = "",
  stagger = 55,
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useInView(ref, { threshold: 0.3 });
  const words = parse(text);

  return (
    <Tag ref={ref} className={`title ${className}`}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split-word">
            <span style={{ "--wd": `${delay + i * stagger}ms` } as React.CSSProperties}>
              {w.accent ? <span className="accent">{w.text}</span> : w.text}
              {w.tail}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
