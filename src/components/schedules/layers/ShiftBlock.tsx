// layers/ShiftBlock.tsx
// Composable shift block container with positioning and styling

import React, { memo, useCallback, useMemo, CSSProperties, ReactNode } from "react";
import type { ShiftBlock as ShiftBlockType, InteractionMode, GridCallbacks, LaneInfo, BlockCoords } from "../weekly-shift-grid.types";
import { getTokens } from "../utils/status-tokens";
import { DefaultBlockContent } from "./DefaultBlockContent";

export interface ShiftBlockProps {
  block: ShiftBlockType;
  coords: BlockCoords;
  laneInfo: LaneInfo;
  rowHeight: number;
  isSelected: boolean;
  mode: InteractionMode;
  onShiftClick?: GridCallbacks["onShiftClick"];
  onShiftHover?: GridCallbacks["onShiftHover"];
  /** Custom content. If omitted, DefaultBlockContent is used. */
  children?: ReactNode;
}

export const ShiftBlock = memo(function ShiftBlock({
  block,
  coords,
  laneInfo,
  rowHeight,
  isSelected,
  mode,
  onShiftClick,
  onShiftHover,
  children,
}: ShiftBlockProps) {
  const tokens = useMemo(() => getTokens(block.status), [block.status]);
  const isInteractive = mode !== "read-only" && !block.disabled;

  // Vertical lane subdivision
  const laneH = (rowHeight - 8) / laneInfo.totalRows; // 8px total row padding
  const topPx = 4 + laneInfo.row * laneH;
  const heightPx = Math.max(laneH - 3, 24);

  const style: CSSProperties = {
    position: "absolute",
    left: `calc(${coords.leftPct}% + 3px)`,
    width: `calc(${coords.widthPct}% - 6px)`,
    top: topPx,
    height: heightPx,
    background: tokens.bg,
    borderColor: tokens.border,
    color: tokens.text,
    zIndex: isSelected ? 15 : 8,
    minWidth: 30,
  };

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isInteractive) onShiftClick?.(block, e);
    },
    [block, isInteractive, onShiftClick]
  );

  return (
    <div
      style={style}
      className={[
        "absolute rounded-md border overflow-hidden transition-all duration-150 select-none",
        isInteractive
          ? "cursor-pointer hover:brightness-105 hover:shadow-md hover:z-30"
          : "cursor-default",
        isSelected ? "ring-2 ring-blue-400 ring-offset-1 shadow-md" : "",
        block.disabled ? "opacity-40 pointer-events-none" : "",
        block.status === "cancelled" ? "opacity-60" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
      onMouseEnter={(e) => onShiftHover?.(block, e)}
      onMouseLeave={(e) => onShiftHover?.(null, e)}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={`${block.title ?? "Shift"} ${block.start}–${block.end}`}
    >
      {children ?? (
        <DefaultBlockContent
          block={block}
          tokens={tokens}
          compact={coords.widthPct < 8 || heightPx < 30}
        />
      )}
    </div>
  );
});
