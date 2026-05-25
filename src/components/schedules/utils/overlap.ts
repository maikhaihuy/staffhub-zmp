// utils/overlap.ts
// Block overlap resolver for lane-based positioning

import type { ShiftBlock, TimelineAxis, LaneInfo } from "../weekly-shift-grid.types";
import { toMins } from "./timeline";

/** Greedy overlap resolver — returns { row, totalRows } per block id */
export function resolveOverlap(
  blocks: ShiftBlock[],
  axis: TimelineAxis
): Map<string, LaneInfo> {
  const sorted = [...blocks].sort((a, b) => toMins(a.start) - toMins(b.start));
  const lanes: ShiftBlock[][] = [];
  const res = new Map<string, LaneInfo>();

  for (const blk of sorted) {
    let placed = false;
    for (let r = 0; r < lanes.length; r++) {
      const last = lanes[r][lanes[r].length - 1];
      if (toMins(last.end) <= toMins(blk.start)) {
        lanes[r].push(blk);
        placed = true;
        break;
      }
    }
    if (!placed) lanes.push([blk]);
  }
  const totalRows = Math.max(1, lanes.length);
  lanes.forEach((lane, r) => lane.forEach(b => res.set(b.id, { row: r, totalRows })));
  return res;
}
