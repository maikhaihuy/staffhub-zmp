import { useMemo, useRef } from "react";
import type { KeyboardEvent, RefObject } from "react";

import { DefaultShiftBlock } from "./shift-blocks";
import {
  buildTimeSlots,
  formatCompactSlotLabel,
  getRulerRange,
  normalizeEndMinute,
  normalizeBlocks,
  timeToMinutes,
} from "./time-utils";
import type {
  MasterShiftSegment,
  NormalizedScheduleBlock,
  ScheduleDay,
  ScheduleLane,
  TimeSlot,
  WeeklyScheduleGridProps,
} from "./types";

const DEFAULT_DURATION_MINUTES = 120;
const DEFAULT_SLOT_WIDTH = 88;
const DAY_COLUMN_WIDTH = 52;
const RULER_HEIGHT = 40;
const LANE_HEIGHT = 52;

type RenderBlock = WeeklyScheduleGridProps["renderBlock"];

function getMasterShiftBoundaryPercents(params: {
  masterShifts: MasterShiftSegment[];
  rulerStartMinute: number;
  rulerEndMinute: number;
}): number[] {
  const { masterShifts, rulerStartMinute, rulerEndMinute } = params;
  const totalMinutes = rulerEndMinute - rulerStartMinute;

  if (totalMinutes <= 0) {
    return [];
  }

  const boundaryMinutes = masterShifts.reduce<number[]>((minutes, masterShift) => {
    const startMinute = timeToMinutes(masterShift.startTime);
    const endMinute = normalizeEndMinute(
      startMinute,
      timeToMinutes(masterShift.endTime),
    );

    minutes.push(startMinute, endMinute);
    return minutes;
  }, []);

  return Array.from(
    new Set(
      boundaryMinutes.filter(
        (minute) => minute > rulerStartMinute && minute < rulerEndMinute,
      ),
    ),
  )
    .sort((a, b) => a - b)
    .map((minute) => ((minute - rulerStartMinute) / totalMinutes) * 100);
}

function MasterShiftBoundaryLines({ boundaries }: { boundaries: number[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {boundaries.map((leftPercent) => (
        <div
          className="absolute inset-y-0 border-l-2 border-slate-300"
          key={leftPercent}
          style={{ left: `${leftPercent}%` }}
        />
      ))}
    </div>
  );
}

function getBlocksForLane(params: {
  blocks: NormalizedScheduleBlock[];
  day: ScheduleDay;
  lane: ScheduleLane;
}) {
  const { blocks, day, lane } = params;

  return blocks.filter(
    (block) => block.date === day.date && block.laneId === lane.id,
  );
}

function TimeRuler({
  slots,
  masterShiftBoundaries,
  contentMinWidth,
  timelineMinWidth,
  gridTemplateColumns,
  timelineRef,
}: {
  slots: TimeSlot[];
  masterShiftBoundaries: number[];
  contentMinWidth: number;
  timelineMinWidth: number;
  gridTemplateColumns: string;
  timelineRef: RefObject<HTMLDivElement>;
}) {
  return (
    <div className="flex bg-white" style={{ minWidth: contentMinWidth }}>
      <div
        className="z-20 shrink-0 border-b border-r border-slate-200 bg-slate-50"
        style={{ width: DAY_COLUMN_WIDTH, height: RULER_HEIGHT }}
      />

      <div
        ref={timelineRef}
        className="relative grid flex-1 border-b border-slate-200 bg-slate-50 will-change-transform"
        style={{
          minWidth: timelineMinWidth,
          gridTemplateColumns,
          height: RULER_HEIGHT,
        }}
      >
        {slots.map((slot) => (
          <div
            className="flex items-center justify-center border-r border-slate-200 px-1 text-[11px] font-medium leading-none text-slate-500 last:border-r-0"
            key={`${slot.startMinute}-${slot.endMinute}`}
          >
            {formatCompactSlotLabel(slot)}
          </div>
        ))}

        <MasterShiftBoundaryLines boundaries={masterShiftBoundaries} />

        {slots.length === 0 ? (
          <div className="flex items-center justify-center px-1 text-[11px] font-medium leading-none text-slate-500">
            --
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DayLabelCell({
  day,
  dayRowHeight,
}: {
  day: ScheduleDay;
  dayRowHeight: number;
}) {
  return (
    <div
      className="box-border flex shrink-0 sticky left-0 z-10 items-center border-b border-r border-slate-100 bg-slate-50 px-2"
      style={{ width: DAY_COLUMN_WIDTH, height: dayRowHeight }}
    >
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold leading-4 text-slate-900">
          {day.label}
        </div>
        <div className="mt-0.5 truncate text-[11px] leading-3 text-slate-500">
          {day.displayDate}
        </div>
      </div>
    </div>
  );
}

function SlotGridLines({
  day,
  lane,
  slotCount,
  gridTemplateColumns,
}: {
  day: ScheduleDay;
  lane: ScheduleLane;
  slotCount: number;
  gridTemplateColumns: string;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 grid"
      style={{ gridTemplateColumns }}
    >
      {Array.from({ length: slotCount }).map((_, index) => (
        <div
          className="border-r border-slate-100 last:border-r-0"
          key={`${day.date}-${lane.id}-slot-${index}`}
        />
      ))}
    </div>
  );
}

function ScheduleBlockWrapper({
  block,
  day,
  lane,
  renderBlock,
  onBlockClick,
}: {
  block: NormalizedScheduleBlock;
  day: ScheduleDay;
  lane: ScheduleLane;
  renderBlock?: RenderBlock;
  onBlockClick?: WeeklyScheduleGridProps["onBlockClick"];
}) {
  const className = `absolute inset-y-1.5 z-20 ${
    renderBlock && onBlockClick ? "cursor-pointer" : ""
  }`;
  const style = {
    left: `${block.leftPercent}%`,
    width: `${block.widthPercent}%`,
  };

  if (renderBlock) {
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!onBlockClick) {
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onBlockClick(block);
      }
    };

    return (
      <div
        className={className}
        role={onBlockClick ? "button" : undefined}
        tabIndex={onBlockClick ? 0 : undefined}
        style={style}
        onClick={onBlockClick ? () => onBlockClick(block) : undefined}
        onKeyDown={onBlockClick ? handleKeyDown : undefined}
      >
        {renderBlock(block, { day, lane })}
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <DefaultShiftBlock
        block={block}
        onClick={onBlockClick ? () => onBlockClick(block) : undefined}
      />
    </div>
  );
}

function LaneRow({
  day,
  lane,
  laneIndex,
  isLastDay,
  isLastLane,
  blocks,
  masterShiftBoundaries,
  slotCount,
  gridTemplateColumns,
  renderBlock,
  onBlockClick,
}: {
  day: ScheduleDay;
  lane: ScheduleLane;
  laneIndex: number;
  isLastDay: boolean;
  isLastLane: boolean;
  blocks: NormalizedScheduleBlock[];
  masterShiftBoundaries: number[];
  slotCount: number;
  gridTemplateColumns: string;
  renderBlock?: RenderBlock;
  onBlockClick?: WeeklyScheduleGridProps["onBlockClick"];
}) {
  const showSolidDayBorder = isLastLane && !isLastDay;
  const laneClassName = `relative box-border ${
    laneIndex % 2 === 0 ? "bg-white" : "bg-slate-50/70"
  } ${
    isLastLane
      ? showSolidDayBorder
        ? "border-b border-solid border-slate-100"
        : ""
      : "border-b border-dashed border-slate-200"
  }`;

  return (
    <div
      className={laneClassName}
      key={`${day.date}-${lane.id}`}
      style={{ height: LANE_HEIGHT }}
    >
      <SlotGridLines
        day={day}
        lane={lane}
        slotCount={slotCount}
        gridTemplateColumns={gridTemplateColumns}
      />
      <MasterShiftBoundaryLines boundaries={masterShiftBoundaries} />

      <div className="pointer-events-none absolute left-2 top-1 z-10 text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {lane.label}
      </div>

      {blocks.map((block) => (
        <ScheduleBlockWrapper
          block={block}
          day={day}
          key={block.id}
          lane={lane}
          renderBlock={renderBlock}
          onBlockClick={onBlockClick}
        />
      ))}
    </div>
  );
}

function DayRow({
  day,
  dayIndex,
  daysLength,
  lanes,
  blocks,
  masterShiftBoundaries,
  dayRowHeight,
  contentMinWidth,
  timelineMinWidth,
  slotCount,
  gridTemplateColumns,
  renderBlock,
  onBlockClick,
}: {
  day: ScheduleDay;
  dayIndex: number;
  daysLength: number;
  lanes: ScheduleLane[];
  blocks: NormalizedScheduleBlock[];
  masterShiftBoundaries: number[];
  dayRowHeight: number;
  contentMinWidth: number;
  timelineMinWidth: number;
  slotCount: number;
  gridTemplateColumns: string;
  renderBlock?: RenderBlock;
  onBlockClick?: WeeklyScheduleGridProps["onBlockClick"];
}) {
  const isLastDay = dayIndex === daysLength - 1;

  return (
    <div
      className="flex min-w-full"
      style={{ height: dayRowHeight, minWidth: contentMinWidth }}
    >
      <DayLabelCell day={day} dayRowHeight={dayRowHeight} />

      <div
        className="relative z-0 flex-1 bg-white"
        style={{ minWidth: timelineMinWidth, height: dayRowHeight }}
      >
        {lanes.map((lane, laneIndex) => (
          <LaneRow
            blocks={getBlocksForLane({ blocks, day, lane })}
            day={day}
            gridTemplateColumns={gridTemplateColumns}
            isLastDay={isLastDay}
            isLastLane={laneIndex === lanes.length - 1}
            key={`${day.date}-${lane.id}`}
            lane={lane}
            laneIndex={laneIndex}
            masterShiftBoundaries={masterShiftBoundaries}
            onBlockClick={onBlockClick}
            renderBlock={renderBlock}
            slotCount={slotCount}
          />
        ))}
      </div>
    </div>
  );
}

export function WeeklyScheduleGrid({
  days,
  masterShifts,
  blocks,
  lanes,
  durationMinutes = DEFAULT_DURATION_MINUTES,
  slotWidth = DEFAULT_SLOT_WIDTH,
  renderBlock,
  onBlockClick,
}: WeeklyScheduleGridProps) {
  const rulerTimelineRef = useRef<HTMLDivElement>(null);

  const { startMinute, endMinute } = useMemo(
    () => getRulerRange(masterShifts),
    [masterShifts],
  );

  const slots = useMemo(
    () =>
      buildTimeSlots({
        startMinute,
        endMinute,
        durationMinutes,
      }),
    [durationMinutes, endMinute, startMinute],
  );

  const normalizedBlocks = useMemo(
    () =>
      normalizeBlocks({
        blocks,
        rulerStartMinute: startMinute,
        rulerEndMinute: endMinute,
      }),
    [blocks, endMinute, startMinute],
  );

  const masterShiftBoundaries = useMemo(
    () =>
      getMasterShiftBoundaryPercents({
        masterShifts,
        rulerStartMinute: startMinute,
        rulerEndMinute: endMinute,
      }),
    [endMinute, masterShifts, startMinute],
  );

  const slotMinWidth = slotWidth;
  const slotCount = Math.max(slots.length, 1);
  const timelineMinWidth = slotCount * slotMinWidth;
  const gridTemplateColumns = `repeat(${slotCount}, minmax(${slotMinWidth}px, 1fr))`;
  const dayRowHeight = Math.max(lanes.length, 1) * LANE_HEIGHT;
  const contentMinWidth = timelineMinWidth + DAY_COLUMN_WIDTH;

  return (
    <div className="w-full">
      <div
        className="sticky z-30 w-full overflow-hidden bg-white"
        style={{ top: "var(--weekly-schedule-sticky-top, 0px)" }}
      >
        <TimeRuler
          slots={slots}
          masterShiftBoundaries={masterShiftBoundaries}
          contentMinWidth={contentMinWidth}
          timelineMinWidth={timelineMinWidth}
          gridTemplateColumns={gridTemplateColumns}
          timelineRef={rulerTimelineRef}
        />
      </div>

      <div
        className="w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]"
        onScroll={(event) => {
          if (!rulerTimelineRef.current) {
            return;
          }

          rulerTimelineRef.current.style.transform = `translateX(-${event.currentTarget.scrollLeft}px)`;
        }}
      >
        {days.map((day, dayIndex) => (
          <DayRow
            blocks={normalizedBlocks}
            contentMinWidth={contentMinWidth}
            day={day}
            dayIndex={dayIndex}
            dayRowHeight={dayRowHeight}
            daysLength={days.length}
            gridTemplateColumns={gridTemplateColumns}
            key={day.date}
            lanes={lanes}
            masterShiftBoundaries={masterShiftBoundaries}
            onBlockClick={onBlockClick}
            renderBlock={renderBlock}
            slotCount={slotCount}
            timelineMinWidth={timelineMinWidth}
          />
        ))}
      </div>
    </div>
  );
}
