import type { ShiftPageState, Shift, ShiftProgress, CountdownTime } from '@/types/shift'

// ─── Constants ────────────────────────────────────────────────────────────────
export const CHECKIN_WINDOW_MINUTES = 15
export const GRACE_PERIOD_MINUTES = 60

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

// ─── Shift state derivation ───────────────────────────────────────────────────
export function deriveShiftState(shift: Shift | null, nextShift: Shift | null): ShiftPageState {
  if (!shift && !nextShift) return 'OFF_SHIFT'

  const nowMin = getCurrentMinutes()

  if (shift) {
    const startMin = parseTimeToMinutes(shift.startTime)
    const endMin = parseTimeToMinutes(shift.endTime)
    const gracedEnd = endMin + GRACE_PERIOD_MINUTES

    // In shift window (including grace)
    if (nowMin >= startMin && nowMin <= gracedEnd) return 'IN_SHIFT'

    // Before shift — within today
    if (nowMin < startMin) return 'BEFORE_SHIFT'
  }

  if (nextShift) return 'BEFORE_SHIFT'

  return 'OFF_SHIFT'
}

export function isCheckInEnabled(shift: Shift): boolean {
  const nowMin = getCurrentMinutes()
  const startMin = parseTimeToMinutes(shift.startTime)
  return nowMin >= startMin - CHECKIN_WINDOW_MINUTES
}

// ─── Progress calculation ─────────────────────────────────────────────────────
export function getShiftProgress(shift: Shift): ShiftProgress {
  const nowMin = getCurrentMinutes()
  const startMin = parseTimeToMinutes(shift.startTime)
  const endMin = parseTimeToMinutes(shift.endTime)
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
  const [sh, sm] = shift.startTime.split(':').map(Number)
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
