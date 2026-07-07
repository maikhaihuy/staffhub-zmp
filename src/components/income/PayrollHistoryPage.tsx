import React from "react";
import { Page, useNavigate } from "zmp-ui";
import { StatusBadge, EmptyState } from "@/components/income/SharedComponents";
import { formatVND } from "@/utils/currency";
import type { Payroll } from "@/types/income";

interface PayrollHistoryPageProps {
  payrolls: Payroll[];
}

export const PayrollHistoryPage: React.FC<PayrollHistoryPageProps> = ({
  payrolls,
}) => {
  const navigate = useNavigate();

  return (
    <Page hideScrollbar>
      <div className="flex min-h-full flex-col gap-3 bg-[#F4F5F6] px-4 pb-6 pt-3">
        {payrolls.length === 0 ? (
          <EmptyState
            emoji="📋"
            title="Chưa có lịch sử lương"
            subtitle="Các kỳ lương đã thanh toán sẽ xuất hiện ở đây"
          />
        ) : (
          <div className="flex flex-col gap-2">
            {payrolls.map((payroll) => (
              <div
                key={payroll.id}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-black/[.08] bg-white px-4 py-3.5 transition-opacity active:opacity-75"
                onClick={() => navigate(`/income/payroll/${payroll.id}`)}
                role="button"
                aria-label={`Kỳ lương ${payroll.period}`}
              >
                <div>
                  <p className="mb-1 text-sm font-semibold text-[#141415]">
                    {payroll.period}
                  </p>
                  <p className="text-xs text-[#767A7F]">
                    Trả ngày {payroll.payDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="mb-1 text-base font-bold text-[#141415]">
                    {formatVND(payroll.totalAmount)}
                  </p>
                  <StatusBadge status={payroll.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
};
