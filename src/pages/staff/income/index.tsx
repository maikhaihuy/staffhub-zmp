import { openMiniApp } from "zmp-sdk";
import { Box, Button, Header, Icon, Page, Tabs, Text } from "zmp-ui";

import Clock from "@/components/clock";
import Logo from "@/components/logo";
import bg from "@/static/bg.svg";
import { mockDeliveryEarnings, mockLatestPaidPayroll, mockMonthlyEarnings, mockPendingApproval, mockShiftEarnings } from "@/constants/income";
import { ShiftEarningsTab } from "@/components/income/ShiftEarningsTab";
import { DeliveryEarningsTab } from "@/components/income/DeliveryEarningsTab";
import { OverviewTab } from "@/components/income/OverviewTab";

// Derived totals
const totalShiftPay = mockShiftEarnings.reduce(
  (sum, s) => sum + s.basePay + s.overtime + s.bonus,
  0
);
const totalDeliveryIncome = mockDeliveryEarnings.reduce(
  (sum, d) => sum + d.fee,
  0
);

function IncomePage() {
  return (
    <Page
      className="flex flex-col items-center justify-center space-y-6 bg-cover bg-center bg-no-repeat bg-white dark:bg-black"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <Tabs defaultActiveKey="overview" className="income-tabs">
        <Tabs.Tab key="overview" label="Tổng quan">
          <OverviewTab
            earnings={mockMonthlyEarnings}
            pending={mockPendingApproval}
            latestPayroll={mockLatestPaidPayroll}
          />
        </Tabs.Tab>

        <Tabs.Tab key="shifts" label="Tiền ca">
          <ShiftEarningsTab
            shifts={mockShiftEarnings}
            totalShiftPay={totalShiftPay}
          />
        </Tabs.Tab>

        <Tabs.Tab key="delivery" label="Tiền ship">
          <DeliveryEarningsTab
            deliveries={mockDeliveryEarnings}
            totalDeliveryIncome={totalDeliveryIncome}
          />
        </Tabs.Tab>
      </Tabs>
    </Page>
  );
}

export default IncomePage;
