import type { ReactNode } from "react";

export type ScheduleLaneId = string;

export type ScheduleLane = {
  id: ScheduleLaneId;
  label: string;
};

export type MasterShiftSegment = {
  id: string;
  name: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
};

export type ScheduleDay = {
  date: string; // YYYY-MM-DD
  label: string; // Mon, Tue, etc.
  displayDate: string; // 27/05, etc.
};

export type ScheduleBlock = {
  id: string;
  date: string; // YYYY-MM-DD
  laneId: ScheduleLaneId;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  title: string;
  description?: string;
  subtitle?: string;
  status?: string;
  meta?: Record<string, unknown>;
};

export type NormalizedScheduleBlock = ScheduleBlock & {
  startMinute: number;
  endMinute: number;
  leftPercent: number;
  widthPercent: number;
};

export type TimeSlot = {
  startMinute: number;
  endMinute: number;
  label: string;
};

export type WeeklyScheduleGridProps = {
  days: ScheduleDay[];
  masterShifts: MasterShiftSegment[];
  blocks: ScheduleBlock[];
  lanes: ScheduleLane[];
  durationMinutes?: number;
  slotWidth?: number;
  renderBlock?: (
    block: NormalizedScheduleBlock,
    context: {
      lane: ScheduleLane;
      day: ScheduleDay;
    }
  ) => ReactNode;
  onBlockClick?: (block: NormalizedScheduleBlock) => void;
};
