// layers/DayRow.tsx
// Single day row with sticky label and shift overlay

import React, { memo, useCallback } from "react";
import type { WeekdayConfig, ShiftBlock, TimelineAxis, InteractionMode, GridCallbacks, RulerSlot, WeeklyShiftGridProps } from "../weekly-shift-grid.types";
import { ShiftOverlayLayer } from "./ShiftOverlayLayer";

interface DayRowProps {
  day: WeekdayConfig;
  blocks: ShiftBlock[];
  axis: TimelineAxis;
  rulerSlots: RulerSlot[];
  rowHeight: number;
  selectedIds: Set<string>;
  mode: InteractionMode;
  callbacks: GridCallbacks;
  dayLabelWidth: number;
  renderBlock?: WeeklyShiftGridProps["renderBlock"];
}

export const DayRow = memo(function DayRow({
  day,
  blocks,
  axis,
  rulerSlots,
  rowHeight,
  selectedIds,
  mode,
  callbacks,
  dayLabelWidth,
  renderBlock,
}: DayRowProps) {
  const handleRowClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const relX = (e.clientX - rect.left - dayLabelWidth) / (rect.width - dayLabelWidth);
      const timeMins = axis.start + relX * axis.durationMins;
      const h = Math.floor(timeMins / 60) % 24;
      const m = Math.floor(timeMins % 60);
      const timeApprox = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      callbacks.onRowClick?.(day.index, timeApprox, e);
    },
    [axis, day.index, dayLabelWidth, callbacks]
  );

  return (
    <div
      className="relative flex border-b border-slate-100 group"
      style={{ height: rowHeight }}
      onClick={mode !== "read-only" ? handleRowClick : undefined}
    >
      {/* Day label — sticky left */}
      <div
        className={[
          "sticky left-0 z-10 shrink-0 flex flex-col items-center justify-center gap-0.5",
          "border-r border-slate-100 bg-white",
          day.isToday ? "bg-blue-50" : "",
        ].join(" ")}
        style={{ width: dayLabelWidth }}
      >
        <span
          className={[
            "text-[10px] font-bold uppercase tracking-widest",
            day.isToday ? "text-blue-500" : "text-slate-400",
          ].join(" ")}
        >
          {day.shortLabel ?? day.label}
        </span>
        {day.date && (
          <span
            className={[
              "text-xs font-semibold",
              day.isToday
                ? "w-[22px] h-[22px] rounded-full bg-blue-500 text-white flex items-center justify-center text-[11px]"
                : "text-slate-500",
            ].join(" ")}
          >
            {day.date.slice(-2)}
          </span>
        )}
      </div>

      {/* Timeline area */}
      <div
        className={[
          "relative flex-1 overflow-hidden",
          mode !== "read-only" ? "cursor-pointer" : "",
        ].join(" ")}
      >
        {/* ShiftOverlayLayer — blocks are independent of background */}
        <ShiftOverlayLayer
          dayIndex={day.index}
          blocks={blocks}
          axis={axis}
          rowHeight={rowHeight}
          selectedIds={selectedIds}
          mode={mode}
          callbacks={callbacks}
          renderBlock={renderBlock}
        />
      </div>
    </div>
  );
});
