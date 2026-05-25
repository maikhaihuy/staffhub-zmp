// layers/TimelineHeaderLayer.tsx
// Timeline header with period group headers and ruler slots

import React, { memo } from "react";
import type { ShiftPeriod, TimelineAxis, RulerSlot } from "../weekly-shift-grid.types";
import { toMins, timeToPercent } from "../utils/timeline";

interface TimelineHeaderLayerProps {
  periods: ShiftPeriod[];
  rulerSlots: RulerSlot[];
  axis: TimelineAxis;
  dayLabelWidth: number;
}

export const TimelineHeaderLayer = memo(function TimelineHeaderLayer({
  periods,
  rulerSlots,
  axis,
  dayLabelWidth,
}: TimelineHeaderLayerProps) {
  return (
    <div
      className="sticky top-0 z-20 bg-white"
      style={{ boxShadow: "0 1px 0 0 #e2e8f0" }}
    >
      {/* ── Row 1: Period group headers ── */}
      <div className="flex" style={{ marginLeft: dayLabelWidth }}>
        {periods.map((p) => {
          const ps = toMins(p.start);
          let pe = toMins(p.end);
          if (pe <= ps) pe += 24 * 60;
          const leftPct = timeToPercent(ps, axis);
          const widthPct = ((pe - ps) / axis.durationMins) * 100;
          return (
            <div
              key={p.id}
              className="relative flex flex-col justify-center px-3 py-1.5 overflow-hidden"
              style={{
                width: `${widthPct}%`,
                minWidth: 0,
                borderBottom: `2px solid ${p.color ?? "#e2e8f0"}`,
                borderRight: "1px solid #e2e8f0",
                background: p.color
                  ? `linear-gradient(135deg, ${p.color}14 0%, ${p.color}06 100%)`
                  : "transparent",
              }}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                {p.color && (
                  <span
                    className="shrink-0 w-2 h-2 rounded-full"
                    style={{ background: p.color }}
                  />
                )}
                <span className="text-xs font-semibold text-slate-700 truncate">
                  {p.label}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {p.start} – {p.end}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Row 2: Ruler slots ── */}
      <div
        className="relative"
        style={{ marginLeft: dayLabelWidth, height: 24 }}
      >
        {rulerSlots.map((slot, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 flex items-center justify-start pl-1.5 select-none"
            style={{
              left: `${slot.leftPct}%`,
              width: `${slot.widthPct}%`,
              borderRight:
                i < rulerSlots.length - 1 ? "1px solid #e2e8f0" : "none",
              background: i % 2 === 1 ? "rgba(148,163,184,0.05)" : "transparent",
            }}
          >
            <span className="text-[9px] font-medium text-slate-400 leading-none">
              {slot.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
