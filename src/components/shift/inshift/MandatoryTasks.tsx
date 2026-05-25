import type { MandatoryTaskState } from '@/types/shift'

interface MandatoryTasksProps {
  state: MandatoryTaskState
  onOpenInventory: () => void
  onOpenRevenue: () => void
}

export function MandatoryTasks({ state, onOpenInventory, onOpenRevenue }: MandatoryTasksProps) {
  return (
    <section aria-label="Mandatory tasks">
      <div className="section-label">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Required before checkout
      </div>

      <div className="task-group task-group--mandatory">
        <div className="mandatory-flag" aria-label="Mandatory tasks">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          MANDATORY
        </div>

        <MandatoryTaskCard
          icon="inventory"
          title="Inventory Check"
          subtitle={state.inventoryDone ? `Submitted at ${state.inventorySubmittedAt}` : 'Tap to fill in stock levels'}
          done={state.inventoryDone}
          onClick={onOpenInventory}
        />

        <MandatoryTaskCard
          icon="revenue"
          title="Shift Revenue"
          subtitle={state.revenueDone ? `Submitted at ${state.revenueSubmittedAt}` : 'Submit end-of-shift totals'}
          done={state.revenueDone}
          onClick={onOpenRevenue}
          isLast
        />
      </div>
    </section>
  )
}

interface MandatoryTaskCardProps {
  icon: 'inventory' | 'revenue'
  title: string
  subtitle: string
  done: boolean
  onClick: () => void
  isLast?: boolean
}

function MandatoryTaskCard({ icon, title, subtitle, done, onClick, isLast }: MandatoryTaskCardProps) {
  return (
    <button
      className={`task-card task-card--mandatory ${done ? 'task-card--done' : ''} ${isLast ? 'task-card--last' : ''}`}
      onClick={onClick}
      aria-label={`${title}: ${done ? 'completed' : 'tap to complete'}`}
    >
      <div className={`task-icon task-icon--${done ? 'done' : icon === 'inventory' ? 'amber' : 'blue'}`} aria-hidden="true">
        {done ? <CheckIcon /> : icon === 'inventory' ? <InventoryIcon /> : <RevenueIcon />}
      </div>
      <div className="task-info">
        <span className="task-title">{title}</span>
        <span className="task-sub">{subtitle}</span>
      </div>
      <div className="task-right" aria-hidden="true">
        {done
          ? <span className="done-badge"><CheckIcon small />Done</span>
          : <ChevronIcon />
        }
      </div>
    </button>
  )
}

const CheckIcon = ({ small }: { small?: boolean }) => (
  <svg width={small ? 12 : 18} height={small ? 12 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
)
const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
)
const InventoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="11" y2="16"/></svg>
)
const RevenueIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
)
