// utils/ruler-slots.ts
// Time ruler slot builder for the timeline header

import type { TimelineAxis, RulerSlot } from "../weekly-shift-grid.types";
import { timeToPercent } from "./timeline";

/** Ruler slot boundaries across the full timeline */
export function buildRulerSlots(
  axis: TimelineAxis,
  slotMinutes: number
): RulerSlot[] {
  const slots: RulerSlot[] = [];
  const firstBoundary = Math.ceil(axis.start / slotMinutes) * slotMinutes;
  // start one slot before to capture partial first slot
  let cs = firstBoundary - slotMinutes;
  while (cs < axis.end) {
    const ce = cs + slotMinutes;
    const vs = Math.max(cs, axis.start);
    const ve = Math.min(ce, axis.end);
    if (ve > vs) {
      const hFrom = Math.floor(((cs % 1440) + 1440) % 1440 / 60) % 24;
      const hTo = Math.floor(((ce % 1440) + 1440) % 1440 / 60) % 24;
      slots.push({
        startMins: vs,
        endMins: ve,
        label: `${String(hFrom).padStart(2, "0")}–${String(hTo).padStart(2, "0")}`,
        leftPct: timeToPercent(vs, axis),
        widthPct: ((ve - vs) / axis.durationMins) * 100,
      });
    }
    cs += slotMinutes;
  }
  return slots;
}
