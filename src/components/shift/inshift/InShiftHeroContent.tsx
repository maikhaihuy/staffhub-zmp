import type { Shift } from '@/types/shift'
import { getShiftProgress } from '@/utils/shiftUtils'

interface InShiftHeroContentProps {
  shift: Shift
  tasksDone: number
  tasksTotal: number
  mandatoryDone: number
  mandatoryTotal: number
}

export function InShiftHeroContent({
  shift,
  tasksDone,
  tasksTotal,
  mandatoryDone,
  mandatoryTotal,
}: InShiftHeroContentProps) {
  const progress = getShiftProgress(shift)
  const masterShift = shift.masterShift ?? shift
  const subShift = shift.subShift ?? shift

  return (
    <div className="w-full">
      <div className="mb-3 grid gap-1.5" aria-label="Thông tin ca">
        <div className="flex items-center justify-between gap-2.5 rounded-lg border border-white/[.08] bg-white/[.06] px-2.5 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-[.06em] text-stone-500">
            Ca chính
          </span>
          <strong className="min-w-0 text-right text-[13px] font-semibold text-white">
            {masterShift.startTime} - {masterShift.endTime}
          </strong>
        </div>
        <div className="flex items-center justify-between gap-2.5 rounded-lg border border-white/[.08] bg-white/[.06] px-2.5 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-[.06em] text-stone-500">
            Ca của bạn
          </span>
          <strong className="min-w-0 text-right text-[13px] font-semibold text-white">
            {subShift.startTime} - {subShift.endTime}{subShift.team ? ` · ${subShift.team}` : ''}
          </strong>
        </div>
      </div>
      <div className="mb-3 flex gap-2">
        <StatChip label="Việc" value={`${tasksDone}/${tasksTotal}`} color="default" />
        <StatChip
          label="Bắt buộc"
          value={`${mandatoryDone}/${mandatoryTotal}`}
          color={mandatoryDone === mandatoryTotal ? 'green' : 'amber'}
        />
        <StatChip label="Đã làm" value={progress.elapsedLabel.replace(' elapsed', '')} color="default" />
      </div>
      <div
        className="mb-1.5 h-1 overflow-hidden rounded-sm bg-white/10"
        role="progressbar"
        aria-valuenow={progress.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Shift ${progress.percentage}% complete`}
      >
        <div
          className="h-full rounded-sm bg-amber-600 transition-[width] duration-[600ms] ease-out"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
      <div className="flex justify-between font-mono text-[11px] text-stone-500">
        <span>{shift.startTime}</span>
        <span className="font-medium text-amber-600">{progress.percentage}%</span>
        <span>{shift.endTime}</span>
      </div>
    </div>
  )
}

function StatChip({ label, value, color }: { label: string; value: string; color: 'default' | 'green' | 'amber' }) {
  return (
    <div className="flex flex-1 flex-col gap-[3px] rounded-lg border border-white/[.08] bg-white/[.07] px-2.5 pb-2 pt-[9px]">
      <span className={`font-mono text-lg font-medium leading-none ${STAT_VALUE_CLASSES[color]}`}>
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-[.06em] text-stone-500">
        {label}
      </span>
    </div>
  )
}

const STAT_VALUE_CLASSES: Record<'default' | 'green' | 'amber', string> = {
  default: 'text-white',
  green: 'text-green-400',
  amber: 'text-amber-400',
}
