
type Variant = 'checkin' | 'checkin-disabled' | 'checkout' | 'checked-out' | 'view-shift'

interface PrimaryActionButtonProps {
  variant: Variant
  label: string
  sublabel?: string
  onClick?: () => void
  disabled?: boolean
}

export function PrimaryActionButton({
  variant,
  label,
  sublabel,
  onClick,
  disabled,
}: PrimaryActionButtonProps) {
  const isDisabled = variant === 'checkin-disabled' || variant === 'checked-out' || disabled

  return (
    <div className="primary-action">
      <button
        className={`primary-btn primary-btn--${variant}`}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-label={label}
      >
        <BtnIcon variant={variant} />
        <span className="primary-btn__label">{label}</span>
      </button>
      {sublabel && (
        <p className="primary-btn__sub" aria-live="polite">
          {sublabel}
        </p>
      )}
    </div>
  )
}

function BtnIcon({ variant }: { variant: Variant }) {
  // Inline SVGs for the critical action icons — guaranteed consistent
  if (variant === 'checkin' || variant === 'checkin-disabled')
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  if (variant === 'checkout')
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  if (variant === 'checked-out')
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
  if (variant === 'view-shift')
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  return null
}
