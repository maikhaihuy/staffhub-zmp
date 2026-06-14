import { openMiniApp } from "zmp-sdk";
import { Box, Button, Header, Icon, Page, Tabs, Text } from "zmp-ui";

import {
  mockDeliveryEarnings,
  mockLatestPaidPayroll,
  mockMonthlyEarnings,
  mockPendingApproval,
  mockShiftEarnings,
} from "@/constants/income";
import { ShiftEarningsTab } from "@/components/income/ShiftEarningsTab";
import { DeliveryEarningsTab } from "@/components/income/DeliveryEarningsTab";
import { OverviewTab } from "@/components/income/OverviewTab";
import { useState } from "react";

// Derived totals
const totalShiftPay = mockShiftEarnings.reduce(
  (sum, s) => sum + s.basePay + s.overtime + s.bonus,
  0,
);
const totalDeliveryIncome = mockDeliveryEarnings.reduce(
  (sum, d) => sum + d.fee,
  0,
);

function IncomePage() {
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <Page className="h-full min-h-0 overflow-hidden">
      <div className="h-full min-h-0 flex flex-col overflow-hidden">
        <div className="shrink-0 bg-white z-10">
          <Tabs
            className="custom-tabs"
            id="income-tabs"
            //        defaultActiveKey="overview"
            activeKey={activeTab}
            onChange={setActiveTab}
          >
            <Tabs.Tab key="overview" label="Tổng quan" />

            <Tabs.Tab key="shifts" label="Tiền ca" />

            <Tabs.Tab key="delivery" label="Tiền ship" />
          </Tabs>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {activeTab === "overview" && (
            <OverviewTab
              earnings={mockMonthlyEarnings}
              pending={mockPendingApproval}
              latestPayroll={mockLatestPaidPayroll}
            />
          )}
          {activeTab === "shifts" && (
            <ShiftEarningsTab
              shifts={mockShiftEarnings}
              totalShiftPay={totalShiftPay}
            />
          )}
          {activeTab === "delivery" && (
            <DeliveryEarningsTab
              deliveries={mockDeliveryEarnings}
              totalDeliveryIncome={totalDeliveryIncome}
            />
          )}
        </div>
      </div>
    </Page>
  );
}

export default IncomePage;
