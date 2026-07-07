import { useEffect, useState, useCallback } from 'react'

interface ToastMessage {
  id: number
  text: string
}

let toastEmitter: ((msg: string) => void) | null = null

export function showToast(msg: string) {
  toastEmitter?.(msg)
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const emit = useCallback((msg: string) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, text: msg }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800)
  }, [])

  useEffect(() => {
    toastEmitter = emit
    return () => { toastEmitter = null }
  }, [emit])

  return (
    <div
      className="pointer-events-none fixed left-1/2 top-4 z-[300] flex -translate-x-1/2 flex-col gap-2"
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map(t => (
        <div
          key={t.id}
          className="flex items-center gap-2 whitespace-nowrap rounded-3xl bg-stone-900 px-4 py-2.5 text-[13px] font-medium text-green-400 shadow-[0_4px_16px_rgba(0,0,0,.25)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          <span className="text-white">{t.text}</span>
        </div>
      ))}
    </div>
  )
}
