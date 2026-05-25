import type { Shift } from '@/types/shift'
import { getNextShiftLabel } from '@/utils/shiftUtils'

interface OffShiftBodyProps {
  nextShift: Shift | null
  /** Summary of today's completed shift, if any */
  shiftSummary?: {
    checkedInAt: string
    checkedOutAt: string
    tasksCompleted: number
    tasksTotal: number
  }
}

export function OffShiftBody({ nextShift, shiftSummary }: OffShiftBodyProps) {
  return (
    <div className="body-content body-content--off">
      {/* Rest card */}
      <div className="rest-card">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
        <div>
          <strong className="rest-card__title">Take a break, you've earned it</strong>
          {shiftSummary && (
            <p className="rest-card__sub">
              {shiftSummary.checkedInAt} → {shiftSummary.checkedOutAt} · {shiftSummary.tasksCompleted}/{shiftSummary.tasksTotal} tasks
            </p>
          )}
        </div>
      </div>

      {/* Next shift card */}
      {nextShift && (
        <div className="info-card">
          <div className="info-card__header">
            <span className="info-card__title">Next shift</span>
          </div>
          <div className="info-card__row">
            <span className="info-card__row-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </span>
            <div className="info-card__row-text">
              <span className="info-card__row-label">{getNextShiftLabel(nextShift)}</span>
              <span className="info-card__row-sub">{nextShift.branch} · {nextShift.team}</span>
            </div>
          </div>
          <div className="info-card__row">
            <span className="info-card__row-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <div className="info-card__row-text">
              <span className="info-card__row-label">{nextShift.startTime} – {nextShift.endTime}</span>
              <span className="info-card__row-sub">{nextShift.totalTasks} tasks assigned</span>
            </div>
          </div>
        </div>
      )}

      {/* Today's summary preview */}
      {shiftSummary && (
        <div className="info-card">
          <div className="info-card__header">
            <span className="info-card__title">Today's summary</span>
            <span className="info-card__badge info-card__badge--green">
              {shiftSummary.tasksCompleted}/{shiftSummary.tasksTotal} done
            </span>
          </div>
          <div className="summary-preview-row">
            <SummaryItem label="Inventory Check" done />
            <SummaryItem label="Shift Revenue" done />
            <SummaryItem label="Clean bar counter" done />
            <SummaryItem label="Refill toppings" done />
            <SummaryItem label="Customer area" done />
            <SummaryItem label="Update whiteboard" done />
          </div>
        </div>
      )}

      {/* Empty state if no summary */}
      {!shiftSummary && !nextShift && (
        <div className="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
          <p className="empty-state__text">No upcoming shifts scheduled</p>
          <p className="empty-state__sub">Check back with your supervisor</p>
        </div>
      )}
    </div>
  )
}

function SummaryItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="summary-item">
      <span className={`summary-dot ${done ? 'summary-dot--done' : ''}`} aria-hidden="true" />
      <span className="summary-label">{label}</span>
      {done && <span className="summary-done-pill">Done</span>}
    </div>
  )
}
