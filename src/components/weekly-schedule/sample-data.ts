import type {
  MasterShiftSegment,
  ScheduleBlock,
  ScheduleDay,
  ScheduleLane,
} from "./types";

export const sampleScheduleDays: ScheduleDay[] = [
  {
    date: "2025-05-26",
    label: "Mon",
    displayDate: "26/05",
  },
  {
    date: "2025-05-27",
    label: "Tue",
    displayDate: "27/05",
  },
  {
    date: "2025-05-28",
    label: "Wed",
    displayDate: "28/05",
  },
  {
    date: "2025-05-29",
    label: "Thu",
    displayDate: "29/05",
  },
  {
    date: "2025-05-30",
    label: "Fri",
    displayDate: "30/05",
  },
  {
    date: "2025-05-31",
    label: "Sat",
    displayDate: "31/05",
  },
  {
    date: "2025-06-01",
    label: "Sun",
    displayDate: "01/06",
  },
];

export const sampleScheduleLanes: ScheduleLane[] = [
  {
    id: "main",
    label: "Main",
  },
  {
    id: "support",
    label: "Support",
  },
];

export const sampleMasterShifts: MasterShiftSegment[] = [
  {
    id: "morning",
    name: "Morning",
    startTime: "08:00",
    endTime: "12:00",
  },
  {
    id: "afternoon",
    name: "Afternoon",
    startTime: "12:00",
    endTime: "18:00",
  },
  {
    id: "evening",
    name: "Evening",
    startTime: "18:00",
    endTime: "22:00",
  },
];

export const sampleScheduleBlocks: ScheduleBlock[] = [
  {
    id: "monday-main",
    date: "2025-05-26",
    laneId: "main",
    startTime: "08:00",
    endTime: "12:00",
    title: "Monday main",
    description: "Morning",
    status: "open",
  },
  {
    id: "monday-support",
    date: "2025-05-26",
    laneId: "support",
    startTime: "09:00",
    endTime: "13:00",
    title: "Monday support",
    description: "Support",
    status: "open",
  },
  {
    id: "tuesday-main",
    date: "2025-05-27",
    laneId: "main",
    startTime: "12:00",
    endTime: "18:00",
    title: "Tuesday main",
    description: "Afternoon",
    status: "upcoming",
  },
  {
    id: "wednesday-support",
    date: "2025-05-28",
    laneId: "support",
    startTime: "18:00",
    endTime: "22:00",
    title: "Wednesday support",
    description: "Evening",
    status: "assigned",
  },
  {
    id: "thursday-main",
    date: "2025-05-29",
    laneId: "main",
    startTime: "10:00",
    endTime: "16:00",
    title: "Thursday main",
    description: "Spans periods",
    status: "assigned",
  },
  {
    id: "friday-support",
    date: "2025-05-30",
    laneId: "support",
    startTime: "09:00",
    endTime: "12:00",
    title: "Friday support",
    description: "Morning",
    status: "conflict",
  },
  {
    id: "saturday-main",
    date: "2025-05-31",
    laneId: "main",
    startTime: "08:00",
    endTime: "18:00",
    title: "Saturday full day",
    description: "Long shift",
    status: "completed",
  },
  {
    id: "sunday-support",
    date: "2025-06-01",
    laneId: "support",
    startTime: "18:00",
    endTime: "22:00",
    title: "Sunday support",
    description: "Evening",
    status: "missed",
  },
];
