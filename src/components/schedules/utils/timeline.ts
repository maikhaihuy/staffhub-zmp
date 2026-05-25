// utils/timeline.ts
// Core timeline coordinate calculations for shift grid positioning

import type { ShiftBlock, TimelineAxis, BlockCoords } from "../weekly-shift-grid.types";

/** "HH:MM" → minutes-since-midnight */
export function toMins(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** Build a unified [dayStart, dayEnd] axis from the ordered period list */
export function buildTimelineAxis(
  periods: Array<{ start: string; end: string }>
): TimelineAxis {
  if (!periods.length) return { start: 0, end: 0, durationMins: 0 };
  let start = toMins(periods[0].start);
  let end = toMins(periods[periods.length - 1].end);
  // overnight last period
  if (end <= start) end += 24 * 60;
  return { start, end, durationMins: end - start };
}

/** Convert an absolute time (mins) to a left-% on the unified timeline */
export function timeToPercent(mins: number, axis: TimelineAxis): number {
  return Math.max(0, Math.min(100, ((mins - axis.start) / axis.durationMins) * 100));
}

/** Compute left% and width% for a block on the unified timeline */
export function blockCoords(
  block: ShiftBlock,
  axis: TimelineAxis
): BlockCoords | null {
  if (axis.durationMins <= 0) return null;
  let bs = toMins(block.start);
  let be = toMins(block.end);
  // overnight block
  if (be < bs) be += 24 * 60;
  // clamp to timeline
  bs = Math.max(bs, axis.start);
  be = Math.min(be, axis.end);
  if (be <= bs) return null;
  return {
    leftPct: timeToPercent(bs, axis),
    widthPct: ((be - bs) / axis.durationMins) * 100,
  };
}
