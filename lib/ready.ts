"use client";

/**
 * The intro sequence gates the hero's entrance. It flips `data-ready` on <html>,
 * which the CSS entrance states key off, and fires an event for anything in JS
 * that should wait for it. The inline boot script in the layout can fire the
 * same signal on its own: immediately under reduced motion, and as a failsafe if
 * the intro never finishes.
 */
const EVENT = "site:ready";

export function isReady() {
  return typeof document !== "undefined" && document.documentElement.dataset.ready === "true";
}

export function markReady() {
  const html = document.documentElement;
  if (html.dataset.ready === "true") return;
  html.dataset.ready = "true";
  window.dispatchEvent(new Event(EVENT));
}

export function whenReady(cb: () => void): () => void {
  if (isReady()) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(EVENT, handler, { once: true });
  return () => window.removeEventListener(EVENT, handler);
}

/** Runs before first paint. Kept tiny and dependency-free on purpose. */
export const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');try{if('scrollRestoration' in history)history.scrollRestoration='manual'}catch(e){}function go(){if(d.dataset.ready!=='true'){d.dataset.ready='true';window.dispatchEvent(new Event('${EVENT}'))}}if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.ready='true';return}setTimeout(go,6000)})();`;
