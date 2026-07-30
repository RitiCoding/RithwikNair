"use client";

import { useScrollProgress } from "@/lib/hooks";

export default function ScrollProgress() {
  const ref = useScrollProgress();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-px bg-white/[0.06]"
    >
      <div ref={ref} className="h-full origin-left scale-x-0 bg-brand will-change-transform" />
    </div>
  );
}
