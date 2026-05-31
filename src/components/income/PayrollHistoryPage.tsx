import React from "react";
import { Page, Header, useNavigate } from "zmp-ui";
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
      <div className="income-tab-content">
        {payrolls.length === 0 ? (
          <EmptyState
            emoji="📋"
            title="Chưa có lịch sử lương"
            subtitle="Các kỳ lương đã thanh toán sẽ xuất hiện ở đây"
          />
        ) : (
          <div className="payroll-history-list">
            {payrolls.map((payroll) => (
              <div
                key={payroll.id}
                className="payroll-history-item income-card--tappable"
                onClick={() => navigate(`/income/payroll/${payroll.id}`)}
                role="button"
                aria-label={`Kỳ lương ${payroll.period}`}
              >
                <div className="payroll-history-item__left">
                  <p className="payroll-history-item__period">{payroll.period}</p>
                  <p className="payroll-history-item__paydate">
                    Trả ngày {payroll.payDate}
                  </p>
                </div>
                <div className="payroll-history-item__right">
                  <p className="payroll-history-item__amount">
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
