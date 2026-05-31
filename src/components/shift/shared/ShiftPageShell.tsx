/**
 * ShiftPageShell — the FIXED skeleton that never changes across states.
 *
 * Layout contract:
 *   ┌─────────────────────────────┐  ← TopRow   (fixed height: 100px)
 *   │  Greeting · Name · Clock   │
 *   │  Shift badge / status pill  │
 *   ├─────────────────────────────┤
 *   │                             │  ← HeroZone (fixed height: 200px)
 *   │  [state-specific content]   │    countdown | shift info | rest msg
 *   │                             │
 *   ├─────────────────────────────┤
 *   │  [scrollable body]          │  ← ContentArea (flex: 1, scrollable)
 *   │                             │
 *   ├─────────────────────────────┤
 *   │  [primary action button]    │  ← BottomAction (fixed: 88px sticky)
 *   └─────────────────────────────┘
 */

import React from 'react'
import type { Employee, Shift, ShiftPageState } from '@/types/shift'
import { useLiveClock } from '@/hooks/useLiveClock'

interface ShiftPageShellProps {
  employee: Employee
  currentShift: Shift | null
  nextShift: Shift | null
  pageState: ShiftPageState
  /** TopRow status pill — content changes per state */
  statusPill: React.ReactNode
  /** HeroZone — same height, content changes */
  heroContent: React.ReactNode
  /** Scrollable body below hero */
  bodyContent: React.ReactNode
  /** Sticky bottom action */
  bottomAction: React.ReactNode
}

export function ShiftPageShell({
  employee,
  pageState,
  statusPill,
  heroContent,
  bodyContent,
  bottomAction,
}: ShiftPageShellProps) {
  const clock = useLiveClock()

  const greetingText = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Chào buổi sáng'
    if (h < 18) return 'Chào buổi chiều'
    return 'Chào buổi tối'
  })()

  return (
    <div className="shell">
      {/* ── TOP ROW ── always same position, same height */}
      <div className="shell-toprow">
        <div className="shell-toprow-left">
          <div className="shell-greeting">{greetingText}</div>
          <div className="shell-name">{employee.name}</div>
          <div className="shell-status-row">{statusPill}</div>
        </div>
        <div className="shell-toprow-right">
          <div className="shell-avatar" aria-hidden="true">{employee.initials}</div>
          <div className="shell-clock" aria-label={`Current time ${clock}`}>{clock}</div>
        </div>
      </div>

      {/* ── HERO ZONE ── same height, content swaps */}
      <div className="shell-hero" aria-live="polite">
        {heroContent}
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="shell-body">
        {bodyContent}
      </div>

      {/* ── BOTTOM ACTION ── always same sticky position */}
      <div className="shell-bottom" role="region" aria-label="Primary action">
        {bottomAction}
      </div>
    </div>
  )
}
