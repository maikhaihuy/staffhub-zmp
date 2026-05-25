// WeeklyShiftGrid.tsx — v3
// Gantt-style workforce scheduling grid
// Architecture: GridBackgroundLayer · TimelineHeaderLayer · ShiftOverlayLayer

import React, {
  memo,
  useCallback,
  useMemo,
  useState,
  useRef,
  CSSProperties,
  ReactNode,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────────

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
  renderBlock?: (block: ShiftBlock, helpers: RenderBlockHelpers) => ReactNode;
  loading?: boolean;
}

export interface RenderBlockHelpers {
  isSelected: boolean;
  isDisabled: boolean;
  mode: InteractionMode;
  status?: ShiftStatus;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sample Data — Retail / F&B
// ─────────────────────────────────────────────────────────────────────────────

export const RETAIL_FB_PERIODS: ShiftPeriod[] = [
  { id: "morning",   label: "Ca sáng",  start: "06:00", end: "12:00", color: "#3b82f6" },
  { id: "afternoon", label: "Ca chiều", start: "12:00", end: "18:00", color: "#f59e0b" },
  { id: "evening",   label: "Ca tối",   start: "18:00", end: "23:00", color: "#8b5cf6" },
];

export const RETAIL_FB_SAMPLE_BLOCKS: ShiftBlock[] = [
  // Monday — overlapping morning blocks + cross-period 10–14
  { id: "s-mon-1", dayIndex: 0, start: "06:30", end: "10:00", title: "Mở quầy",    status: "assigned",   metadata: { employee: "Nguyễn Văn A" } },
  { id: "s-mon-2", dayIndex: 0, start: "10:00", end: "14:00", title: "Cross-period",status: "pending",    metadata: { employee: "Trần Thị B"   } },
  { id: "s-mon-3", dayIndex: 0, start: "15:00", end: "18:00", title: "Bán hàng",   status: "assigned",   metadata: { employee: "Lê Văn C"      } },

  // Tuesday — morning + cross-period evening
  { id: "s-tue-1", dayIndex: 1, start: "07:00", end: "11:30", title: "Ca sáng",    status: "assigned",   metadata: { employee: "Phạm Thị D"   } },
  { id: "s-tue-2", dayIndex: 1, start: "16:00", end: "21:00", title: "Cross-period",status: "assigned",   metadata: { employee: "Hoàng Văn E"  } },

  // Wednesday — full afternoon
  { id: "s-wed-1", dayIndex: 2, start: "12:00", end: "18:00", title: "Bán hàng",   status: "assigned",   metadata: { employee: "Vũ Thị F"      } },
  { id: "s-wed-2", dayIndex: 2, start: "19:00", end: "23:00", title: "Đóng quầy",  status: "pending",    metadata: { employee: "Đặng Văn G"    } },

  // Thursday — cancelled + normal
  { id: "s-thu-1", dayIndex: 3, start: "06:00", end: "10:00", title: "Ca sáng",    status: "cancelled",  metadata: { employee: "Bùi Thị H"     } },
  { id: "s-thu-2", dayIndex: 3, start: "13:30", end: "17:00", title: "Thu ngân",   status: "assigned",   metadata: { employee: "Ngô Văn I"     } },

  // Friday — three non-overlapping
  { id: "s-fri-1", dayIndex: 4, start: "07:00", end: "11:00", title: "Mở quầy",    status: "assigned",   metadata: { employee: "Đinh Thị J"    } },
  { id: "s-fri-2", dayIndex: 4, start: "12:30", end: "16:30", title: "Bán hàng",   status: "assigned",   metadata: { employee: "Trương Văn K"  } },
  { id: "s-fri-3", dayIndex: 4, start: "18:00", end: "22:30", title: "Ca tối",     status: "conflict",   metadata: { employee: "Lý Thị L"      } },

  // Saturday — busy, overlapping morning + cross-period
  { id: "s-sat-1", dayIndex: 5, start: "06:00", end: "09:00", title: "Kho hàng",   status: "assigned",   metadata: { employee: "Mai Văn M"     } },
  { id: "s-sat-2", dayIndex: 5, start: "09:00", end: "12:00", title: "Thu ngân",   status: "assigned",   metadata: { employee: "Hồ Thị N"      } },
  { id: "s-sat-3", dayIndex: 5, start: "11:00", end: "15:00", title: "Cross-period",status: "pending",   metadata: { employee: "Dương Văn O"   } },

  // Sunday — registered
  { id: "s-sun-1", dayIndex: 6, start: "14:00", end: "18:00", title: "Bán hàng",   status: "registered", metadata: { employee: "Cao Thị P"     } },
];

// ─────────────────────────────────────────────────────────────────────────────
// Timeline coordinate engine
// ─────────────────────────────────────────────────────────────────────────────

/** "HH:MM" → minutes-since-midnight */
function toMins(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** Build a unified [dayStart, dayEnd] axis from the ordered period list */
function buildTimelineAxis(periods: ShiftPeriod[]): { start: number; end: number; durationMins: number } {
  if (!periods.length) return { start: 0, end: 0, durationMins: 0 };
  let start = toMins(periods[0].start);
  let end   = toMins(periods[periods.length - 1].end);
  // overnight last period
  if (end <= start) end += 24 * 60;
  return { start, end, durationMins: end - start };
}

/** Convert an absolute time (mins) to a left-% on the unified timeline */
function timeToPercent(mins: number, axis: ReturnType<typeof buildTimelineAxis>): number {
  return Math.max(0, Math.min(100, ((mins - axis.start) / axis.durationMins) * 100));
}

/** Ruler slot boundaries across the full timeline */
function buildRulerSlots(
  axis: ReturnType<typeof buildTimelineAxis>,
  slotMinutes: number
): Array<{ startMins: number; endMins: number; label: string; leftPct: number; widthPct: number }> {
  const slots: ReturnType<typeof buildRulerSlots> = [];
  const firstBoundary = Math.ceil(axis.start / slotMinutes) * slotMinutes;
  // start one slot before to capture partial first slot
  let cs = firstBoundary - slotMinutes;
  let idx = 0;
  while (cs < axis.end) {
    const ce = cs + slotMinutes;
    const vs = Math.max(cs, axis.start);
    const ve = Math.min(ce, axis.end);
    if (ve > vs) {
      const hFrom = Math.floor(((cs % 1440) + 1440) % 1440 / 60) % 24;
      const hTo   = Math.floor(((ce % 1440) + 1440) % 1440 / 60) % 24;
      slots.push({
        startMins: vs,
        endMins:   ve,
        label:     `${String(hFrom).padStart(2, "0")}–${String(hTo).padStart(2, "0")}`,
        leftPct:   timeToPercent(vs, axis),
        widthPct:  ((ve - vs) / axis.durationMins) * 100,
      });
    }
    cs += slotMinutes;
    idx++;
  }
  return slots;
}

/** Compute left% and width% for a block on the unified timeline */
function blockCoords(
  block: ShiftBlock,
  axis: ReturnType<typeof buildTimelineAxis>
): { leftPct: number; widthPct: number } | null {
  if (axis.durationMins <= 0) return null;
  let bs = toMins(block.start);
  let be = toMins(block.end);
  // overnight block
  if (be < bs) be += 24 * 60;
  // clamp to timeline
  bs = Math.max(bs, axis.start);
  be = Math.min(be, axis.end);
  if (be <= bs) return null;
  return {
    leftPct:  timeToPercent(bs, axis),
    widthPct: ((be - bs) / axis.durationMins) * 100,
  };
}

/** Greedy overlap resolver — returns { row, totalRows } per block id */
function resolveOverlap(
  blocks: ShiftBlock[],
  axis: ReturnType<typeof buildTimelineAxis>
): Map<string, { row: number; totalRows: number }> {
  const sorted = [...blocks].sort((a, b) => toMins(a.start) - toMins(b.start));
  const lanes: ShiftBlock[][] = [];
  const res = new Map<string, { row: number; totalRows: number }>();

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

// ─────────────────────────────────────────────────────────────────────────────
// Status helpers
// ─────────────────────────────────────────────────────────────────────────────

interface StatusTokens { bg: string; border: string; text: string; dot: string }

const STATUS_TOKENS: Record<string, StatusTokens> = {
  assigned:   { bg: "#dbeafe", border: "#93c5fd", text: "#1e40af", dot: "#93c5fd" },
  pending:    { bg: "#fef3c7", border: "#fcd34d", text: "#92400e", dot: "#fcd34d" },
  completed:  { bg: "#d1fae5", border: "#6ee7b7", text: "#065f46", dot: "#6ee7b7" },
  cancelled:  { bg: "#fee2e2", border: "#fca5a5", text: "#991b1b", dot: "#fca5a5" },
  available:  { bg: "#f8fafc", border: "#cbd5e1", text: "#64748b", dot: "#cbd5e1" },
  registered: { bg: "#ede9fe", border: "#c4b5fd", text: "#5b21b6", dot: "#c4b5fd" },
  conflict:   { bg: "#ffe4e6", border: "#fda4af", text: "#9f1239", dot: "#fda4af" },
};
const DEFAULT_TOKENS: StatusTokens = { bg: "#f1f5f9", border: "#cbd5e1", text: "#475569", dot: "#94a3b8" };

function getTokens(status?: ShiftStatus): StatusTokens {
  return (status && STATUS_TOKENS[status]) ?? DEFAULT_TOKENS;
}

const STATUS_LABEL: Record<string, string> = {
  assigned: "Đã phân ca", pending: "Chờ duyệt", completed: "Hoàn thành",
  cancelled: "Đã hủy", available: "Trống", registered: "Đã đăng ký", conflict: "Xung đột",
};

// ─────────────────────────────────────────────────────────────────────────────
// Default weekdays
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_WEEKDAYS: WeekdayConfig[] = [
  { index: 0, label: "Thứ Hai",   shortLabel: "T2" },
  { index: 1, label: "Thứ Ba",    shortLabel: "T3" },
  { index: 2, label: "Thứ Tư",    shortLabel: "T4" },
  { index: 3, label: "Thứ Năm",   shortLabel: "T5" },
  { index: 4, label: "Thứ Sáu",   shortLabel: "T6" },
  { index: 5, label: "Thứ Bảy",   shortLabel: "T7" },
  { index: 6, label: "Chủ Nhật",  shortLabel: "CN" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── TimelineHeaderLayer ───────────────────────────────────────────────────────
//
// Renders two sub-rows:
//   Row 1 — period group headers (label + time range), each spanning its portion
//   Row 2 — ruler slots (2 h each), spanning the full timeline width
//
// Both rows use the same CSS grid column template as the day rows.

interface TimelineHeaderLayerProps {
  periods: ShiftPeriod[];
  rulerSlots: ReturnType<typeof buildRulerSlots>;
  axis: ReturnType<typeof buildTimelineAxis>;
  dayLabelWidth: number;
}

const TimelineHeaderLayer = memo(function TimelineHeaderLayer({
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
          let pe   = toMins(p.end);
          if (pe <= ps) pe += 24 * 60;
          const leftPct  = timeToPercent(ps, axis);
          const widthPct = ((pe - ps) / axis.durationMins) * 100;
          return (
            <div
              key={p.id}
              className="relative flex flex-col justify-center px-3 py-1.5 overflow-hidden"
              style={{
                width:       `${widthPct}%`,
                minWidth:    0,
                borderBottom: `2px solid ${p.color ?? "#e2e8f0"}`,
                borderRight:  "1px solid #e2e8f0",
                background:   p.color
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
              left:       `${slot.leftPct}%`,
              width:      `${slot.widthPct}%`,
              borderRight: i < rulerSlots.length - 1
                ? "1px solid #e2e8f0"
                : "none",
              background: i % 2 === 1
                ? "rgba(148,163,184,0.05)"
                : "transparent",
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

// ── GridBackgroundLayer ───────────────────────────────────────────────────────
//
// Full-width ruler column stripes that run vertically through ALL day rows.
// Rendered once, absolutely positioned behind the overlay layer.

interface GridBackgroundLayerProps {
  rulerSlots: ReturnType<typeof buildRulerSlots>;
  periods: ShiftPeriod[];
  axis: ReturnType<typeof buildTimelineAxis>;
  dayLabelWidth: number;
  totalHeight: number; // px — set after row heights are known
}

const GridBackgroundLayer = memo(function GridBackgroundLayer({
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
            left:       `${slot.leftPct}%`,
            width:      `${slot.widthPct}%`,
            background: i % 2 === 1
              ? "rgba(148,163,184,0.045)"
              : "transparent",
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
              left:        `${leftPct}%`,
              width:        1,
              background:  p.color
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
              left:       `${slot.leftPct + slot.widthPct}%`,
              width:       1,
              background:  "rgba(226,232,240,0.8)",
            }}
          />
        )
      ))}
    </div>
  );
});

// ── ShiftBlock (composable container) ────────────────────────────────────────
//
// Handles only: positioning · sizing · hover/select state · container styling.
// Inner content is fully controlled by children.

export interface ShiftBlockProps {
  block: ShiftBlock;
  coords: { leftPct: number; widthPct: number };
  laneInfo: { row: number; totalRows: number };
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
  const tokens      = useMemo(() => getTokens(block.status), [block.status]);
  const isInteractive = mode !== "read-only" && !block.disabled;

  // Vertical lane subdivision
  const laneH    = (rowHeight - 8) / laneInfo.totalRows; // 8px total row padding
  const topPx    = 4 + laneInfo.row * laneH;
  const heightPx = Math.max(laneH - 3, 24);

  const style: CSSProperties = {
    position: "absolute",
    left:     `calc(${coords.leftPct}% + 3px)`,
    width:    `calc(${coords.widthPct}% - 6px)`,
    top:      topPx,
    height:   heightPx,
    background:   tokens.bg,
    borderColor:  tokens.border,
    color:        tokens.text,
    zIndex:       isSelected ? 15 : 8,
    minWidth:     30,
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
      ].filter(Boolean).join(" ")}
      onClick={handleClick}
      onMouseEnter={e => onShiftHover?.(block, e)}
      onMouseLeave={e => onShiftHover?.(null, e)}
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

// ── ShiftBlockHeader / ShiftBlockBody ─────────────────────────────────────────

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
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex-1 min-h-0 overflow-hidden ${className}`}>
      {children}
    </div>
  );
});

// ── DefaultBlockContent ───────────────────────────────────────────────────────

interface DefaultBlockContentProps {
  block: ShiftBlock;
  tokens: StatusTokens;
  compact: boolean;
}

const DefaultBlockContent = memo(function DefaultBlockContent({
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

// ── ShiftOverlayLayer ─────────────────────────────────────────────────────────
//
// One layer per day row. Positions all blocks for that day absolutely
// on the unified timeline. Completely independent of period cells.

interface ShiftOverlayLayerProps {
  dayIndex: number;
  blocks: ShiftBlock[];
  axis: ReturnType<typeof buildTimelineAxis>;
  rowHeight: number;
  selectedIds: Set<string>;
  mode: InteractionMode;
  callbacks: GridCallbacks;
  renderBlock?: WeeklyShiftGridProps["renderBlock"];
}

const ShiftOverlayLayer = memo(function ShiftOverlayLayer({
  dayIndex,
  blocks,
  axis,
  rowHeight,
  selectedIds,
  mode,
  callbacks,
  renderBlock,
}: ShiftOverlayLayerProps) {
  const overlapMap = useMemo(
    () => resolveOverlap(blocks, axis),
    [blocks, axis]
  );

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-label={`Shifts for day ${dayIndex}`}
    >
      {blocks.map(block => {
        const coords = blockCoords(block, axis);
        if (!coords) return null;
        const laneInfo   = overlapMap.get(block.id) ?? { row: 0, totalRows: 1 };
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

// ── DayRow ────────────────────────────────────────────────────────────────────

interface DayRowProps {
  day: WeekdayConfig;
  blocks: ShiftBlock[];
  axis: ReturnType<typeof buildTimelineAxis>;
  rulerSlots: ReturnType<typeof buildRulerSlots>;
  rowHeight: number;
  selectedIds: Set<string>;
  mode: InteractionMode;
  callbacks: GridCallbacks;
  dayLabelWidth: number;
  renderBlock?: WeeklyShiftGridProps["renderBlock"];
}

const DayRow = memo(function DayRow({
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
      const relX   = (e.clientX - rect.left - dayLabelWidth) / (rect.width - dayLabelWidth);
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

// ── Legend ────────────────────────────────────────────────────────────────────

const GridLegend = memo(function GridLegend({
  statuses,
}: {
  statuses: string[];
}) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-4 py-2.5 bg-slate-50 border-t border-slate-100">
      {statuses.map(s => {
        const tk = STATUS_TOKENS[s];
        if (!tk) return null;
        return (
          <div key={s} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm border"
              style={{ background: tk.bg, borderColor: tk.border }}
            />
            <span className="text-[11px] text-slate-500">
              {STATUS_LABEL[s] ?? s}
            </span>
          </div>
        );
      })}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// WeeklyShiftGrid — main component
// ─────────────────────────────────────────────────────────────────────────────

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
  const DAY_LABEL_WIDTH = 52; // px

  // ── Derived timeline structures (memoised) ──────────────────────────────────
  const axis       = useMemo(() => buildTimelineAxis(periods), [periods]);
  const rulerSlots = useMemo(
    () => buildRulerSlots(axis, rulerSlotMinutes),
    [axis, rulerSlotMinutes]
  );

  // ── Block map: dayIndex → blocks[] ─────────────────────────────────────────
  const blockMap = useMemo(() => {
    const map: Record<number, ShiftBlock[]> = {};
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
          setInternalSelected(prev => {
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
    () => [...new Set(blocks.map(b => b.status).filter(Boolean) as string[])],
    [blocks]
  );

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={`rounded-xl border border-slate-200 overflow-hidden ${className}`}>
        <div className="animate-pulse">
          <div className="h-[58px] bg-slate-100 border-b border-slate-200" />
          {weekdays.map(d => (
            <div key={d.index} className="flex border-b border-slate-100" style={{ height: rowHeight }}>
              <div className="shrink-0 bg-slate-50" style={{ width: DAY_LABEL_WIDTH }} />
              <div className="flex-1 p-3 flex gap-2">
                {[...Array(Math.floor(Math.random() * 3) + 1)].map((_, i) => (
                  <div key={i} className="rounded-md bg-slate-100 h-10" style={{ width: `${20 + Math.random() * 30}%` }} />
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
        <div
          className="relative"
          style={{ minWidth: 560 }}
        >
          {/* ── TimelineHeaderLayer ── */}
          <div style={{ paddingLeft: DAY_LABEL_WIDTH }}>
            {/* We render the header using absolute positioning trick:
                  the outer div takes the day-label space as left padding,
                  then the header renders flush left on the timeline. */}
          </div>
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
            {weekdays.map(day => (
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

export default WeeklyShiftGrid;