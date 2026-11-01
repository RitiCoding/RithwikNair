"use client";

import type Lenis from "lenis";

/**
 * The one smooth-scroll instance, shared so any component can scroll the page
 * without owning the engine. Falls back to native smooth scrolling when the
 * engine is off (reduced motion).
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function scrollToTarget(target: number | HTMLElement) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.8 });
    return;
  }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "smooth" });
}
