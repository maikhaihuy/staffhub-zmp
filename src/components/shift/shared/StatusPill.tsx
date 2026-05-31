import type { ShiftPageState } from '@/types/shift'

interface StatusPillProps {
  pageState: ShiftPageState
  shiftLabel?: string
  checkedInAt?: string
  checkedOutAt?: string
}

export function StatusPill({ pageState, shiftLabel, checkedInAt, checkedOutAt }: StatusPillProps) {
  if (pageState === 'BEFORE_SHIFT') {
    return (
      <span className="pill pill--before">
        <span className="pill__dot pill__dot--amber" aria-hidden="true" />
        {shiftLabel ?? 'Ca sắp tới'}
      </span>
    )
  }

  if (pageState === 'IN_SHIFT') {
    return (
      <span className="pill pill--active">
        <span className="pill__dot pill__dot--green" aria-hidden="true" />
        {checkedInAt ? `Đã vào ca từ ${checkedInAt}` : 'Đang trong ca'}
      </span>
    )
  }

  // OFF_SHIFT
  return (
    <span className="pill pill--off">
      <span className="pill__dot pill__dot--gray" aria-hidden="true" />
      {checkedOutAt ? `Xong ca · ra lúc ${checkedOutAt}` : 'Ngoài ca'}
    </span>
  )
}
