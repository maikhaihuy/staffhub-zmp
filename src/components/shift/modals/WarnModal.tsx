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
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" aria-hidden="true" />
        <div className="modal-body modal-body--centered">
          <div className="warn-icon" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h2 className="warn-title">{title}</h2>
          <p className="warn-sub">{message}</p>
          <div className="warn-list" role="list" aria-label="Việc chưa hoàn thành">
            {visibleGroups.map((group) => (
              <div className="warn-group" key={group.title}>
                <div className="warn-group-title">{group.title}</div>
                {group.items.map(item => (
                  <div key={item} className="warn-list-item" role="listitem">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn--secondary" onClick={onClose}>{cancelLabel}</button>
          {onConfirm ? (
            <button className={`modal-btn modal-btn--${confirmVariant}`} onClick={onConfirm}>
              {confirmLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
