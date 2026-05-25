// weekly-shift-grid.types.ts
// Type definitions for WeeklyShiftGrid component system

export type InteractionMode =
  | "read-only"
  | "selectable"
  | "clickable"
  | "draggable-ready";

export type ShiftStatus =
  | "assigned"
  | "pending"
  | "completed"
  | "cancelled"
  | "available"
  | "registered"
  | "conflict"
  | string;

/** A visual period grouping. Does NOT act as a rendering boundary. */
export interface ShiftPeriod {
  id: string;
  label: string;      // "Ca sáng"
  start: string;      // "HH:MM" 24h — must align with timeline dayStart
  end: string;        // "HH:MM" 24h
  color?: string;     // accent colour for header
}

/** One shift block. start/end are absolute daily times, not period-relative. */
export interface ShiftBlock {
  id: string;
  dayIndex: number;   // 0 = Monday … 6 = Sunday
  start: string;      // "HH:MM" — may cross period boundaries
  end: string;        // "HH:MM"
  /** Kept for convenience; not used for positioning */
  periodId?: string;
  title?: string;
  status?: ShiftStatus;
  disabled?: boolean;
  metadata?: Record<string, unknown>;
}

export interface WeekdayConfig {
  index: number;
  label: string;
  shortLabel?: string;
  date?: string;      // e.g. "2025-05-19" — last two chars used for display
  isToday?: boolean;
}

export interface GridCallbacks {
  onShiftClick?: (block: ShiftBlock, e: React.MouseEvent) => void;
  onShiftHover?: (block: ShiftBlock | null, e: React.MouseEvent) => void;
  /** Clicked anywhere inside a day row (may or may not be on a block) */
  onRowClick?: (dayIndex: number, timeApprox: string, e: React.MouseEvent) => void;
}

export interface WeeklyShiftGridProps {
  /** Ordered shift periods — define the timeline span collectively */
  periods: ShiftPeriod[];
  weekdays?: WeekdayConfig[];
  blocks?: ShiftBlock[];
  mode?: InteractionMode;
  selectedIds?: string[];
  callbacks?: GridCallbacks;
  className?: string;
  /** Slot width in minutes for the time ruler. Default: 120 (2 h) */
  rulerSlotMinutes?: number;
  /** Minimum row height in px. Default: 80 */
  rowHeight?: number;
  /** Custom block renderer — receives block + computed style props */
  renderBlock?: (block: ShiftBlock, helpers: RenderBlockHelpers) => React.ReactNode;
  loading?: boolean;
}

export interface RenderBlockHelpers {
  isSelected: boolean;
  isDisabled: boolean;
  mode: InteractionMode;
  status?: ShiftStatus;
}

export interface StatusTokens {
  bg: string;
  border: string;
  text: string;
  dot: string;
}

export interface TimelineAxis {
  start: number;
  end: number;
  durationMins: number;
}

export interface RulerSlot {
  startMins: number;
  endMins: number;
  label: string;
  leftPct: number;
  widthPct: number;
}

export interface BlockCoords {
  leftPct: number;
  widthPct: number;
}

export interface LaneInfo {
  row: number;
  totalRows: number;
}
