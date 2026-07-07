import { useState, useEffect } from 'react'
import type { CountdownTime } from '@/types/shift'
import type { Shift } from '@/types/shift'
import { getCountdownToShift } from '@/utils/shiftUtils'

export function useCountdown(shift: Shift | null): CountdownTime {
  const empty: CountdownTime = { hours: '00', minutes: '00', seconds: '00', totalSeconds: 0 }

  const [countdown, setCountdown] = useState<CountdownTime>(() =>
    shift ? getCountdownToShift(shift) : empty,
  )

  useEffect(() => {
    if (!shift) return
    const id = setInterval(() => setCountdown(getCountdownToShift(shift)), 1000)
    return () => clearInterval(id)
  }, [shift])

  return countdown
}
