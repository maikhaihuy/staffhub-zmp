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
    <div className="w-full">
      <p className="mb-2.5 text-[11px] uppercase tracking-[.07em] text-stone-500">
        {late ? 'Bạn đang trễ ca' : 'Ca bắt đầu sau'}
      </p>
      <div
        className="mb-3.5 flex items-end gap-1.5"
        aria-label={`${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds`}
      >
        {late ? (
          <CountUnit value={lateMinutes.toString()} label="phút" />
        ) : (
          <>
            <CountUnit value={countdown.hours} label="giờ" />
            <span
              className="pb-0.5 text-[30px] leading-[1.15] text-stone-600"
              aria-hidden="true"
            >
              :
            </span>
            <CountUnit value={countdown.minutes} label="phút" />
            <span
              className="pb-0.5 text-[30px] leading-[1.15] text-stone-600"
              aria-hidden="true"
            >
              :
            </span>
            <CountUnit value={countdown.seconds} label="giây" />
          </>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-[5px] rounded-[20px] border border-white/[.08] bg-white/[.06] px-2.5 py-1 text-xs text-stone-400">
          <svg className="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {employeeShift.startTime} – {employeeShift.endTime}
        </span>
        <span className="inline-flex items-center gap-[5px] rounded-[20px] border border-white/[.08] bg-white/[.06] px-2.5 py-1 text-xs text-stone-400">
          <svg className="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {shift.branch}
        </span>
        {late && (
          <p className="mt-0.5 text-[11.5px] text-amber-400">
            Bạn trễ {lateMinutes} phút, vào ca ngay khi sẵn sàng
          </p>
        )}
        {!enabled && !late && (
          <p className="mt-0.5 text-[11.5px] text-amber-400">
            Mở vào ca trước {CHECKIN_WINDOW_MINUTES} phút
          </p>
        )}
      </div>
    </div>
  )
}

function CountUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-[38px] font-medium leading-none tracking-normal text-white">
        {value}
      </span>
      <span className="mt-0.5 text-[10px] tracking-[.05em] text-stone-500">
        {label}
      </span>
    </div>
  )
}
