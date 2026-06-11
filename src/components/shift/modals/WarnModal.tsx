interface WarnModalProps {
  open: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  message: string
  groups: {
    title: string
    items: string[]
  }[]
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'danger' | 'primary'
}

export function WarnModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  groups,
  confirmLabel = 'Vẫn kết ca',
  cancelLabel = 'Quay lại',
  confirmVariant = 'danger',
}: WarnModalProps) {
  if (!open) return null

  const visibleGroups = groups
    .map((group) => ({ ...group, items: group.items.slice(0, 4) }))
    .filter((group) => group.items.length > 0)

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="max-h-[88vh] w-full overflow-y-auto rounded-t-[20px] bg-white pb-[env(safe-area-inset-bottom,20px)] [&::-webkit-scrollbar]:hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="mx-auto mt-2.5 h-1 w-9 rounded-sm bg-stone-200" aria-hidden="true" />
        <div className="px-5 py-4 text-center">
          <div className="mx-auto mb-3 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-red-50 text-red-600" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h2 className="mb-1.5 text-lg font-semibold">{title}</h2>
          <p className="mb-4 px-2 text-[13px] text-stone-500">{message}</p>
          <div className="rounded-lg bg-red-50 px-3.5 py-3 text-left" role="list" aria-label="Việc chưa hoàn thành">
            {visibleGroups.map((group) => (
              <div
                className="border-t border-red-900/10 pt-2.5 first:border-t-0 first:pt-0 [&+&]:mt-2.5"
                key={group.title}
              >
                <div className="mb-1 text-[11px] font-bold uppercase tracking-[.06em] text-red-950">{group.title}</div>
                {group.items.map(item => (
                  <div key={item} className="flex items-center gap-2 py-1 text-[13px] text-red-800" role="listitem">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2.5 px-5 pb-4">
          <button
            className="h-[50px] flex-1 rounded-xl bg-stone-100 text-[15px] font-semibold text-stone-900 transition-transform active:scale-[.97]"
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          {onConfirm ? (
            <button
              className={`h-[50px] flex-1 rounded-xl text-[15px] font-semibold text-white transition-transform active:scale-[.97] ${
                confirmVariant === 'danger' ? 'bg-red-600' : 'bg-amber-700'
              }`}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
