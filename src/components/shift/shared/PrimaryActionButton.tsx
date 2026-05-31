
import { Button, Icon } from 'zmp-ui'

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
  const config = BUTTON_CONFIG[variant]

  return (
    <div className="primary-action">
      <Button
        fullWidth
        size="large"
        variant={config.zauiVariant}
        type={config.zauiType}
        className={`primary-btn primary-btn--${variant}`}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-label={label}
        prefixIcon={<Icon icon={config.icon} />}
      >
        {label}
      </Button>
      {sublabel && (
        <p className="primary-btn__sub" aria-live="polite">
          {sublabel}
        </p>
      )}
    </div>
  )
}

const BUTTON_CONFIG: Record<Variant, {
  icon: 'zi-clock-1' | 'zi-arrow-right' | 'zi-check-circle' | 'zi-calendar'
  zauiVariant: 'primary' | 'secondary'
  zauiType: 'highlight' | 'neutral'
}> = {
  checkin: {
    icon: 'zi-clock-1',
    zauiVariant: 'primary',
    zauiType: 'highlight',
  },
  'checkin-disabled': {
    icon: 'zi-clock-1',
    zauiVariant: 'secondary',
    zauiType: 'neutral',
  },
  checkout: {
    icon: 'zi-arrow-right',
    zauiVariant: 'primary',
    zauiType: 'neutral',
  },
  'checked-out': {
    icon: 'zi-check-circle',
    zauiVariant: 'secondary',
    zauiType: 'neutral',
  },
  'view-shift': {
    icon: 'zi-calendar',
    zauiVariant: 'primary',
    zauiType: 'neutral',
  },
}
