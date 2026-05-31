import React, { useState } from "react";
import { StatusBadge, SectionHeader, EmptyState } from "./SharedComponents";
import { formatVND } from "@/utils/currency";
import type { ShiftEarning } from "@/types/income";

interface ShiftEarningsTabProps {
  shifts: ShiftEarning[];
  totalShiftPay: number;
}

// ─── Individual shift row (collapsible) ───────────────────────────────────────

interface ShiftRowProps {
  shift: ShiftEarning;
  expanded: boolean;
  onToggle: () => void;
}

const ShiftRow: React.FC<ShiftRowProps> = ({ shift, expanded, onToggle }) => {
  const total = shift.basePay + shift.overtime + shift.bonus;

  return (
    <div
      className={`shift-row ${expanded ? "shift-row--expanded" : ""} ${
        shift.status === "pending" ? "shift-row--pending" : ""
      }`}
    >
      {/* Collapsed summary */}
      <div
        className="shift-row__summary"
        onClick={onToggle}
        role="button"
        aria-expanded={expanded}
        aria-label={`Ca ${shift.date} ${shift.timeRange}`}
      >
        <div className="shift-row__info">
          <div className="shift-row__title-row">
            <span className="shift-row__title">
              {shift.date} · {shift.timeRange}
            </span>
            {shift.status === "pending" && (
              <span className="shift-row__pending-dot" aria-hidden="true" />
            )}
          </div>
          <p className="shift-row__branch">{shift.branch}</p>
        </div>
        <div className="shift-row__right">
          <p className="shift-row__total">{formatVND(total)}</p>
          <span className="shift-row__chevron" aria-hidden="true">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="shift-row__detail">
          <div className="shift-detail-row">
            <span className="shift-detail-row__label">Lương ca cơ bản</span>
            <span className="shift-detail-row__value">{formatVND(shift.basePay)}</span>
          </div>

          {shift.overtime > 0 && (
            <div className="shift-detail-row">
              <span className="shift-detail-row__label">Làm thêm (OT)</span>
              <span className="shift-detail-row__value shift-detail-row__value--green">
                +{formatVND(shift.overtime)}
              </span>
            </div>
          )}

          {shift.bonus > 0 && (
            <div className="shift-detail-row">
              <span className="shift-detail-row__label">Thưởng</span>
              <div className="shift-detail-row__bonus">
                {shift.bonusTag && (
                  <span className="bonus-tag">{shift.bonusTag.label}</span>
                )}
                <span className="shift-detail-row__value shift-detail-row__value--purple">
                  +{formatVND(shift.bonus)}
                </span>
              </div>
            </div>
          )}

          <div className="shift-detail-row shift-detail-row--total">
            <span className="shift-detail-row__label shift-detail-row__label--bold">
              Tổng
            </span>
            <span className="shift-detail-row__value shift-detail-row__value--bold">
              {formatVND(total)}
            </span>
          </div>

          <div className="shift-detail-row">
            <span className="shift-detail-row__label">Trạng thái</span>
            <StatusBadge status={shift.status} />
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main tab component ───────────────────────────────────────────────────────

export const ShiftEarningsTab: React.FC<ShiftEarningsTabProps> = ({
  shifts,
  totalShiftPay,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const approvedCount = shifts.filter((s) => s.status === "approved").length;
  const pendingCount = shifts.filter((s) => s.status === "pending").length;

  // Group shifts by weekGroup, preserving insertion order
  const weekGroups = shifts.reduce<Record<string, ShiftEarning[]>>((acc, shift) => {
    if (!acc[shift.weekGroup]) acc[shift.weekGroup] = [];
    acc[shift.weekGroup].push(shift);
    return acc;
  }, {});

  return (
    <div className="income-tab-content">
      {/* Summary card */}
      <div className="income-card income-card--gradient-green">
        <div className="income-card__header">
          <div>
            <p className="income-card__eyebrow">Tổng tiền ca</p>
            <p className="income-card__total">{formatVND(totalShiftPay)}</p>
            <p className="income-card__meta">
              {shifts.length} ca · Từ 01/05 đến nay
            </p>
          </div>
          <div className="shift-summary-badges">
            <span className="badge badge--approved">+{approvedCount} đã duyệt</span>
            {pendingCount > 0 && (
              <span className="badge badge--pending">{pendingCount} chờ duyệt</span>
            )}
          </div>
        </div>
      </div>

      {/* Shifts grouped by week */}
      {shifts.length === 0 ? (
        <EmptyState emoji="📋" title="Chưa có ca nào" subtitle="Các ca hoàn thành sẽ xuất hiện ở đây" />
      ) : (
        Object.entries(weekGroups).map(([week, weekShifts]) => (
          <div key={week} className="shift-week-group">
            <SectionHeader title={week} />
            <div className="shift-list">
              {weekShifts.map((shift) => (
                <ShiftRow
                  key={shift.id}
                  shift={shift}
                  expanded={expandedId === shift.id}
                  onToggle={() =>
                    setExpandedId(expandedId === shift.id ? null : shift.id)
                  }
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
