import { useState, useEffect } from 'react'
import { formatTime } from '@/utils/shiftUtils'

export function useLiveClock(intervalMs = 1000): string {
  const [clock, setClock] = useState(() => formatTime())

  useEffect(() => {
    const id = setInterval(() => setClock(formatTime()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return clock
}
