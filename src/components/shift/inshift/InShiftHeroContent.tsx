import type { Shift } from '@/types/shift'
import { getShiftProgress } from '@/utils/shiftUtils'

interface InShiftHeroContentProps {
  shift: Shift
  tasksDone: number
  tasksTotal: number
  mandatoryDone: number
}

export function InShiftHeroContent({
  shift,
  tasksDone,
  tasksTotal,
  mandatoryDone,
}: InShiftHeroContentProps) {
  const progress = getShiftProgress(shift)

  return (
    <div className="hero-content hero-content--inshift">
      <div className="inshift-stats-row">
        <StatChip label="Tasks" value={`${tasksDone}/${tasksTotal}`} color="default" />
        <StatChip
          label="Required"
          value={`${mandatoryDone}/2`}
          color={mandatoryDone === 2 ? 'green' : 'amber'}
        />
        <StatChip label="Elapsed" value={progress.elapsedLabel.replace(' elapsed', '')} color="default" />
      </div>
      <div className="shift-progress-bar" role="progressbar" aria-valuenow={progress.percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`Shift ${progress.percentage}% complete`}>
        <div className="shift-progress-fill" style={{ width: `${progress.percentage}%` }} />
      </div>
      <div className="shift-progress-labels">
        <span>{shift.startTime}</span>
        <span className="shift-progress-pct">{progress.percentage}%</span>
        <span>{shift.endTime}</span>
      </div>
    </div>
  )
}

function StatChip({ label, value, color }: { label: string; value: string; color: 'default' | 'green' | 'amber' }) {
  return (
    <div className={`stat-chip stat-chip--${color}`}>
      <span className="stat-chip__value">{value}</span>
      <span className="stat-chip__label">{label}</span>
    </div>
  )
}
