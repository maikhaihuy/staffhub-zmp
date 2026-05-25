'use client'
import React, { useState } from 'react'
import type { Employee, Shift } from '@/types/shift'
import { ShiftPageShell } from './shared/ShiftPageShell'
import { StatusPill } from './shared/StatusPill'
import { PrimaryActionButton } from './shared/PrimaryActionButton'
import { BeforeHeroContent } from './before/BeforeHeroContent'
import { BeforeBody } from './before/BeforeBody'
import { InShiftHeroContent } from './inshift/InShiftHeroContent'
import { InShiftBody } from './inshift/InShiftBody'
import { OffHeroContent } from './offshift/OffHeroContent'
import { OffShiftBody } from './offshift/OffShiftBody'
import { InventoryModal } from './modals/InventoryModal'
import { RevenueModal } from './modals/RevenueModal'
import { WarnModal } from './modals/WarnModal'
import { ToastProvider, showToast } from './modals/Toast'
import { useShiftState } from '@/hooks/useShiftState'
import { useCheckStatus } from '@/hooks/useCheckStatus'
import { useTodos } from '@/hooks/useTodos'
import { useMandatoryTasks } from '@/hooks/useMandatoryTasks'
import { useEvidencePhotos } from '@/hooks/useEvidencePhotos'
import { isCheckInEnabled } from '@/utils/shiftUtils'

// ─── Demo data ────────────────────────────────────────────────────────────────
const EMPLOYEE: Employee = {
  id: 'emp_001',
  name: 'Linh Nguyễn',
  initials: 'LN',
  role: 'Barista',
}

const TODAY = new Date().toISOString().split('T')[0]
const TOMORROW = new Date(Date.now() + 86400000).toISOString().split('T')[0]

const CURRENT_SHIFT: Shift = {
  id: 'shift_001',
  date: TODAY,
  startTime: '08:00',
  endTime: '17:00',
  branch: 'Gong Cha – Q1 Branch',
  team: 'Team A',
  supervisor: 'Minh Trần',
  totalTasks: 8,
  mandatoryCount: 2,
}

const NEXT_SHIFT: Shift = {
  id: 'shift_002',
  date: TOMORROW,
  startTime: '08:00',
  endTime: '17:00',
  branch: 'Gong Cha – Q1 Branch',
  team: 'Team A',
  supervisor: 'Minh Trần',
  totalTasks: 8,
  mandatoryCount: 2,
}

// ─── Demo state override tabs ─────────────────────────────────────────────────
type DemoState = 'BEFORE_SHIFT' | 'IN_SHIFT' | 'OFF_SHIFT'
const DEMO_TABS: { label: string; state: DemoState }[] = [
  { label: 'Before shift', state: 'BEFORE_SHIFT' },
  { label: 'In shift', state: 'IN_SHIFT' },
  { label: 'Off shift', state: 'OFF_SHIFT' },
]

// ─── Component ────────────────────────────────────────────────────────────────
export function ShiftPage() {
  const [demoState, setDemoState] = useState<DemoState>('BEFORE_SHIFT')
  const { pageState: derivedState } = useShiftState(CURRENT_SHIFT, NEXT_SHIFT)
  const pageState = demoState // In prod: use derivedState

  const { checkStatus, checkIn, checkOut } = useCheckStatus()
  const { todos, toggle, doneCount: todoDoneCount, totalCount: todoTotal, unfinishedLabels: todoUnfinished } = useTodos()
  const mandatory = useMandatoryTasks()
  const evidence = useEvidencePhotos()

  const [modalOpen, setModalOpen] = useState<'inventory' | 'revenue' | 'warn' | null>(null)

  const checkinEnabled = isCheckInEnabled(CURRENT_SHIFT)
  const allUnfinished = [...mandatory.unfinishedLabels, ...todoUnfinished]

  function handleCheckIn() {
    checkIn()
    showToast('Checked in! Have a great shift.')
  }

  function handleCheckOutPress() {
    if (allUnfinished.length > 0) {
      setModalOpen('warn')
    } else {
      doCheckOut()
    }
  }

  function doCheckOut() {
    setModalOpen(null)
    checkOut()
    showToast('Checked out successfully.')
  }

  // ── Derived UI values ──
  const totalDone = todoDoneCount + mandatory.doneCount
  const totalTasks = todoTotal + 2

  // ── Status pill props ──
  const shiftLabel = `Morning Shift · ${CURRENT_SHIFT.startTime}–${CURRENT_SHIFT.endTime}`

  // ── Render helpers ──
  function renderStatusPill() {
    return (
      <StatusPill
        pageState={pageState}
        shiftLabel={shiftLabel}
        checkedInAt={checkStatus.checkedInAt}
        checkedOutAt={checkStatus.lastCheckedOutAt}
      />
    )
  }

  function renderHeroContent() {
    if (pageState === 'BEFORE_SHIFT') return <BeforeHeroContent shift={CURRENT_SHIFT} />
    if (pageState === 'IN_SHIFT') return (
      <InShiftHeroContent
        shift={CURRENT_SHIFT}
        tasksDone={totalDone}
        tasksTotal={totalTasks}
        mandatoryDone={mandatory.doneCount}
      />
    )
    return (
      <OffHeroContent
        nextShift={NEXT_SHIFT}
        checkedOutAt={checkStatus.lastCheckedOutAt}
      />
    )
  }

  function renderBodyContent() {
    if (pageState === 'BEFORE_SHIFT') return <BeforeBody shift={CURRENT_SHIFT} />
    if (pageState === 'IN_SHIFT') return (
      <InShiftBody
        mandatoryState={mandatory.state}
        todos={todos}
        photos={evidence.photos}
        todoDoneCount={todoDoneCount}
        onOpenInventory={() => setModalOpen('inventory')}
        onOpenRevenue={() => setModalOpen('revenue')}
        onToggleTodo={toggle}
        onAddPhoto={evidence.add}
        onRemovePhoto={evidence.remove}
        onOpenCamera={evidence.openCamera}
        canAddPhoto={evidence.canAdd}
      />
    )
    return (
      <OffShiftBody
        nextShift={NEXT_SHIFT}
        shiftSummary={checkStatus.lastCheckedOutAt ? {
          checkedInAt: checkStatus.checkedInAt ?? '08:00',
          checkedOutAt: checkStatus.lastCheckedOutAt,
          tasksCompleted: totalDone,
          tasksTotal: totalTasks,
        } : undefined}
      />
    )
  }

  function renderBottomAction() {
    if (pageState === 'BEFORE_SHIFT') {
      const enabled = checkinEnabled && checkStatus.status === 'idle'
      const isCheckedIn = checkStatus.status === 'checked_in'
      if (isCheckedIn) {
        return <PrimaryActionButton variant="checked-out" label="Checked in!" sublabel={`Since ${checkStatus.checkedInAt}`} />
      }
      return (
        <PrimaryActionButton
          variant={enabled ? 'checkin' : 'checkin-disabled'}
          label={enabled ? 'Check In' : `Check-in opens at ${getCheckinOpenTime(CURRENT_SHIFT.startTime)}`}
          sublabel={enabled ? undefined : `15 min before shift start`}
          onClick={handleCheckIn}
        />
      )
    }

    if (pageState === 'IN_SHIFT') {
      if (checkStatus.status === 'checked_out') {
        return (
          <PrimaryActionButton
            variant="checked-out"
            label={`Checked out at ${checkStatus.lastCheckedOutAt}`}
            sublabel="Shift complete · See you tomorrow!"
          />
        )
      }
      return (
        <PrimaryActionButton
          variant="checkout"
          label="Check Out"
          sublabel={checkStatus.checkedInAt ? `Checked in since ${checkStatus.checkedInAt}` : undefined}
          onClick={handleCheckOutPress}
        />
      )
    }

    // OFF_SHIFT
    return (
      <PrimaryActionButton
        variant="view-shift"
        label={NEXT_SHIFT ? `Next shift: ${NEXT_SHIFT.startTime}` : 'No upcoming shift'}
        sublabel={NEXT_SHIFT ? `${NEXT_SHIFT.branch}` : undefined}
        disabled={!NEXT_SHIFT}
      />
    )
  }

  return (
    <>
      {/* Demo tabs — remove in production */}
      <div className="demo-tabs" role="tablist" aria-label="View state (demo only)">
        {DEMO_TABS.map(({ label, state }) => (
          <button
            key={state}
            role="tab"
            aria-selected={demoState === state}
            className={`demo-tab ${demoState === state ? 'demo-tab--active' : ''}`}
            onClick={() => setDemoState(state)}
          >
            {label}
          </button>
        ))}
      </div>

      <ShiftPageShell
        employee={EMPLOYEE}
        currentShift={CURRENT_SHIFT}
        nextShift={NEXT_SHIFT}
        pageState={pageState}
        statusPill={renderStatusPill()}
        heroContent={renderHeroContent()}
        bodyContent={renderBodyContent()}
        bottomAction={renderBottomAction()}
      />

      {/* Modals */}
      <InventoryModal
        open={modalOpen === 'inventory'}
        onClose={() => setModalOpen(null)}
        onSubmit={data => { mandatory.submitInventory(data); setModalOpen(null); showToast('Inventory submitted') }}
      />
      <RevenueModal
        open={modalOpen === 'revenue'}
        onClose={() => setModalOpen(null)}
        onSubmit={data => { mandatory.submitRevenue(data); setModalOpen(null); showToast('Revenue submitted') }}
      />
      <WarnModal
        open={modalOpen === 'warn'}
        onClose={() => setModalOpen(null)}
        onConfirm={doCheckOut}
        unfinishedItems={allUnfinished}
      />
      <ToastProvider />
    </>
  )
}

function getCheckinOpenTime(startTime: string): string {
  const [h, m] = startTime.split(':').map(Number)
  const t = h * 60 + m - 15
  return `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`
}
