import React from "react";
import { Page, Button, useParams, useNavigate } from "zmp-ui";
import { StatusBadge, EarningsRow } from "@/components/income/SharedComponents";
import { formatVND } from "@/utils/currency";
import type { Payroll } from "@/types/income";

interface PayrollDetailPageProps {
  payrolls: Payroll[];
}

const BREAKDOWN_CONFIG = [
  { key: "shiftPay", label: "Lương ca cơ bản", color: "#006AF5" },
  { key: "overtime", label: "Làm thêm giờ (OT)", color: "#00C853" },
  { key: "deliveryIncome", label: "Thu nhập giao hàng", color: "#FFA000" },
  { key: "bonus", label: "Thưởng", color: "#AF52DE" },
] as const;

export const PayrollDetailPage: React.FC<PayrollDetailPageProps> = ({ payrolls }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const payroll = payrolls.find((p) => p.id === id) ?? payrolls[0];
  if (!payroll) return null;

  return (
    <Page hideScrollbar>
      <div className="flex min-h-full flex-col gap-3 bg-[#F4F5F6] px-4 pb-6 pt-3">
        {/* Hero amount */}
        <div className="rounded-xl border border-[#00C853]/25 bg-white p-4">
          <div className="pb-3.5 pt-2 text-center">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#767A7F]">
              Tổng lương nhận
            </p>
            <p className="my-1.5 text-[32px] font-bold leading-none tracking-[-1px] text-[#00C853]">
              {formatVND(payroll.totalAmount)}
            </p>
            <StatusBadge status={payroll.status} />
          </div>

          <div className="my-3 h-px bg-black/[.08]" />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#767A7F]">Kỳ lương</span>
              <span className="text-[13px] font-semibold text-[#141415]">
                {payroll.period}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#767A7F]">Ngày trả</span>
              <span className="text-[13px] font-semibold text-[#141415]">
                {payroll.payDate}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="rounded-xl border border-black/[.08] bg-white p-4">
          <p className="mb-3 text-[13px] font-semibold text-[#141415]">
            Chi tiết thu nhập
          </p>
          <div className="flex flex-col gap-[9px]">
            {BREAKDOWN_CONFIG.map((cfg) => (
              <EarningsRow
                key={cfg.key}
                color={cfg.color}
                label={cfg.label}
                value={formatVND(payroll.breakdown[cfg.key])}
              />
            ))}
          </div>
          <div className="my-3 h-px bg-black/[.08]" />
          <div className="flex items-center justify-between pt-2.5">
            <span className="text-[13px] font-semibold text-[#141415]">Tổng cộng</span>
            <span className="text-[17px] font-semibold text-[#00C853]">
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
