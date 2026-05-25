// layers/DefaultBlockContent.tsx
// Default visual content for shift blocks

import React, { memo } from "react";
import type { ShiftBlock, StatusTokens } from "../weekly-shift-grid.types";

interface DefaultBlockContentProps {
  block: ShiftBlock;
  tokens: StatusTokens;
  compact: boolean;
}

export const ShiftBlockHeader = memo(function ShiftBlockHeader({
  startTime,
  endTime,
  className = "",
}: {
  startTime: string;
  endTime: string;
  className?: string;
}) {
  return (
    <div className={`text-[9px] font-medium opacity-70 leading-none ${className}`}>
      {startTime} – {endTime}
    </div>
  );
});

export const ShiftBlockBody = memo(function ShiftBlockBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex-1 min-h-0 overflow-hidden ${className}`}>
      {children}
    </div>
  );
});

export const DefaultBlockContent = memo(function DefaultBlockContent({
  block,
  tokens,
  compact,
}: DefaultBlockContentProps) {
  const emp = block.metadata?.["employee"] as string | undefined;

  if (compact) {
    return (
      <div className="px-1.5 h-full flex items-center overflow-hidden">
        <span className="text-[10px] font-semibold truncate leading-none">
          {block.title ?? `${block.start}`}
        </span>
      </div>
    );
  }

  return (
    <div className="px-2 py-1 h-full flex flex-col gap-0.5 overflow-hidden">
      <ShiftBlockHeader startTime={block.start} endTime={block.end} />
      {block.title && (
        <span className="text-[11px] font-semibold leading-tight truncate">
          {block.title}
        </span>
      )}
      {emp && (
        <span className="text-[10px] opacity-75 truncate leading-tight">
          {emp}
        </span>
      )}
      {/* Status dot */}
      <span
        className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
        style={{ background: tokens.dot }}
      />
    </div>
  );
});
