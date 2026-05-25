// weekly-shift-grid.tsx (refactored)
// Main WeeklyShiftGrid component — orchestrator for layered grid system

import React, { memo, useMemo, useState, useCallback } from "react";
import type { WeeklyShiftGridProps, GridCallbacks, ShiftBlock as ShiftBlockType } from "./weekly-shift-grid.types";
import { buildTimelineAxis } from "./utils/timeline";
import { buildRulerSlots } from "./utils/ruler-slots";
import { DEFAULT_WEEKDAYS } from "./constants";
import { TimelineHeaderLayer } from "./layers/TimelineHeaderLayer";
import { GridBackgroundLayer } from "./layers/GridBackgroundLayer";
import { DayRow } from "./layers/DayRow";
import { GridLegend } from "./layers/GridLegend";

const DAY_LABEL_WIDTH = 52; // px

export const WeeklyShiftGrid = memo(function WeeklyShiftGrid({
  periods,
  weekdays = DEFAULT_WEEKDAYS,
  blocks = [],
  mode = "read-only",
  selectedIds: selectedIdsProp = [],
  callbacks = {},
  className = "",
  rulerSlotMinutes = 120,
  rowHeight = 80,
  renderBlock,
  loading = false,
}: WeeklyShiftGridProps) {
  // ── Derived timeline structures (memoised) ──────────────────────────────────
  const axis = useMemo(() => buildTimelineAxis(periods), [periods]);
  const rulerSlots = useMemo(
    () => buildRulerSlots(axis, rulerSlotMinutes),
    [axis, rulerSlotMinutes]
  );

  // ── Block map: dayIndex → blocks[] ─────────────────────────────────────────
  const blockMap = useMemo(() => {
    const map: Record<number, ShiftBlockType[]> = {};
    for (const b of blocks) {
      if (!map[b.dayIndex]) map[b.dayIndex] = [];
      map[b.dayIndex].push(b);
    }
    return map;
  }, [blocks]);

  // ── Selection state ─────────────────────────────────────────────────────────
  const [internalSelected, setInternalSelected] = useState<Set<string>>(new Set());
  const selectedIds = useMemo(
    () => new Set(selectedIdsProp.length ? selectedIdsProp : [...internalSelected]),
    [selectedIdsProp, internalSelected]
  );

  const wrappedCallbacks = useMemo<GridCallbacks>(
    () => ({
      ...callbacks,
      onShiftClick: (block, e) => {
        if (mode === "selectable") {
          setInternalSelected((prev) => {
            const next = new Set(prev);
            next.has(block.id) ? next.delete(block.id) : next.add(block.id);
            return next;
          });
        }
        callbacks.onShiftClick?.(block, e);
      },
    }),
    [callbacks, mode]
  );

  // ── Used statuses for legend ────────────────────────────────────────────────
  const usedStatuses = useMemo(
    () => [...new Set(blocks.map((b) => b.status).filter(Boolean) as string[])],
    [blocks]
  );

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className={`rounded-xl border border-slate-200 overflow-hidden ${className}`}
      >
        <div className="animate-pulse">
          <div className="h-[58px] bg-slate-100 border-b border-slate-200" />
          {weekdays.map((d) => (
            <div
              key={d.index}
              className="flex border-b border-slate-100"
              style={{ height: rowHeight }}
            >
              <div
                className="shrink-0 bg-slate-50"
                style={{ width: DAY_LABEL_WIDTH }}
              />
              <div className="flex-1 p-3 flex gap-2">
                {[...Array(Math.floor(Math.random() * 3) + 1)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-md bg-slate-100 h-10"
                    style={{ width: `${20 + Math.random() * 30}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "flex flex-col rounded-xl border border-slate-200 shadow-sm overflow-hidden",
        className,
      ].join(" ")}
    >
      {/* Scrollable grid area */}
      <div className="overflow-auto flex-1">
        <div className="relative" style={{ minWidth: 560 }}>
          {/* ── TimelineHeaderLayer ── */}
          <TimelineHeaderLayer
            periods={periods}
            rulerSlots={rulerSlots}
            axis={axis}
            dayLabelWidth={DAY_LABEL_WIDTH}
          />

          {/* ── Rows wrapper — GridBackground + DayRows ── */}
          <div className="relative">
            {/* GridBackgroundLayer spans all rows */}
            <GridBackgroundLayer
              rulerSlots={rulerSlots}
              periods={periods}
              axis={axis}
              dayLabelWidth={DAY_LABEL_WIDTH}
              totalHeight={weekdays.length * rowHeight}
            />

            {/* Day rows */}
            {weekdays.map((day) => (
              <DayRow
                key={day.index}
                day={day}
                blocks={blockMap[day.index] ?? []}
                axis={axis}
                rulerSlots={rulerSlots}
                rowHeight={rowHeight}
                selectedIds={selectedIds}
                mode={mode}
                callbacks={wrappedCallbacks}
                dayLabelWidth={DAY_LABEL_WIDTH}
                renderBlock={renderBlock}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      {usedStatuses.length > 0 && <GridLegend statuses={usedStatuses} />}
    </div>
  );
});

// Export type definitions and sample data
export type {
  InteractionMode,
  ShiftStatus,
  ShiftPeriod,
  ShiftBlock,
  WeekdayConfig,
  GridCallbacks,
  WeeklyShiftGridProps,
  RenderBlockHelpers,
  StatusTokens,
  TimelineAxis,
  RulerSlot,
  BlockCoords,
  LaneInfo,
} from "./weekly-shift-grid.types";

export { RETAIL_FB_PERIODS, RETAIL_FB_SAMPLE_BLOCKS, DEFAULT_WEEKDAYS } from "./constants";

// Export layer components for advanced customization
export { TimelineHeaderLayer } from "./layers/TimelineHeaderLayer";
export { GridBackgroundLayer } from "./layers/GridBackgroundLayer";
export { ShiftOverlayLayer } from "./layers/ShiftOverlayLayer";
export { DayRow } from "./layers/DayRow";
export { ShiftBlock as ShiftBlockComponent } from "./layers/ShiftBlock";
export { GridLegend } from "./layers/GridLegend";
export {
  ShiftBlockHeader,
  ShiftBlockBody,
  DefaultBlockContent,
} from "./layers/DefaultBlockContent";

// Export utilities for custom implementations
export {
  toMins,
  buildTimelineAxis,
  timeToPercent,
  blockCoords,
} from "./utils/timeline";
export { buildRulerSlots } from "./utils/ruler-slots";
export { resolveOverlap } from "./utils/overlap";
export { getTokens, STATUS_TOKENS, STATUS_LABEL } from "./utils/status-tokens";

export default WeeklyShiftGrid;
