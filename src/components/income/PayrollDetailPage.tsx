import React from "react";
import { Page, Header, Button, useParams, useNavigate } from "zmp-ui";
import { StatusBadge, EarningsRow } from "@/components/income/SharedComponents";
import { formatVND } from "@/utils/currency";
import type { Payroll } from "@/types/income";

interface PayrollDetailPageProps {
  payrolls: Payroll[];
}

const BREAKDOWN_CONFIG = [
  { key: "shiftPay",       label: "Lương ca cơ bản",     color: "var(--zmp-primary-color)" },
  { key: "overtime",       label: "Làm thêm giờ (OT)",   color: "var(--success)" },
  { key: "deliveryIncome", label: "Thu nhập giao hàng",  color: "var(--warning)" },
  { key: "bonus",          label: "Thưởng",               color: "#AF52DE" },
] as const;

export const PayrollDetailPage: React.FC<PayrollDetailPageProps> = ({ payrolls }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const payroll = payrolls.find((p) => p.id === id) ?? payrolls[0];
  if (!payroll) return null;

  return (
    <Page hideScrollbar>

      <div className="income-tab-content">
        {/* Hero amount */}
        <div className="income-card income-card--border-green">
          <div className="payroll-detail-hero">
            <p className="income-card__eyebrow">Tổng lương nhận</p>
            <p className="payroll-detail-hero__amount">
              {formatVND(payroll.totalAmount)}
            </p>
            <StatusBadge status={payroll.status} />
          </div>

          <div className="income-card__divider" />

          <div className="payroll-detail-meta">
            <div className="payroll-detail-meta__row">
              <span className="payroll-detail-meta__label">Kỳ lương</span>
              <span className="payroll-detail-meta__value">{payroll.period}</span>
            </div>
            <div className="payroll-detail-meta__row">
              <span className="payroll-detail-meta__label">Ngày trả</span>
              <span className="payroll-detail-meta__value">{payroll.payDate}</span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="income-card">
          <p className="income-card__section-title">Chi tiết thu nhập</p>
          <div className="income-card__breakdown">
            {BREAKDOWN_CONFIG.map((cfg) => (
              <EarningsRow
                key={cfg.key}
                color={cfg.color}
                label={cfg.label}
                value={formatVND(payroll.breakdown[cfg.key])}
              />
            ))}
          </div>
          <div className="income-card__divider" />
          <div className="earnings-row earnings-row--total">
            <span className="earnings-row__label earnings-row__label--bold">
              Tổng cộng
            </span>
            <span className="earnings-row__value earnings-row__value--green earnings-row__value--large">
              {formatVND(payroll.totalAmount)}
            </span>
          </div>
        </div>

        {/* Navigate to history */}
        <Button
          fullWidth
          onClick={() => navigate("/income/payroll-history")}
        >
          📋  Xem lịch sử lương
        </Button>
      </div>
    </Page>
  );
};
