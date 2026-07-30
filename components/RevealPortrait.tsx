"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";
import { addTask, clamp, damp } from "@/lib/ticker";

/**
 * Two portraits framed identically. The source images are pre-aligned and cut
 * out of their black backdrops so the subject's head sits in the same place in
 * both.
 *
 * The reveal is a cluster of hard-edged horizontal bands that ride the pointer.
 * Every band is a solid fillRect, the mask is rebuilt from scratch each frame,
 * and the enter/exit animation scales band *geometry* rather than opacity, so
 * the swap is never seen as a translucent blend at any point.
 *
 * Scrolling away shears the portrait into offset horizontal slices.
 */

const BASE = "/portrait/me.webp";
const OVER = "/portrait/atlas.webp";

const ASPECT = 1200 / 1500;
const MAX_DPR = 1.5; // the frame is large; cap the backing store

/**
 * Brush tuning. The reveal is painted into a grid of square cells: a cell is
 * either fully on or fully off, so every edge is hard and nothing is ever
 * translucent. CELL_DIVISOR sets the chunkiness — frame width / 30 gives visible
 * pixels; raise the divisor toward ~200 and the same brush reads as smooth.
 */
const CELL_DIVISOR = 30;
const CELL_MIN = 10;
const CELL_MAX = 34;
const BRUSH = 0.145; // brush radius as a fraction of frame width
const FLOW = 0.85; // how fast a cell fills under the brush
const FADE = 0.955; // per-frame decay, which dissolves the stroke pixel by pixel

const STRIPS = 16;
/** deterministic per-strip offset in [-1, 1] for the scroll shear */
const stripDx = Array.from({ length: STRIPS }, (_, i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
});

type Pt = { x: number; y: number };

export default function RevealPortrait({
  className = "",
  onTouch,
}: {
  className?: string;
  onTouch?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const onTouchRef = useRef(onTouch);
  useEffect(() => {
    onTouchRef.current = onTouch;
  }, [onTouch]);

  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d");
    // scratch holds Atlas already clipped to the bands, so the red accent stays
    // inside the opening instead of tinting the whole portrait
    const scratch = document.createElement("canvas");
    const sctx = scratch.getContext("2d");
    if (!mctx || !sctx) return;

    let w = 0;
    let h = 0;
    let dirty = true;

    const base = new Image();
    const overlay = new Image();
    let loaded = 0;
    let ready = false;
    for (const [img, src] of [
      [base, BASE],
      [overlay, OVER],
    ] as const) {
      img.decoding = "async";
      img.onload = () => {
        if (++loaded === 2) ready = true;
      };
      img.src = src;
    }

    // brush grid: one fill level per cell, plus a stable per-cell threshold so
    // the stroke edge breaks up into pixels instead of stepping a clean circle
    let cell = 0;
    let cols = 0;
    let rows = 0;
    let level = new Float32Array(0);
    let seed = new Float32Array(0);
    let wet = 0; // cells currently above threshold, so an empty grid can idle

    // pointer state
    let pointer: Pt | null = null;
    let lastPaint: Pt | null = null;
    let pressed = false;
    let hovering = false;
    let touched = false;

    let open = 0; // 0 to 1, brush size envelope
    let shear = 0; // px of scroll-driven slice offset
    let scrollP = 0;
    let glowX = 0.5;
    let glowY = 0.3;

    let demoT = 0;
    const DEMO_IN = 0.8;
    const DEMO_OUT = 6.5;
    const demoActive = () => !touched && !reduced && demoT < DEMO_OUT + 1.2;

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = Math.round(rect.width);
      h = Math.round(rect.height);
      if (w === 0 || h === 0) return;

      for (const c of [canvas!, mask, scratch]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;

      for (const c of [ctx!, mctx!, sctx!]) c.setTransform(dpr, 0, 0, dpr, 0, 0);

      cell = Math.max(CELL_MIN, Math.min(CELL_MAX, Math.round(w / CELL_DIVISOR)));
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      level = new Float32Array(cols * rows);
      seed = new Float32Array(cols * rows);
      for (let i = 0; i < seed.length; i++) seed[i] = Math.random();
      wet = 0;
      dirty = true;
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    /** Push fill into every cell under the brush, strongest at the centre. */
    function dab(p: Pt, radius: number) {
      const c0 = Math.max(0, Math.floor((p.x - radius) / cell));
      const c1 = Math.min(cols - 1, Math.ceil((p.x + radius) / cell));
      const r0 = Math.max(0, Math.floor((p.y - radius) / cell));
      const r1 = Math.min(rows - 1, Math.ceil((p.y + radius) / cell));
      const rr = radius * radius;

      for (let r = r0; r <= r1; r++) {
        const cy = r * cell + cell / 2;
        for (let c = c0; c <= c1; c++) {
          const cx = c * cell + cell / 2;
          const dx = cx - p.x;
          const dy = cy - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > rr) continue;
          const i = r * cols + c;
          level[i] = Math.min(1, level[i] + (1 - d2 / rr) * FLOW);
        }
      }
    }

    /** Dab along the segment so a fast drag paints a stroke, not a dotted line. */
    function paintStroke(to: Pt, radius: number) {
      if (lastPaint) {
        const dx = to.x - lastPaint.x;
        const dy = to.y - lastPaint.y;
        const steps = Math.min(28, Math.max(1, Math.ceil(Math.hypot(dx, dy) / (cell * 0.9))));
        for (let i = 1; i <= steps; i++) {
          dab({ x: lastPaint.x + (dx * i) / steps, y: lastPaint.y + (dy * i) / steps }, radius);
        }
      } else {
        dab(to, radius);
      }
      lastPaint = { ...to };
    }

    /**
     * Fade the grid, then stamp every cell that is still above its own
     * threshold. Because the thresholds differ per cell, the stroke frays at the
     * edge and dissolves pixel by pixel rather than fading out as a whole.
     *
     * While the pointer is held down the paint is frozen: a stroke that eats
     * itself under the cursor reads as the brush animating rather than as
     * painting. It only starts dissolving once the drag ends.
     */
    function renderMask() {
      const decay = pressed ? 1 : FADE;
      mctx!.clearRect(0, 0, w, h);
      mctx!.fillStyle = "#fff";
      wet = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const v = (level[i] *= decay);
          if (v <= 0.02) {
            level[i] = 0;
            continue;
          }
          if (v > 0.18 + seed[i] * 0.5) {
            mctx!.fillRect(c * cell, r * cell, cell, cell);
            wet++;
          }
        }
      }
    }

    /** One image, optionally sliced into horizontally offset strips. */
    function drawSliced(c: CanvasRenderingContext2D, img: HTMLImageElement, offset: number) {
      if (offset < 0.5) {
        c.drawImage(img, 0, 0, w, h);
        return;
      }
      const sh = img.naturalHeight / STRIPS;
      const dh = h / STRIPS;
      for (let i = 0; i < STRIPS; i++) {
        c.drawImage(
          img,
          0,
          i * sh,
          img.naturalWidth,
          sh,
          stripDx[i] * offset,
          i * dh,
          w,
          dh + 1, // overlap by a pixel so rounding can't open hairline gaps
        );
      }
    }

    const stop = addTask({
      measure() {
        scrollP = clamp(window.scrollY / (window.innerHeight || 1));
        if (!demoActive()) return;
        demoT += 1 / 60;
        pointer = {
          x: w * (0.5 + Math.sin(demoT * 0.75) * 0.17),
          y: h * 0.3,
        };
      },

      apply() {
        if (!w || !h || !ready) return;

        let target = 0;
        if (pressed && pointer) target = 1;
        else if (hovering && pointer) target = 0.72;
        else if (demoActive())
          target = clamp((demoT - DEMO_IN) / 1) * (1 - clamp((demoT - DEMO_OUT) / 1));

        open = damp(open, target, target > open ? 16 : 9);

        // shear peaks partway out of the hero, then eases off as it fades
        const targetShear = w * 0.16 * clamp((scrollP - 0.04) / 0.5) * (1 - clamp((scrollP - 0.55) / 0.45));
        shear = damp(shear, reduced ? 0 : targetShear, 14);

        // paint before deciding to idle, so a fresh stroke always lands
        if (pointer && open > 0.02) {
          paintStroke(pointer, w * BRUSH * (0.55 + 0.45 * open));
          glowX = damp(glowX, pointer.x / w, 14);
          glowY = damp(glowY, pointer.y / h, 14);
        } else {
          lastPaint = null;
        }

        const idle = wet === 0 && open <= 0.02 && shear < 0.5;
        if (idle) {
          if (!dirty) return;
          mctx!.clearRect(0, 0, w, h);
        }

        if (imgRef.current && imgRef.current.style.opacity !== "0") {
          // the canvas owns both layers from here; the <img> was only the
          // first-paint and no-JS fallback
          imgRef.current.style.opacity = "0";
        }

        if (!idle) renderMask();

        // Atlas, clipped to the painted cells
        sctx!.clearRect(0, 0, w, h);
        sctx!.globalCompositeOperation = "source-over";
        drawSliced(sctx!, overlay, shear);
        sctx!.globalCompositeOperation = "destination-in";
        sctx!.drawImage(mask, 0, 0, w, h);
        sctx!.globalCompositeOperation = "source-over";

        // Punch the painted cells clean out of the base, then drop Atlas in.
        // Both are drawn at full opacity, so every boundary is a hard cut.
        ctx!.clearRect(0, 0, w, h);
        ctx!.globalCompositeOperation = "source-over";
        drawSliced(ctx!, base, shear);

        if (wet > 0) {
          ctx!.globalCompositeOperation = "destination-out";
          ctx!.drawImage(mask, 0, 0, w, h);
          ctx!.globalCompositeOperation = "source-over";
          ctx!.drawImage(scratch, 0, 0, w, h);
        }

        if (glowRef.current) {
          glowRef.current.style.opacity = String(0.3 * open);
          glowRef.current.style.background = `radial-gradient(${(w * 0.42).toFixed(
            0,
          )}px circle at ${(glowX * 100).toFixed(2)}% ${(glowY * 100).toFixed(
            2,
          )}%, rgba(255,33,24,0.4), rgba(255,33,24,0.05) 52%, transparent 72%)`;
        }

        dirty = !idle;
      },
    });

    // ----- input -----
    const toLocal = (e: PointerEvent): Pt => {
      const r = wrap.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const markTouched = () => {
      if (touched) return;
      touched = true;
      onTouchRef.current?.();
    };

    const onDown = (e: PointerEvent) => {
      markTouched();
      pressed = true;
      pointer = toLocal(e);
      // start a new stroke rather than sweeping in from wherever the last ended
      lastPaint = null;
      wrap.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      // A finger only paints while it's actually dragging, so vertical
      // scrolling still belongs to the page.
      if (e.pointerType !== "mouse" && !pressed) return;
      markTouched();
      pointer = toLocal(e);
      if (e.pointerType === "mouse") hovering = true;
    };

    const onUp = (e: PointerEvent) => {
      pressed = false;
      if (e.pointerType !== "mouse") pointer = null;
      wrap.releasePointerCapture?.(e.pointerId);
    };

    const onLeave = () => {
      pressed = false;
      hovering = false;
      pointer = null;
    };

    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);
    wrap.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      ro.disconnect();
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      className={`relative select-none ${className}`}
      style={{ aspectRatio: ASPECT, touchAction: "pan-y" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={BASE}
        alt="Rithwik"
        width={1200}
        height={1500}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />

      {/* Atlas, cut in through the band mask */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

      <div ref={glowRef} className="pointer-glow" aria-hidden />
    </div>
  );
}
