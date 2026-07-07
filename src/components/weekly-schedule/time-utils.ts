import type {
  MasterShiftSegment,
  NormalizedScheduleBlock,
  ScheduleBlock,
  TimeSlot,
} from "./types";

const MINUTES_PER_DAY = 24 * 60;
const DEFAULT_RULER_START_MINUTE = 8 * 60;
const DEFAULT_RULER_END_MINUTE = 22 * 60;

export function timeToMinutes(time: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(time);

  if (!match) {
    return 0;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return 0;
  }

  return hours * 60 + minutes;
}

export function minutesToTimeLabel(minutes: number): string {
  if (!Number.isFinite(minutes)) {
    return "00:00";
  }

  const normalizedMinutes =
    ((Math.floor(minutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) %
    MINUTES_PER_DAY;
  const hours = Math.floor(normalizedMinutes / 60);
  const remainingMinutes = normalizedMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    remainingMinutes
  ).padStart(2, "0")}`;
}

export function normalizeEndMinute(
  startMinute: number,
  endMinute: number
): number {
  if (endMinute <= startMinute) {
    return endMinute + MINUTES_PER_DAY;
  }

  return endMinute;
}

export function getRulerRange(masterShifts: MasterShiftSegment[]): {
  startMinute: number;
  endMinute: number;
} {
  if (masterShifts.length === 0) {
    return {
      startMinute: DEFAULT_RULER_START_MINUTE,
      endMinute: DEFAULT_RULER_END_MINUTE,
    };
  }

  const ranges = masterShifts.map((masterShift) => {
    const startMinute = timeToMinutes(masterShift.startTime);
    const endMinute = normalizeEndMinute(
      startMinute,
      timeToMinutes(masterShift.endTime)
    );

    return {
      startMinute,
      endMinute,
    };
  });

  return {
    startMinute: Math.min(...ranges.map((range) => range.startMinute)),
    endMinute: Math.max(...ranges.map((range) => range.endMinute)),
  };
}

export function buildTimeSlots(params: {
  startMinute: number;
  endMinute: number;
  durationMinutes: number;
}): TimeSlot[] {
  const { startMinute, endMinute, durationMinutes } = params;

  if (
    !Number.isFinite(startMinute) ||
    !Number.isFinite(endMinute) ||
    !Number.isFinite(durationMinutes) ||
    durationMinutes <= 0 ||
    endMinute <= startMinute
  ) {
    return [];
  }

  const slots: TimeSlot[] = [];

  for (
    let currentStartMinute = startMinute;
    currentStartMinute < endMinute;
    currentStartMinute += durationMinutes
  ) {
    const currentEndMinute = Math.min(
      currentStartMinute + durationMinutes,
      endMinute
    );

    slots.push({
      startMinute: currentStartMinute,
      endMinute: currentEndMinute,
      label: `${minutesToTimeLabel(currentStartMinute)}-${minutesToTimeLabel(
        currentEndMinute
      )}`,
    });
  }

  return slots;
}

export function normalizeBlock(params: {
  block: ScheduleBlock;
  rulerStartMinute: number;
  rulerEndMinute: number;
}): NormalizedScheduleBlock {
  const { block, rulerStartMinute, rulerEndMinute } = params;
  const startMinute = timeToMinutes(block.startTime);
  const endMinute = normalizeEndMinute(
    startMinute,
    timeToMinutes(block.endTime)
  );
  const total = rulerEndMinute - rulerStartMinute;

  if (
    !Number.isFinite(total) ||
    total <= 0 ||
    !Number.isFinite(startMinute) ||
    !Number.isFinite(endMinute)
  ) {
    return {
      ...block,
      startMinute,
      endMinute,
      leftPercent: 0,
      widthPercent: 0,
    };
  }

  const rawLeftPercent = ((startMinute - rulerStartMinute) / total) * 100;
  const rawWidthPercent = ((endMinute - startMinute) / total) * 100;
  const leftPercent = Math.min(100, Math.max(0, rawLeftPercent));
  const maxWidthPercent = Math.max(0, 100 - leftPercent);
  const widthPercent = Math.min(
    maxWidthPercent,
    Math.max(0, rawWidthPercent)
  );

  return {
    ...block,
    startMinute,
    endMinute,
    leftPercent,
    widthPercent,
  };
}

export function normalizeBlocks(params: {
  blocks: ScheduleBlock[];
  rulerStartMinute: number;
  rulerEndMinute: number;
}): NormalizedScheduleBlock[] {
  const { blocks, rulerStartMinute, rulerEndMinute } = params;

  return blocks.map((block) =>
    normalizeBlock({
      block,
      rulerStartMinute,
      rulerEndMinute,
    })
  );
}

function formatCompactTime(minutes: number): string {
  const label = minutesToTimeLabel(minutes);
  const [hour, minute] = label.split(":");

  return minute === "00" ? hour : label;
}

export function formatCompactSlotLabel(slot: TimeSlot): string {
  return `${formatCompactTime(slot.startMinute)}-${formatCompactTime(
    slot.endMinute
  )}`;
}
