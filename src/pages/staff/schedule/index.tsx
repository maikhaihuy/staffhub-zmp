import { Page, Tabs } from "zmp-ui";
import { AvailabilityRegistrationTabs } from "@/components/schedule/AvailabilityRegistrationTabs";
import { CurrentScheduleTabs } from "@/components/schedule/CurrentScheduleTabs";
import { WorkHistoryTabs } from "@/components/schedule/WorkHistoryTabs";
import { useState } from "react";

function SchedulePage() {
  const [activeTab, setActiveTab] = useState("schedule");
  
  return (
    <Page className="h-full min-h-0 overflow-hidden">
      <div className="h-full min-h-0 flex flex-col overflow-hidden">
        <div className="shrink-0 bg-white z-10">
          <Tabs
            className="custom-tabs"
            id="schedule-tabs"
            activeKey={activeTab}
            onChange={setActiveTab}
          >
            <Tabs.Tab key="schedule" label="Ban biểu" />
            <Tabs.Tab key="register" label="Đăng ban" />
            <Tabs.Tab key="history" label="Ban ký" />
          </Tabs>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {activeTab === "schedule" && (
            <CurrentScheduleTabs />
          )}
          {activeTab === "register" && (
            <AvailabilityRegistrationTabs />
          )}
          {activeTab === "history" && (
            <WorkHistoryTabs />
          )}
        </div>
      </div>
    </Page>
  );
}

export default SchedulePage;
