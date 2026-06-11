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
  const buttonClassName = [
    '!h-[52px] !rounded-xl !text-base !font-semibold !tracking-[.01em] !shadow-none transition-[transform,box-shadow] duration-150 active:enabled:scale-[.97]',
    BUTTON_VARIANT_CLASSES[variant],
  ].join(' ')

  return (
    <div className="flex flex-col gap-[5px]">
      <Button
        fullWidth
        size="large"
        variant={config.zauiVariant}
        type={config.zauiType}
        className={buttonClassName}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-label={label}
        prefixIcon={<Icon icon={config.icon} />}
      >
        {label}
      </Button>
      {sublabel && (
        <p className="text-center text-[11px] text-stone-400" aria-live="polite">
          {sublabel}
        </p>
      )}
    </div>
  )
}

const BUTTON_VARIANT_CLASSES: Record<Variant, string> = {
  checkin:
    '!bg-amber-700 !text-white !shadow-[0_4px_18px_rgba(180,83,9,.3)]',
  'checkin-disabled':
    'pointer-events-none !cursor-not-allowed !bg-stone-200 !text-sm !text-stone-400',
  checkout:
    '!bg-stone-900 !text-white !shadow-[0_4px_18px_rgba(28,25,23,.2)]',
  'checked-out':
    'pointer-events-none !cursor-default !border-[1.5px] !border-green-200 !bg-green-50 !text-green-700',
  'view-shift':
    '!bg-stone-900 !text-white disabled:!cursor-not-allowed disabled:!bg-stone-200 disabled:!text-stone-400 disabled:!shadow-none',
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
