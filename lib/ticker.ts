"use client";

/**
 * One rAF loop for the whole page, split into a read phase and a write phase.
 * Every scroll-driven effect measures first and mutates second, so no task
 * can force a synchronous reflow by interleaving reads with writes.
 */
export type Task = {
  measure: () => void;
  apply: () => void;
};

const tasks = new Set<Task>();
let frameId: number | null = null;

function frame() {
  // One throwing task must never take the loop down with it: a dead rAF loop
  // freezes every scroll effect on the page at once, with no way to recover.
  for (const task of tasks) {
    try {
      task.measure();
    } catch (err) {
      console.error("[ticker] measure failed", err);
    }
  }
  for (const task of tasks) {
    try {
      task.apply();
    } catch (err) {
      console.error("[ticker] apply failed", err);
    }
  }
  frameId = requestAnimationFrame(frame);
}

export function addTask(task: Task): () => void {
  tasks.add(task);
  if (frameId === null) frameId = requestAnimationFrame(frame);

  return () => {
    tasks.delete(task);
    if (tasks.size === 0 && frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  };
}

/** Frame-rate independent easing toward a target. */
export function damp(current: number, target: number, lambda: number, dt = 1 / 60) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
