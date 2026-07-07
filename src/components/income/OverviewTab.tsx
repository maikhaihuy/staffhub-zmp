import React from "react";
import { useNavigate } from "zmp-ui";
import { Button } from "zmp-ui";
import { formatVND } from "@/utils/currency";
import type {
  ApprovalStatus,
  MonthlyEarnings,
  PayrollStatus,
  PendingApproval,
  Payroll,
} from "@/types/income";

interface OverviewTabProps {
  earnings: MonthlyEarnings;
  pending: PendingApproval;
  latestPayroll: Payroll;
}

const BREAKDOWN_CONFIG = [
  { key: "shiftPay",       label: "Ca làm việc",     dotClassName: "bg-[#006AF5]" },
  { key: "approvedOT",     label: "OT đã duyệt",     dotClassName: "bg-[#00C853]" },
  { key: "deliveryIncome", label: "Thu nhập ship",   dotClassName: "bg-[#FFA000]" },
  { key: "bonus",          label: "Thưởng",          dotClassName: "bg-[#AF52DE]" },
] as const;

export const OverviewTab: React.FC<OverviewTabProps> = ({
  earnings,
  pending,
  latestPayroll,
}) => {
  const navigate = useNavigate();
  const hasPending = pending.pendingOTCount > 0 || pending.pendingDeliveryCount > 0;

  return (
    <div className="flex min-h-full flex-col gap-3 bg-[#F4F5F6] px-4 pb-6 pt-3">
      {/* Section A — Estimated Earnings */}
      <div className="rounded-xl border border-[#006AF5]/15 bg-gradient-to-br from-white to-[#f0f6ff] p-4">
        <div className="mb-1 flex items-start justify-between">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#767A7F]">Thu nhập ước tính</p>
            <p className="text-[26px] font-bold leading-[1.15] tracking-[-0.5px] text-[#141415]">{formatVND(earnings.total)}</p>
            <p className="mt-[3px] text-xs text-[#767A7F]">
              Từ {earnings.periodStart} đến nay
            </p>
          </div>
          <div className="shrink-0 rounded-xl bg-[#006AF5]/[.08] p-2.5 text-2xl leading-none">💰</div>
        </div>

        <div className="my-3 h-px bg-black/[.08]" />

        <div className="flex flex-col gap-[9px]">
          {BREAKDOWN_CONFIG.map((cfg) => (
            <EarningsRow
              key={cfg.key}
              dotClassName={cfg.dotClassName}
              label={cfg.label}
              value={formatVND(earnings.breakdown[cfg.key])}
            />
          ))}
        </div>
      </div>

      {/* Section B — Latest Paid Amount */}
      <div className="rounded-xl border border-[#00C853]/15 bg-gradient-to-br from-white to-[#f0fff7] p-4">
        <div className="mb-1 flex items-start justify-between">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#767A7F]">Đã nhận lương</p>
            <p className="text-[26px] font-bold leading-[1.15] tracking-[-0.5px] text-[#00C853]">
              {formatVND(latestPayroll.totalAmount)}
            </p>
            <p className="mt-[3px] text-xs text-[#767A7F]">Kỳ {latestPayroll.period}</p>
          </div>
          <div className="shrink-0 rounded-xl bg-[#00C853]/[.08] p-2.5 text-2xl leading-none">✅</div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="mt-[3px] text-xs text-[#767A7F]">
            Ngày trả:{" "}
            <strong className="font-semibold text-[#141415]">{latestPayroll.payDate}</strong>
          </span>
          <StatusBadge status={latestPayroll.status} />
        </div>
      </div>

      {/* Section C — Pending Approvals */}
      <div
        className={`rounded-xl border bg-white p-4 ${
          hasPending ? "border-[#FFA000]/25" : "border-[#00C853]/25"
        }`}
      >
        <p className="mb-3 text-[13px] font-semibold text-[#141415]">Chờ phê duyệt</p>

        {hasPending ? (
          <div className="flex flex-col gap-2">
            {pending.pendingOTCount > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-[#FFA000]/[.08] px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⏰</span>
                  <span className="text-[13px] text-[#141415]">
                    {pending.pendingOTCount} ca chờ duyệt OT
                  </span>
                </div>
                <StatusBadge status="pending" />
              </div>
            )}
            {pending.pendingDeliveryCount > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-[#FFA000]/[.08] px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛵</span>
                  <span className="text-[13px] text-[#141415]">
                    {pending.pendingDeliveryCount} đơn ship chờ duyệt
                  </span>
                </div>
                <StatusBadge status="pending" />
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            emoji="🎉"
            title="Tất cả đã được duyệt!"
            subtitle="OT và đơn giao hàng đã được phê duyệt đầy đủ"
          />
        )}
      </div>

      {/* Section D — Latest Payroll Card */}
      <div
        className="cursor-pointer rounded-xl border border-black/[.08] bg-white p-4 transition-opacity active:opacity-75"
        onClick={() => navigate(`/income/payroll/${latestPayroll.id}`)}
        role="button"
        aria-label={`Xem chi tiết kỳ lương ${latestPayroll.period}`}
      >
        <div className="mb-1 flex items-start justify-between">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#767A7F]">Kỳ lương gần nhất</p>
            <p className="mb-1 text-lg font-bold text-[#141415]">
              {formatVND(latestPayroll.totalAmount)}
            </p>
            <p className="mt-[3px] text-xs text-[#767A7F]">{latestPayroll.period}</p>
            <p className="mt-[3px] text-xs text-[#AEAEB2]">
              Trả ngày {latestPayroll.payDate}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <StatusBadge status={latestPayroll.status} />
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/income/payroll/${latestPayroll.id}`);
              }}
            >
              Chi tiết →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

type AnyStatus = ApprovalStatus | PayrollStatus;

const STATUS_CONFIG: Record<AnyStatus, { label: string; className: string }> = {
  approved: { label: "✓ Đã duyệt", className: "bg-[#00C853]/[.12] text-[#007A33]" },
  pending: { label: "⏳ Chờ duyệt", className: "bg-[#FFA000]/[.12] text-[#7A4A00]" },
  rejected: { label: "✕ Từ chối", className: "bg-[#FF3B30]/10 text-[#CC0000]" },
  paid: { label: "✓ Đã thanh toán", className: "bg-[#00C853]/[.12] text-[#007A33]" },
  processing: { label: "⏳ Đang xử lý", className: "bg-[#FFA000]/[.12] text-[#7A4A00]" },
};

function StatusBadge({ status }: { status: AnyStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <span className={`inline-block whitespace-nowrap rounded-[20px] px-[9px] py-[3px] text-[11px] font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function EarningsRow({
  dotClassName,
  label,
  value,
}: {
  dotClassName: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${dotClassName}`} />
        <span className="text-[13px] text-[#767A7F]">{label}</span>
      </div>
      <span className="text-sm font-semibold text-[#141415]">{value}</span>
    </div>
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
