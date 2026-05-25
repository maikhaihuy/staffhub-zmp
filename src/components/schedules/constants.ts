// constants.ts
// Sample data and default configurations

import type { ShiftPeriod, ShiftBlock, WeekdayConfig } from "../weekly-shift-grid.types";

export const RETAIL_FB_PERIODS: ShiftPeriod[] = [
  { id: "morning", label: "Ca sáng", start: "06:00", end: "12:00", color: "#3b82f6" },
  { id: "afternoon", label: "Ca chiều", start: "12:00", end: "18:00", color: "#f59e0b" },
  { id: "evening", label: "Ca tối", start: "18:00", end: "23:00", color: "#8b5cf6" },
];

export const RETAIL_FB_SAMPLE_BLOCKS: ShiftBlock[] = [
  // Monday — overlapping morning blocks + cross-period 10–14
  {
    id: "s-mon-1",
    dayIndex: 0,
    start: "06:30",
    end: "10:00",
    title: "Mở quầy",
    status: "assigned",
    metadata: { employee: "Nguyễn Văn A" },
  },
  {
    id: "s-mon-2",
    dayIndex: 0,
    start: "10:00",
    end: "14:00",
    title: "Cross-period",
    status: "pending",
    metadata: { employee: "Trần Thị B" },
  },
  {
    id: "s-mon-3",
    dayIndex: 0,
    start: "15:00",
    end: "18:00",
    title: "Bán hàng",
    status: "assigned",
    metadata: { employee: "Lê Văn C" },
  },

  // Tuesday — morning + cross-period evening
  {
    id: "s-tue-1",
    dayIndex: 1,
    start: "07:00",
    end: "11:30",
    title: "Ca sáng",
    status: "assigned",
    metadata: { employee: "Phạm Thị D" },
  },
  {
    id: "s-tue-2",
    dayIndex: 1,
    start: "16:00",
    end: "21:00",
    title: "Cross-period",
    status: "assigned",
    metadata: { employee: "Hoàng Văn E" },
  },

  // Wednesday — full afternoon
  {
    id: "s-wed-1",
    dayIndex: 2,
    start: "12:00",
    end: "18:00",
    title: "Bán hàng",
    status: "assigned",
    metadata: { employee: "Vũ Thị F" },
  },
  {
    id: "s-wed-2",
    dayIndex: 2,
    start: "19:00",
    end: "23:00",
    title: "Đóng quầy",
    status: "pending",
    metadata: { employee: "Đặng Văn G" },
  },

  // Thursday — cancelled + normal
  {
    id: "s-thu-1",
    dayIndex: 3,
    start: "06:00",
    end: "10:00",
    title: "Ca sáng",
    status: "cancelled",
    metadata: { employee: "Bùi Thị H" },
  },
  {
    id: "s-thu-2",
    dayIndex: 3,
    start: "13:30",
    end: "17:00",
    title: "Thu ngân",
    status: "assigned",
    metadata: { employee: "Ngô Văn I" },
  },

  // Friday — three non-overlapping
  {
    id: "s-fri-1",
    dayIndex: 4,
    start: "07:00",
    end: "11:00",
    title: "Mở quầy",
    status: "assigned",
    metadata: { employee: "Đinh Thị J" },
  },
  {
    id: "s-fri-2",
    dayIndex: 4,
    start: "12:30",
    end: "16:30",
    title: "Bán hàng",
    status: "assigned",
    metadata: { employee: "Trương Văn K" },
  },
  {
    id: "s-fri-3",
    dayIndex: 4,
    start: "18:00",
    end: "22:30",
    title: "Ca tối",
    status: "conflict",
    metadata: { employee: "Lý Thị L" },
  },

  // Saturday — busy, overlapping morning + cross-period
  {
    id: "s-sat-1",
    dayIndex: 5,
    start: "06:00",
    end: "09:00",
    title: "Kho hàng",
    status: "assigned",
    metadata: { employee: "Mai Văn M" },
  },
  {
    id: "s-sat-2",
    dayIndex: 5,
    start: "09:00",
    end: "12:00",
    title: "Thu ngân",
    status: "assigned",
    metadata: { employee: "Hồ Thị N" },
  },
  {
    id: "s-sat-3",
    dayIndex: 5,
    start: "11:00",
    end: "15:00",
    title: "Cross-period",
    status: "pending",
    metadata: { employee: "Dương Văn O" },
  },

  // Sunday — registered
  {
    id: "s-sun-1",
    dayIndex: 6,
    start: "14:00",
    end: "18:00",
    title: "Bán hàng",
    status: "registered",
    metadata: { employee: "Cao Thị P" },
  },
];

export const DEFAULT_WEEKDAYS: WeekdayConfig[] = [
  { index: 0, label: "Thứ Hai", shortLabel: "T2" },
  { index: 1, label: "Thứ Ba", shortLabel: "T3" },
  { index: 2, label: "Thứ Tư", shortLabel: "T4" },
  { index: 3, label: "Thứ Năm", shortLabel: "T5" },
  { index: 4, label: "Thứ Sáu", shortLabel: "T6" },
  { index: 5, label: "Thứ Bảy", shortLabel: "T7" },
  { index: 6, label: "Chủ Nhật", shortLabel: "CN" },
];
