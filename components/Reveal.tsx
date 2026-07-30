"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useInView } from "@/lib/hooks";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** ms before the transition starts. Use for staggering siblings. */
  delay?: number;
  /** starting offset in px */
  y?: number;
  threshold?: number;
};

/** Fades and lifts its children in the first time they enter the viewport. */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  y = 30,
  threshold,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  useInView(ref, threshold !== undefined ? { threshold } : undefined);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--rd": `${delay}ms`, "--ry": `${y}px` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
