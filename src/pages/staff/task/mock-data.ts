import type { Employee, Shift } from "@/types/shift";

const TODAY = new Date().toISOString().split("T")[0];
const TOMORROW = new Date(Date.now() + 86400000).toISOString().split("T")[0];

export const TASK_EMPLOYEE: Employee = {
  id: "emp_001",
  name: "Linh Nguyễn",
  initials: "LN",
  role: "Barista",
};

export const CURRENT_SHIFT: Shift = {
  id: "shift_001",
  date: TODAY,
  startTime: "10:00",
  endTime: "17:00",
  branch: "Gong Cha – Q1 Branch",
  team: "Team A",
  supervisor: "Minh Trần",
  totalTasks: 6,
  mandatoryCount: 3,
  masterShift: {
    label: "Ca chính",
    startTime: "08:00",
    endTime: "17:00",
  },
  subShift: {
    label: "Ca của bạn",
    startTime: "10:00",
    endTime: "17:00",
    team: "Team A",
  },
};

export const NEXT_SHIFT: Shift = {
  id: "shift_002",
  date: TOMORROW,
  startTime: "10:00",
  endTime: "17:00",
  branch: "Gong Cha – Q1 Branch",
  team: "Team A",
  supervisor: "Minh Trần",
  totalTasks: 6,
  mandatoryCount: 3,
  masterShift: {
    label: "Ca chính",
    startTime: "08:00",
    endTime: "17:00",
  },
  subShift: {
    label: "Ca của bạn",
    startTime: "10:00",
    endTime: "17:00",
    team: "Team A",
  },
};
