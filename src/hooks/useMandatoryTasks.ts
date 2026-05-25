import { useState, useCallback } from 'react'
import type { MandatoryTaskState, InventoryData, RevenueData } from '@/types/shift'
import { formatTimestamp, ZaloBridge } from '@/utils/shiftUtils'

interface UseMandatoryTasksResult {
  state: MandatoryTaskState
  submitInventory: (data: InventoryData) => void
  submitRevenue: (data: RevenueData) => void
  doneCount: number
  unfinishedLabels: string[]
}

export function useMandatoryTasks(): UseMandatoryTasksResult {
  const [state, setState] = useState<MandatoryTaskState>({
    inventoryDone: false,
    revenueDone: false,
  })

  const submitInventory = useCallback((data: InventoryData) => {
    const ts = formatTimestamp()
    setState(prev => ({ ...prev, inventoryDone: true, inventorySubmittedAt: ts }))
    ZaloBridge.vibrate()
    ZaloBridge.setStorage('shift_inventory', { ...data, submittedAt: ts })
  }, [])

  const submitRevenue = useCallback((data: RevenueData) => {
    const ts = formatTimestamp()
    setState(prev => ({ ...prev, revenueDone: true, revenueSubmittedAt: ts }))
    ZaloBridge.vibrate()
    ZaloBridge.setStorage('shift_revenue', { ...data, submittedAt: ts })
  }, [])

  const doneCount = (state.inventoryDone ? 1 : 0) + (state.revenueDone ? 1 : 0)

  const unfinishedLabels: string[] = []
  if (!state.inventoryDone) unfinishedLabels.push('Inventory Check')
  if (!state.revenueDone) unfinishedLabels.push('Shift Revenue Submission')

  return { state, submitInventory, submitRevenue, doneCount, unfinishedLabels }
}
