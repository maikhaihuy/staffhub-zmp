import React from 'react'
import type { Shift } from '@/types/shift'
import { useCountdown } from '@/hooks/useCountdown'
import {
  CHECKIN_WINDOW_MINUTES,
  getEmployeeShiftWindow,
  getLateMinutes,
  isCheckInEnabled,
  isLateForShift,
} from '@/utils/shiftUtils'

interface BeforeHeroContentProps {
  shift: Shift
}

export function BeforeHeroContent({ shift }: BeforeHeroContentProps) {
  const countdown = useCountdown(shift)
  const enabled = isCheckInEnabled(shift)
  const employeeShift = getEmployeeShiftWindow(shift)
  const late = isLateForShift(shift)
  const lateMinutes = getLateMinutes(shift)

  return (
    <div className="hero-content hero-content--before">
      <p className="hero-eyebrow">{late ? 'Bạn đang trễ ca' : 'Ca bắt đầu sau'}</p>
      <div className="countdown-row" aria-label={`${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds`}>
        {late ? (
          <CountUnit value={lateMinutes.toString()} label="phút" />
        ) : (
          <>
            <CountUnit value={countdown.hours} label="giờ" />
            <span className="countdown-sep" aria-hidden="true">:</span>
            <CountUnit value={countdown.minutes} label="phút" />
            <span className="countdown-sep" aria-hidden="true">:</span>
            <CountUnit value={countdown.seconds} label="giây" />
          </>
        )}
      </div>
      <div className="before-shift-meta">
        <span className="shift-meta-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {employeeShift.startTime} – {employeeShift.endTime}
        </span>
        <span className="shift-meta-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {shift.branch}
        </span>
        {late && (
          <p className="checkin-window-hint">
            Bạn trễ {lateMinutes} phút, vào ca ngay khi sẵn sàng
          </p>
        )}
        {!enabled && !late && (
          <p className="checkin-window-hint">
            Mở vào ca trước {CHECKIN_WINDOW_MINUTES} phút
          </p>
        )}
      </div>
    </div>
  )
}

function CountUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="count-unit">
      <span className="count-num">{value}</span>
      <span className="count-label">{label}</span>
    </div>
  )
}
