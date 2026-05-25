import { useState, useEffect } from 'react'
import type { Shift, ShiftPageState } from '@/types/shift'
import { deriveShiftState } from '@/utils/shiftUtils'

interface UseShiftStateResult {
  pageState: ShiftPageState
  /** Force a re-derive (useful after demo tab switching) */
  override: (state: ShiftPageState | null) => void
}

export function useShiftState(
  currentShift: Shift | null,
  nextShift: Shift | null,
): UseShiftStateResult {
  const [overrideState, setOverrideState] = useState<ShiftPageState | null>(null)
  const [derived, setDerived] = useState<ShiftPageState>(() =>
    deriveShiftState(currentShift, nextShift),
  )

  // Re-derive every minute in case shift window changes
  useEffect(() => {
    const id = setInterval(() => {
      setDerived(deriveShiftState(currentShift, nextShift))
    }, 60_000)
    return () => clearInterval(id)
  }, [currentShift, nextShift])

  return {
    pageState: overrideState ?? derived,
    override: setOverrideState,
  }
}
