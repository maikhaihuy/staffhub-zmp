// layers/ShiftOverlayLayer.tsx
// Overlay layer rendering all shift blocks for one day

import React, { memo, useMemo } from "react";
import type { ShiftBlock as ShiftBlockType, TimelineAxis, InteractionMode, GridCallbacks, WeeklyShiftGridProps } from "../weekly-shift-grid.types";
import { blockCoords } from "../utils/timeline";
import { resolveOverlap } from "../utils/overlap";
import { ShiftBlock } from "./ShiftBlock";

interface ShiftOverlayLayerProps {
  dayIndex: number;
  blocks: ShiftBlockType[];
  axis: TimelineAxis;
  rowHeight: number;
  selectedIds: Set<string>;
  mode: InteractionMode;
  callbacks: GridCallbacks;
  renderBlock?: WeeklyShiftGridProps["renderBlock"];
}

export const ShiftOverlayLayer = memo(function ShiftOverlayLayer({
  dayIndex,
  blocks,
  axis,
  rowHeight,
  selectedIds,
  mode,
  callbacks,
  renderBlock,
}: ShiftOverlayLayerProps) {
  const overlapMap = useMemo(() => resolveOverlap(blocks, axis), [blocks, axis]);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-label={`Shifts for day ${dayIndex}`}
    >
      {blocks.map((block) => {
        const coords = blockCoords(block, axis);
        if (!coords) return null;
        const laneInfo = overlapMap.get(block.id) ?? { row: 0, totalRows: 1 };
        const isSelected = selectedIds.has(block.id);

        if (renderBlock) {
          return (
            <ShiftBlock
              key={block.id}
              block={block}
              coords={coords}
              laneInfo={laneInfo}
              rowHeight={rowHeight}
              isSelected={isSelected}
              mode={mode}
              onShiftClick={callbacks.onShiftClick}
              onShiftHover={callbacks.onShiftHover}
            >
              {renderBlock(block, {
                isSelected,
                isDisabled: !!block.disabled,
                mode,
                status: block.status,
              })}
            </ShiftBlock>
          );
        }

        return (
          <ShiftBlock
            key={block.id}
            block={block}
            coords={coords}
            laneInfo={laneInfo}
            rowHeight={rowHeight}
            isSelected={isSelected}
            mode={mode}
            onShiftClick={callbacks.onShiftClick}
            onShiftHover={callbacks.onShiftHover}
          />
        );
      })}
    </div>
  );
});
