"use client";

import { useRef } from "react";
import { useInView } from "@/lib/hooks";

/** "02  Interests ————" : the index, the label, and a hairline that draws across. */
export default function SectionHead({
  index,
  label,
  className = "",
}: {
  index: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useInView(ref, { threshold: 0.6 });

  return (
    <div ref={ref} className={`section-head ${className}`}>
      <span className="t-label tabular text-brand">{index}</span>
      <span className="t-label text-paper">{label}</span>
      <span className="rule" aria-hidden />
    </div>
  );
}
