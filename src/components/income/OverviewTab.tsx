import React from "react";
import { useNavigate } from "zmp-ui";
import { Button } from "zmp-ui";
import { StatusBadge, EarningsRow, EmptyState } from "./SharedComponents";
import { formatVND } from "@/utils/currency";
import type { MonthlyEarnings, PendingApproval, Payroll } from "@/types/income";

interface OverviewTabProps {
  earnings: MonthlyEarnings;
  pending: PendingApproval;
  latestPayroll: Payroll;
}

const BREAKDOWN_CONFIG = [
  { key: "shiftPay",       label: "Ca làm việc",     color: "var(--zmp-primary-color)" },
  { key: "approvedOT",     label: "OT đã duyệt",     color: "var(--success)" },
  { key: "deliveryIncome", label: "Thu nhập ship",    color: "var(--warning)" },
  { key: "bonus",          label: "Thưởng",           color: "#AF52DE" },
] as const;

export const OverviewTab: React.FC<OverviewTabProps> = ({
  earnings,
  pending,
  latestPayroll,
}) => {
  const navigate = useNavigate();
  const hasPending = pending.pendingOTCount > 0 || pending.pendingDeliveryCount > 0;

  return (
    <div className="income-tab-content">
      {/* Section A — Estimated Earnings */}
      <div className="income-card income-card--gradient-blue">
        <div className="income-card__header">
          <div>
            <p className="income-card__eyebrow">Thu nhập ước tính</p>
            <p className="income-card__total">{formatVND(earnings.total)}</p>
            <p className="income-card__meta">
              Từ {earnings.periodStart} đến nay
            </p>
          </div>
          <div className="income-card__icon">💰</div>
        </div>

        <div className="income-card__divider" />

        <div className="income-card__breakdown">
          {BREAKDOWN_CONFIG.map((cfg) => (
            <EarningsRow
              key={cfg.key}
              color={cfg.color}
              label={cfg.label}
              value={formatVND(earnings.breakdown[cfg.key])}
            />
          ))}
        </div>
      </div>

      {/* Section B — Latest Paid Amount */}
      <div className="income-card income-card--gradient-green">
        <div className="income-card__header">
          <div>
            <p className="income-card__eyebrow">Đã nhận lương</p>
            <p className="income-card__total income-card__total--green">
              {formatVND(latestPayroll.totalAmount)}
            </p>
            <p className="income-card__meta">Kỳ {latestPayroll.period}</p>
          </div>
          <div className="income-card__icon income-card__icon--green">✅</div>
        </div>
        <div className="income-card__footer-row">
          <span className="income-card__meta">
            Ngày trả:{" "}
            <strong className="income-card__meta--strong">{latestPayroll.payDate}</strong>
          </span>
          <StatusBadge status={latestPayroll.status} />
        </div>
      </div>

      {/* Section C — Pending Approvals */}
      <div
        className={`income-card ${
          hasPending ? "income-card--border-amber" : "income-card--border-green"
        }`}
      >
        <p className="income-card__section-title">Chờ phê duyệt</p>

        {hasPending ? (
          <div className="pending-list">
            {pending.pendingOTCount > 0 && (
              <div className="pending-item">
                <div className="pending-item__left">
                  <span className="pending-item__emoji">⏰</span>
                  <span className="pending-item__text">
                    {pending.pendingOTCount} ca chờ duyệt OT
                  </span>
                </div>
                <StatusBadge status="pending" />
              </div>
            )}
            {pending.pendingDeliveryCount > 0 && (
              <div className="pending-item">
                <div className="pending-item__left">
                  <span className="pending-item__emoji">🛵</span>
                  <span className="pending-item__text">
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
        className="income-card income-card--tappable"
        onClick={() => navigate(`/income/payroll/${latestPayroll.id}`)}
        role="button"
        aria-label={`Xem chi tiết kỳ lương ${latestPayroll.period}`}
      >
        <div className="income-card__header">
          <div>
            <p className="income-card__eyebrow">Kỳ lương gần nhất</p>
            <p className="income-card__subtitle-amount">
              {formatVND(latestPayroll.totalAmount)}
            </p>
            <p className="income-card__meta">{latestPayroll.period}</p>
            <p className="income-card__meta income-card__meta--tertiary">
              Trả ngày {latestPayroll.payDate}
            </p>
          </div>
          <div className="income-card__actions">
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
