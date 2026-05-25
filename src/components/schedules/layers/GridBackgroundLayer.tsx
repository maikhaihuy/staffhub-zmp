// layers/GridBackgroundLayer.tsx
// Background vertical ruler stripes spanning all day rows

import React, { memo } from "react";
import type { ShiftPeriod, TimelineAxis, RulerSlot } from "../weekly-shift-grid.types";
import { toMins, timeToPercent } from "../utils/timeline";

interface GridBackgroundLayerProps {
  rulerSlots: RulerSlot[];
  periods: ShiftPeriod[];
  axis: TimelineAxis;
  dayLabelWidth: number;
  totalHeight: number;
}

export const GridBackgroundLayer = memo(function GridBackgroundLayer({
  rulerSlots,
  periods,
  axis,
  dayLabelWidth,
  totalHeight,
}: GridBackgroundLayerProps) {
  return (
    <div
      className="absolute top-0 bottom-0 pointer-events-none"
      style={{ left: dayLabelWidth, right: 0 }}
    >
      {/* Alternating slot shading */}
      {rulerSlots.map((slot, i) => (
        <div
          key={`shade-${i}`}
          className="absolute top-0 bottom-0"
          style={{
            left: `${slot.leftPct}%`,
            width: `${slot.widthPct}%`,
            background: i % 2 === 1 ? "rgba(148,163,184,0.045)" : "transparent",
          }}
        />
      ))}

      {/* Period boundary lines */}
      {periods.map((p, i) => {
        if (i === 0) return null;
        const leftPct = timeToPercent(toMins(p.start), axis);
        return (
          <div
            key={`period-line-${p.id}`}
            className="absolute top-0 bottom-0"
            style={{
              left: `${leftPct}%`,
              width: 1,
              background: p.color
                ? `linear-gradient(to bottom, ${p.color}55, ${p.color}22)`
                : "#e2e8f0",
            }}
          />
        );
      })}

      {/* Slot divider lines */}
      {rulerSlots.map((slot, i) => (
        i < rulerSlots.length - 1 && (
          <div
            key={`div-${i}`}
            className="absolute top-0 bottom-0"
            style={{
              left: `${slot.leftPct + slot.widthPct}%`,
              width: 1,
              background: "rgba(226,232,240,0.8)",
            }}
          />
        )
      ))}
    </div>
  );
});
