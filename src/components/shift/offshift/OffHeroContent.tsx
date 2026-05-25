import type { Shift } from '@/types/shift'
import { getNextShiftLabel } from '@/utils/shiftUtils'

interface OffHeroContentProps {
  nextShift: Shift | null
  checkedOutAt?: string
}

export function OffHeroContent({ nextShift, checkedOutAt }: OffHeroContentProps) {
  const hour = new Date().getHours()
  const emoji = hour < 12 ? '🌅' : hour < 18 ? '☀️' : '🌙'

  return (
    <div className="hero-content hero-content--off">
      <div className="off-hero-emoji" aria-hidden="true">{emoji}</div>
      <p className="off-hero-title">You're off duty</p>
      {checkedOutAt && (
        <p className="off-hero-sub">Checked out at {checkedOutAt}</p>
      )}
      {nextShift && (
        <div className="off-next-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Next: {getNextShiftLabel(nextShift)}
        </div>
      )}
      {!nextShift && (
        <p className="off-hero-sub off-hero-sub--muted">No upcoming shifts scheduled</p>
      )}
    </div>
  )
}
