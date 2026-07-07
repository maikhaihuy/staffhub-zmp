import type { Shift } from '@/types/shift'
import { getCheckinOpenTime } from '@/utils/shiftUtils'

interface BeforeBodyProps {
  shift: Shift
}

export function BeforeBody({ shift }: BeforeBodyProps) {
  const masterShift = shift.masterShift ?? shift
  const subShift = shift.subShift ?? shift

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-[104px] pt-4">
      <InfoCard
        title="Thông tin ca"
        rows={[
          { icon: 'time', label: 'Ca chính', sub: `${masterShift.startTime} - ${masterShift.endTime}` },
          { icon: 'team', label: 'Ca của bạn', sub: `${subShift.startTime} - ${subShift.endTime} · ${subShift.team ?? shift.team}` },
          { icon: 'tasks', label: `${shift.totalTasks} việc trong ca`, sub: `${shift.mandatoryCount} bắt buộc · ${shift.totalTasks - shift.mandatoryCount} không bắt buộc` },
        ]}
      />
      <div
        className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-[13px] text-amber-800"
        role="note"
      >
        <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div>
          <strong className="mb-0.5 block font-semibold">Mở vào ca sớm 15 phút</strong>
          <p className="text-xs text-amber-700">
            Nút vào ca bật lúc {getCheckinOpenTime(subShift.startTime)}
          </p>
        </div>
      </div>
    </div>
  )
}

interface InfoCardRow { icon: 'team' | 'tasks' | 'time'; label: string; sub: string }

function InfoCard({ title, rows }: { title: string; rows: InfoCardRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[.07em] text-stone-500">
          {title}
        </span>
        <span className="rounded-[10px] bg-stone-100 px-2 py-0.5 text-[11px] text-stone-400">
          Hôm nay
        </span>
      </div>
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-start gap-2.5 border-t border-stone-100 py-[9px] first:border-t-0"
        >
          <span className="mt-px shrink-0 text-amber-700" aria-hidden="true">
            {row.icon === 'team' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            )}
            {row.icon === 'time' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            )}
            {row.icon === 'tasks' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            )}
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-stone-900">{row.label}</span>
            <span className="text-xs text-stone-400">{row.sub}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
