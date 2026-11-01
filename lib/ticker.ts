"use client";

/**
 * One rAF loop for the whole page. Each frame runs, in order:
 *   1. pre-frame hooks (the smooth-scroll engine advances here, so everything
 *      after it reads this frame's scroll position),
 *   2. one scroll-velocity sample, shared by everything that reacts to speed,
 *   3. every task's read phase, then 4. every task's write phase.
 * Reads are batched before writes so no task can force a synchronous reflow,
 * and each call is isolated so one throwing task can't stop the loop.
 */
export type Task = {
  measure: () => void;
  apply: () => void;
};

const tasks = new Set<Task>();
const preFrame = new Set<(time: number) => void>();
let frameId: number | null = null;
let lastTime = 0;
let delta = 1 / 60;
let lastY = 0;
let velocity = 0;

function run(label: string, fn: () => void) {
  try {
    fn();
  } catch (err) {
    console.error(`[ticker] ${label} failed`, err);
  }
}

function frame(time: number) {
  delta = lastTime ? Math.min(0.1, (time - lastTime) / 1000) : 1 / 60;
  lastTime = time;

  for (const fn of preFrame) run("pre-frame", () => fn(time));

  const y = window.scrollY;
  // px per 60 Hz frame, so the feel is the same on a 60 Hz and a 120 Hz screen
  velocity = damp(velocity, (y - lastY) / (delta * 60), 10, delta);
  lastY = y;

  for (const task of tasks) run("measure", task.measure);
  for (const task of tasks) run("apply", task.apply);
  frameId = requestAnimationFrame(frame);
}

function start() {
  if (frameId === null && (tasks.size || preFrame.size)) {
    lastY = window.scrollY;
    frameId = requestAnimationFrame(frame);
  }
}

function stopIfIdle() {
  if (frameId !== null && !tasks.size && !preFrame.size) {
    cancelAnimationFrame(frameId);
    frameId = null;
    lastTime = 0;
  }
}

export function addTask(task: Task): () => void {
  tasks.add(task);
  start();
  return () => {
    tasks.delete(task);
    stopIfIdle();
  };
}

export function addPreFrame(fn: (time: number) => void): () => void {
  preFrame.add(fn);
  start();
  return () => {
    preFrame.delete(fn);
    stopIfIdle();
  };
}

/** Seconds since the previous frame, capped so a background tab can't lurch. */
export const frameDelta = () => delta;

/** Smoothed scroll speed in px per 60 Hz frame; negative when scrolling up. */
export const scrollVelocity = () => velocity;

/** Frame-rate independent easing toward a target. */
export function damp(current: number, target: number, lambda: number, dt = 1 / 60) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
