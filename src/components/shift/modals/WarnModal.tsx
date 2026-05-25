interface WarnModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  unfinishedItems: string[]
}

export function WarnModal({ open, onClose, onConfirm, unfinishedItems }: WarnModalProps) {
  if (!open) return null

  const shown = unfinishedItems.slice(0, 4)
  const extra = unfinishedItems.length - shown.length

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Unfinished tasks warning">
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" aria-hidden="true" />
        <div className="modal-body modal-body--centered">
          <div className="warn-icon" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h2 className="warn-title">Unfinished tasks</h2>
          <p className="warn-sub">
            These items aren't done yet. You can still check out — they'll be flagged for review.
          </p>
          <div className="warn-list" role="list" aria-label="Incomplete tasks">
            {shown.map(item => (
              <div key={item} className="warn-list-item" role="listitem">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                {item}
              </div>
            ))}
            {extra > 0 && (
              <div className="warn-list-item warn-list-item--extra">
                +{extra} more
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn--secondary" onClick={onClose}>Go back</button>
          <button className="modal-btn modal-btn--danger" onClick={onConfirm}>Check out anyway</button>
        </div>
      </div>
    </div>
  )
}
