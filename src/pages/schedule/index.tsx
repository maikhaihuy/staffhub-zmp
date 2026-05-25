import { Box, List, Page, Tabs, Text } from "zmp-ui";
import { CurrentScheduleSection } from "./current-schedule";
import { AvailabilityRegistrationSection } from "./avaibility-registration";
import { WorkHistorySection } from "./work-history";

function SchedulePage() {
  return (
    <Page>
      <Tabs id="schedule-tabs" defaultActiveKey="schedule">
        <Tabs.Tab key="schedule" label="Ban biểu">
          <CurrentScheduleSection />
        </Tabs.Tab>
        <Tabs.Tab key="register" label="Đăng ban">
          <AvailabilityRegistrationSection />
        </Tabs.Tab>
        <Tabs.Tab key="history" label="Ban ký">
          <WorkHistorySection />
        </Tabs.Tab>
      </Tabs>
    </Page>
  );
}

export default SchedulePage;