// ─── Domain Types ─────────────────────────────────────────────────────────────

export type ShiftPageState =
  | 'NO_SHIFT_TODAY'
  | 'UPCOMING_SHIFT'
  | 'ACTIVE_SHIFT'
  | 'COMPLETED_SHIFT'

export type ShiftTimeStatus =
  | 'BEFORE_CHECKIN_WINDOW'
  | 'CHECKIN_AVAILABLE'
  | 'LATE_NOT_CHECKED_IN'
  | 'IN_SHIFT'
  | 'CHECKOUT_GRACE'
  | 'PAST_CHECKOUT_WINDOW'
  | 'OVERTIME'

export interface Employee {
  id: string
  name: string
  initials: string
  role: string
}

export interface Shift {
  id: string
  date: string        // ISO "2024-01-15"
  startTime: string   // "08:00"
  endTime: string     // "17:00"
  branch: string
  team: string
  supervisor: string
  totalTasks: number
  mandatoryCount: number
  label?: string
  masterShift?: ShiftLevelInfo
  subShift?: ShiftLevelInfo
}

export interface ShiftLevelInfo {
  label: string
  startTime: string
  endTime: string
  team?: string
}

export type ShiftTaskScope = 'master' | 'sub'

export type ShiftTaskKind = 'mandatory' | 'optional'

export interface ShiftTask {
  id: string
  title: string
  helperText: string
  scope: ShiftTaskScope
  kind: ShiftTaskKind
  done: boolean
  completedByName?: string
  completedAt?: string
}

export interface ShiftTaskGroup {
  scope: ShiftTaskScope
  title: string
  subtitle: string
  tasks: ShiftTask[]
}

export interface TodoTask {
  id: number
  label: string
  tag: 'urgent' | 'normal'
  done: boolean
}

export interface MandatoryTaskState {
  inventoryDone: boolean
  revenueDone: boolean
  inventorySubmittedAt?: string
  revenueSubmittedAt?: string
}

export interface InventoryData {
  blackTea: number
  greenTea: number
  tapioca: number
  milk: number
  coconutJelly: number
  sugarSyrup: number
  notes: string
}

export interface RevenueData {
  orders: number
  posTotal: number
  cash: number
  card: number
  discount: number
}

export interface EvidencePhoto {
  id: string
  url: string
  addedAt: string
}

export interface Attendance {
  checkedInAt?: string
  latestCheckoutAt?: string
}

export type ShiftCheckStatus = Attendance

export interface ShiftProgress {
  elapsedMinutes: number
  totalMinutes: number
  percentage: number
  elapsedLabel: string
}

export interface CountdownTime {
  hours: string
  minutes: string
  seconds: string
  totalSeconds: number
}
