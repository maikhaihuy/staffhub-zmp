import { useState, useCallback } from 'react'
import type { ShiftCheckStatus } from '@/types/shift'
import { formatTimestamp, ZaloBridge } from '@/utils/shiftUtils'

interface UseCheckStatusResult {
  checkStatus: ShiftCheckStatus
  checkIn: () => void
  checkOut: () => void
}

export function useCheckStatus(): UseCheckStatusResult {
  const [checkStatus, setCheckStatus] = useState<ShiftCheckStatus>({})

  const checkIn = useCallback(() => {
    const ts = formatTimestamp()
    setCheckStatus({ checkedInAt: ts })
    ZaloBridge.vibrate()
    ZaloBridge.setStorage('shift_checkin', ts)
  }, [])

  const checkOut = useCallback(() => {
    const ts = formatTimestamp()
    setCheckStatus(prev => ({
      ...prev,
      latestCheckoutAt: ts,
    }))
    ZaloBridge.vibrate()
    ZaloBridge.setStorage('shift_checkout', ts)
  }, [])

  return { checkStatus, checkIn, checkOut }
}
