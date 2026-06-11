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
import type { Employee } from '@/types/shift'
import { useLiveClock } from '@/hooks/useLiveClock'
import Box from 'zmp-ui/box'

interface ShiftPageShellProps {
  employee: Employee
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
    <Box className="flex flex-col h-full overflow-auto relative bg-orange-500">
      {/* ── TOP ROW ── always same position, same height */}
      <div className="flex h-[100px] shrink-0 items-start justify-between bg-stone-900 px-5 pt-4">
        <div className="flex flex-col gap-1">
          <div className="text-[11px] font-medium uppercase tracking-[.07em] text-stone-400">
            {greetingText}
          </div>
          <div className="text-xl font-semibold leading-tight tracking-normal text-white">
            {employee.name}
          </div>
          <div className="mt-1">{statusPill}</div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-700 text-[13px] font-semibold text-white"
            aria-hidden="true"
          >
            {employee.initials}
          </div>
          <div
            className="font-mono text-lg font-medium tracking-[.02em] text-white/60"
            aria-label={`Current time ${clock}`}
          >
            {clock}
          </div>
        </div>
      </div>

      {/* ── HERO ZONE ── same height, content swaps */}
      <div
        className="flex h-[200px] shrink-0 items-center bg-stone-900 px-5"
        aria-live="polite"
      >
        {heroContent}
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-t-[20px] bg-stone-100 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
        {bodyContent}
      </div>

      {/* ── BOTTOM ACTION ── always same sticky position */}
      <div
        className="sticky bottom-0 z-50 shrink-0 border-t border-stone-200/80 bg-stone-100/95 px-4 pb-[env(safe-area-inset-bottom,12px)] pt-3 backdrop-blur-2xl"
        role="region"
        aria-label="Primary action"
      >
        {bottomAction}
      </div>
    </Box>
  )
}
