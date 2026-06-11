import React from 'react'
import type { Shift } from '@/types/shift'
import { getCheckinOpenTime } from '@/utils/shiftUtils'

interface BeforeBodyProps {
  shift: Shift
}

export function BeforeBody({ shift }: BeforeBodyProps) {
  const masterShift = shift.masterShift ?? shift
  const subShift = shift.subShift ?? shift

  return (
    <div className="body-content body-content--before">
      <InfoCard
        title="Thông tin ca"
        rows={[
          { icon: 'time', label: 'Ca chính', sub: `${masterShift.startTime} - ${masterShift.endTime}` },
          { icon: 'team', label: 'Ca của bạn', sub: `${subShift.startTime} - ${subShift.endTime} · ${subShift.team ?? shift.team}` },
          { icon: 'tasks', label: `${shift.totalTasks} việc trong ca`, sub: `${shift.mandatoryCount} bắt buộc · ${shift.totalTasks - shift.mandatoryCount} không bắt buộc` },
        ]}
      />
      <div className="info-banner info-banner--amber" role="note">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div>
          <strong>Mở vào ca sớm 15 phút</strong>
          <p>Nút vào ca bật lúc {getCheckinOpenTime(subShift.startTime)}</p>
        </div>
      </div>
    </div>
  )
}

interface InfoCardRow { icon: 'team' | 'tasks' | 'time'; label: string; sub: string }

function InfoCard({ title, rows }: { title: string; rows: InfoCardRow[] }) {
  return (
    <div className="info-card">
      <div className="info-card__header">
        <span className="info-card__title">{title}</span>
        <span className="info-card__badge">Hôm nay</span>
      </div>
      {rows.map((row) => (
        <div key={row.label} className="info-card__row">
          <span className="info-card__row-icon" aria-hidden="true">
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
          <div className="info-card__row-text">
            <span className="info-card__row-label">{row.label}</span>
            <span className="info-card__row-sub">{row.sub}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
