import type {
  Attendance,
  CountdownTime,
  Shift,
  ShiftPageState,
  ShiftProgress,
  ShiftTimeStatus,
} from '@/types/shift'

// ─── Constants ────────────────────────────────────────────────────────────────
export const CHECKIN_WINDOW_MINUTES = 15
export const CHECKOUT_GRACE_MINUTES = 60

interface ShiftContextInput {
  currentShift: Shift | null
  nextShift: Shift | null
  serverNow: string
}

interface ValidatedShiftContext {
  currentShift: Shift | null
  nextShift: Shift | null
  serverNow: Date
}

// ─── Time helpers ─────────────────────────────────────────────────────────────
export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function getCurrentMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function formatTimestamp(): string {
  return formatTime()
}

export function getShiftDateTime(shift: Shift, time: string): Date {
  const [h, m] = time.split(':').map(Number)
  const date = new Date(`${shift.date}T00:00:00`)
  date.setHours(h, m, 0, 0)
  return date
}

export function isSameLocalDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

export function validateShiftContext({
  currentShift,
  nextShift,
  serverNow,
}: ShiftContextInput): ValidatedShiftContext {
  const now = new Date(serverNow)
  const validCurrentShift =
    currentShift && isSameLocalDate(new Date(`${currentShift.date}T00:00:00`), now)
      ? currentShift
      : null

  const validNextShift = (() => {
    if (!nextShift) return null

    const nextStart = getShiftDateTime(nextShift, getEmployeeShiftWindow(nextShift).startTime)
    if (nextStart <= now) return null

    if (validCurrentShift) {
      const currentStart = getShiftDateTime(
        validCurrentShift,
        getEmployeeShiftWindow(validCurrentShift).startTime,
      )
      if (nextStart <= currentStart) return null
    }

    return nextShift
  })()

  return {
    currentShift: validCurrentShift,
    nextShift: validNextShift,
    serverNow: now,
  }
}

// ─── Shift state derivation ───────────────────────────────────────────────────
export function deriveShiftState(
  shift: Shift | null,
  attendance: Attendance | null,
): ShiftPageState {
  if (!shift) return 'NO_SHIFT_TODAY'

  if (!attendance?.checkedInAt) return 'UPCOMING_SHIFT'
  if (attendance.latestCheckoutAt) return 'COMPLETED_SHIFT'

  return 'ACTIVE_SHIFT'
}

export function deriveShiftTimeStatus(
  shift: Shift | null,
  attendance: Attendance | null,
  serverNow: Date = new Date(),
): ShiftTimeStatus | null {
  if (!shift) return null

  const employeeShift = getEmployeeShiftWindow(shift)
  const nowMin = serverNow.getHours() * 60 + serverNow.getMinutes()
  const startMin = parseTimeToMinutes(getEmployeeShiftWindow(shift).startTime)
  const endMin = parseTimeToMinutes(employeeShift.endTime)
  const checkoutDeadlineMin = endMin + CHECKOUT_GRACE_MINUTES

  if (!attendance?.checkedInAt) {
    if (nowMin < startMin - CHECKIN_WINDOW_MINUTES) return 'BEFORE_CHECKIN_WINDOW'
    if (nowMin > startMin) return 'LATE_NOT_CHECKED_IN'
    return 'CHECKIN_AVAILABLE'
  }

  if (nowMin > checkoutDeadlineMin && !attendance.latestCheckoutAt) {
    return 'PAST_CHECKOUT_WINDOW'
  }

  if (nowMin > endMin) {
    return attendance.latestCheckoutAt ? 'OVERTIME' : 'CHECKOUT_GRACE'
  }

  return 'IN_SHIFT'
}

export function isCheckInEnabled(
  shift: Shift,
  serverNow: Date = new Date(),
): boolean {
  const timeStatus = deriveShiftTimeStatus(shift, null, serverNow)
  return timeStatus === 'CHECKIN_AVAILABLE' || timeStatus === 'LATE_NOT_CHECKED_IN'
}

export function isCheckOutAllowed(
  shift: Shift,
  attendance: Attendance | null,
  serverNow: Date = new Date(),
): boolean {
  if (!attendance?.checkedInAt) return false
  return deriveShiftTimeStatus(shift, attendance, serverNow) !== 'PAST_CHECKOUT_WINDOW'
}

export function isLateForShift(
  shift: Shift,
  serverNow: Date = new Date(),
): boolean {
  return deriveShiftTimeStatus(shift, null, serverNow) === 'LATE_NOT_CHECKED_IN'
}

export function getLateMinutes(shift: Shift, serverNow: Date = new Date()): number {
  const nowMin = serverNow.getHours() * 60 + serverNow.getMinutes()
  const startMin = parseTimeToMinutes(getEmployeeShiftWindow(shift).startTime)
  return Math.max(0, nowMin - startMin)
}

export function getEmployeeShiftWindow(shift: Shift) {
  return shift.subShift ?? shift
}

// ─── Progress calculation ─────────────────────────────────────────────────────
export function getShiftProgress(shift: Shift): ShiftProgress {
  const employeeShift = getEmployeeShiftWindow(shift)
  const nowMin = getCurrentMinutes()
  const startMin = parseTimeToMinutes(employeeShift.startTime)
  const endMin = parseTimeToMinutes(employeeShift.endTime)
  const totalMinutes = endMin - startMin
  const elapsedMinutes = Math.max(0, Math.min(nowMin - startMin, totalMinutes))
  const percentage = Math.min(100, Math.round((elapsedMinutes / totalMinutes) * 100))

  const hrs = Math.floor(elapsedMinutes / 60)
  const mins = elapsedMinutes % 60
  const elapsedLabel = hrs > 0 ? `${hrs}h ${mins}m elapsed` : `${mins}m elapsed`

  return { elapsedMinutes, totalMinutes, percentage, elapsedLabel }
}

// ─── Countdown to shift ───────────────────────────────────────────────────────
export function getCountdownToShift(shift: Shift): CountdownTime {
  const now = new Date()
  const [sh, sm] = getEmployeeShiftWindow(shift).startTime.split(':').map(Number)
  const target = new Date(now)
  target.setHours(sh, sm, 0, 0)

  const diffMs = Math.max(0, target.getTime() - now.getTime())
  const totalSeconds = Math.floor(diffMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    totalSeconds,
  }
}

// ─── Relative time labels ─────────────────────────────────────────────────────
export function getNextShiftLabel(shift: Shift): string {
  const today = new Date()
  const shiftDate = new Date(shift.date)
  const diffDays = Math.round((shiftDate.getTime() - today.getTime()) / 86400000)
  if (diffDays === 0) return `Today · ${shift.startTime}`
  if (diffDays === 1) return `Tomorrow · ${shift.startTime}`
  return `${shiftDate.toLocaleDateString('vi-VN', { weekday: 'long' })} · ${shift.startTime}`
}

// ─── Zalo Mini App bridge (graceful no-op on web) ─────────────────────────────
export const ZaloBridge = {
  vibrate: () => {
    if (typeof window !== 'undefined' && (window as any).my?.vibrate) {
      (window as any).my.vibrate()
    }
  },
  showToast: (msg: string) => {
    if (typeof window !== 'undefined' && (window as any).my?.showToast) {
      (window as any).my.showToast({ content: msg, duration: 2000 })
    }
  },
  chooseImage: (cb: (urls: string[]) => void) => {
    if (typeof window !== 'undefined' && (window as any).my?.chooseImage) {
      (window as any).my.chooseImage({
        count: 3,
        sourceType: ['camera', 'album'],
        success: (res: any) => cb(res.filePaths ?? []),
      })
    }
  },
  setStorage: (key: string, value: unknown) => {
    if (typeof window !== 'undefined' && (window as any).my?.setStorage) {
      (window as any).my.setStorage({ key, data: JSON.stringify(value) })
    } else {
      try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
    }
  },
  getStorage: (key: string): unknown => {
    if (typeof window !== 'undefined' && (window as any).my?.getStorageSync) {
      return JSON.parse((window as any).my.getStorageSync({ key })?.data ?? 'null')
    }
    try { return JSON.parse(localStorage.getItem(key) ?? 'null') } catch { return null }
  },
}

export function getCheckinOpenTime(startTime: string): string {
  const totalMin = parseTimeToMinutes(startTime) - 15;
  const rh = Math.floor(totalMin / 60).toString().padStart(2, '0')
  const rm = (totalMin % 60).toString().padStart(2, '0')
  return `${rh}:${rm}`
}
