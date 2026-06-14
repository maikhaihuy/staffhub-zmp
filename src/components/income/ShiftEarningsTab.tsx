import React, { useState } from "react";
import { formatVND } from "@/utils/currency";
import type { ApprovalStatus, ShiftEarning } from "@/types/income";

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
      className={`overflow-hidden rounded-lg border bg-white transition-shadow ${
        expanded ? "shadow-[0_2px_8px_rgba(0,0,0,0.07)]" : ""
      } ${
        shift.status === "pending"
          ? "border-l-[3px] border-l-[#FFA000] border-y-black/[.08] border-r-black/[.08]"
          : "border-black/[.08]"
      }`}
    >
      {/* Collapsed summary */}
      <div
        className="flex cursor-pointer select-none items-center justify-between px-3.5 py-3 active:bg-black/[.03]"
        onClick={onToggle}
        role="button"
        aria-expanded={expanded}
        aria-label={`Ca ${shift.date} ${shift.timeRange}`}
      >
        <div className="flex-1">
          <div className="mb-[3px] flex items-center gap-2">
            <span className="text-sm font-semibold text-[#141415]">
              {shift.date} · {shift.timeRange}
            </span>
            {shift.status === "pending" && (
              <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#FFA000]" aria-hidden="true" />
            )}
          </div>
          <p className="text-xs text-[#767A7F]">{shift.branch}</p>
        </div>
        <div className="ml-3 text-right">
          <p className="text-[15px] font-bold text-[#141415]">{formatVND(total)}</p>
          <span className="mt-1 block text-[10px] text-[#AEAEB2]" aria-hidden="true">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="flex flex-col gap-[9px] border-t border-black/[.08] bg-[#FAFAFA] px-3.5 py-3">
          <DetailRow label="Lương ca cơ bản" value={formatVND(shift.basePay)} />

          {shift.overtime > 0 && (
            <DetailRow
              label="Làm thêm (OT)"
              value={`+${formatVND(shift.overtime)}`}
              valueClassName="text-[#00C853]"
            />
          )}

          {shift.bonus > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#767A7F]">Thưởng</span>
              <div className="flex items-center gap-1.5">
                {shift.bonusTag && (
                  <span className="rounded-[20px] bg-[#AF52DE]/10 px-2 py-0.5 text-[11px] font-semibold text-[#AF52DE]">{shift.bonusTag.label}</span>
                )}
                <span className="text-[13px] font-semibold text-[#AF52DE]">
                  +{formatVND(shift.bonus)}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-black/[.08] pt-[9px]">
            <span className="text-[13px] font-semibold text-[#141415]">
              Tổng
            </span>
            <span className="text-[15px] font-semibold text-[#141415]">
              {formatVND(total)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#767A7F]">Trạng thái</span>
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
    <div className="flex min-h-full flex-col gap-3 bg-[#F4F5F6] px-4 pb-6 pt-3">
      {/* Summary card */}
      <div className="rounded-xl border border-[#00C853]/15 bg-gradient-to-br from-white to-[#f0fff7] p-4">
        <div className="mb-1 flex items-start justify-between">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#767A7F]">Tổng tiền ca</p>
            <p className="text-[26px] font-bold leading-[1.15] tracking-[-0.5px] text-[#141415]">{formatVND(totalShiftPay)}</p>
            <p className="mt-[3px] text-xs text-[#767A7F]">
              {shifts.length} ca · Từ 01/05 đến nay
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-[5px]">
            <span className="inline-block whitespace-nowrap rounded-[20px] bg-[#00C853]/[.12] px-[9px] py-[3px] text-[11px] font-semibold text-[#007A33]">+{approvedCount} đã duyệt</span>
            {pendingCount > 0 && (
              <span className="inline-block whitespace-nowrap rounded-[20px] bg-[#FFA000]/[.12] px-[9px] py-[3px] text-[11px] font-semibold text-[#7A4A00]">{pendingCount} chờ duyệt</span>
            )}
          </div>
        </div>
      </div>

      {/* Shifts grouped by week */}
      {shifts.length === 0 ? (
        <EmptyState emoji="📋" title="Chưa có ca nào" subtitle="Các ca hoàn thành sẽ xuất hiện ở đây" />
      ) : (
        Object.entries(weekGroups).map(([week, weekShifts]) => (
          <div key={week} className="flex flex-col">
            <SectionHeader title={week} />
            <div className="flex flex-col gap-2">
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

function DetailRow({
  label,
  value,
  valueClassName = "text-[#141415]",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-[#767A7F]">{label}</span>
      <span className={`text-[13px] font-semibold ${valueClassName}`}>{value}</span>
    </div>
  );
}

const STATUS_CONFIG: Record<ApprovalStatus, { label: string; className: string }> = {
  approved: { label: "✓ Đã duyệt", className: "bg-[#00C853]/[.12] text-[#007A33]" },
  pending: { label: "⏳ Chờ duyệt", className: "bg-[#FFA000]/[.12] text-[#7A4A00]" },
  rejected: { label: "✕ Từ chối", className: "bg-[#FF3B30]/10 text-[#CC0000]" },
};

function StatusBadge({ status }: { status: ApprovalStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <span className={`inline-block whitespace-nowrap rounded-[20px] px-[9px] py-[3px] text-[11px] font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <p className="mb-2 px-0.5 text-[11px] font-bold uppercase tracking-[0.6px] text-[#767A7F]">
      {title}
    </p>
  );
}

function EmptyState({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="px-0 pb-2 pt-4 text-center">
      <span className="mb-1.5 block text-[30px]">{emoji}</span>
      <p className="mb-1 text-sm font-semibold text-[#00C853]">{title}</p>
      {subtitle && <p className="text-xs text-[#767A7F]">{subtitle}</p>}
    </div>
  );
}
