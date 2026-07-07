import type { ReactNode } from 'react'
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
    <div className="flex flex-col gap-3.5 px-4 pb-[104px] pt-4">
      {/* Rest card */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-100 p-3.5 text-amber-900">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
        <div>
          <strong className="block text-sm font-semibold">Take a break, you've earned it</strong>
          {shiftSummary && (
            <p className="mt-[3px] text-xs text-amber-700">
              {shiftSummary.checkedInAt} → {shiftSummary.checkedOutAt} · {shiftSummary.tasksCompleted}/{shiftSummary.tasksTotal} tasks
            </p>
          )}
        </div>
      </div>

      {/* Next shift card */}
      {nextShift && (
        <InfoCard title="Next shift">
          <InfoRow
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            }
            label={getNextShiftLabel(nextShift)}
            sub={`${nextShift.branch} · ${nextShift.team}`}
          />
          <InfoRow
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            }
            label={`${nextShift.startTime} – ${nextShift.endTime}`}
            sub={`${nextShift.totalTasks} tasks assigned`}
          />
        </InfoCard>
      )}

      {/* Today's summary preview */}
      {shiftSummary && (
        <InfoCard
          title="Today's summary"
          badge={`${shiftSummary.tasksCompleted}/${shiftSummary.tasksTotal} done`}
        >
          <div className="flex flex-col">
            <SummaryItem label="Inventory Check" done />
            <SummaryItem label="Shift Revenue" done />
            <SummaryItem label="Clean bar counter" done />
            <SummaryItem label="Refill toppings" done />
            <SummaryItem label="Customer area" done />
            <SummaryItem label="Update whiteboard" done />
          </div>
        </InfoCard>
      )}

      {/* Empty state if no summary */}
      {!shiftSummary && !nextShift && (
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center text-stone-400">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
          <p className="text-[15px] font-medium text-stone-500">No upcoming shifts scheduled</p>
          <p className="text-[13px] text-stone-400">Check back with your supervisor</p>
        </div>
      )}
    </div>
  )
}

function InfoCard({
  title,
  badge,
  children,
}: {
  title: string
  badge?: string
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[.07em] text-stone-500">
          {title}
        </span>
        {badge && (
          <span className="rounded-[10px] bg-green-50 px-2 py-0.5 text-[11px] text-green-700">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function InfoRow({
  icon,
  label,
  sub,
}: {
  icon: ReactNode
  label: string
  sub: string
}) {
  return (
    <div className="flex items-start gap-2.5 border-t border-stone-100 py-[9px] first:border-t-0">
      <span className="mt-px shrink-0 text-amber-700" aria-hidden="true">
        {icon}
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-stone-900">{label}</span>
        <span className="text-xs text-stone-400">{sub}</span>
      </div>
    </div>
  )
}

function SummaryItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2.5 border-t border-stone-100 py-[9px] first:border-t-0">
      <span
        className={`h-[7px] w-[7px] shrink-0 rounded-full ${
          done ? 'bg-green-700' : 'bg-stone-300'
        }`}
        aria-hidden="true"
      />
      <span className="flex-1 text-[13px] text-stone-500">{label}</span>
      {done && (
        <span className="rounded-[10px] bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
          Done
        </span>
      )}
    </div>
  )
}
