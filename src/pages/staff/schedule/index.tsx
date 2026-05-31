import { Box, List, Page, Tabs, Text } from "zmp-ui";
import { CurrentScheduleSection } from "./current-schedule";
import { AvailabilityRegistrationSection } from "./avaibility-registration";
import { WorkHistorySection } from "./work-history";

function SchedulePage() {
  return (
    <Page className="h-full min-h-0 overflow-y-auto">
      <Tabs
        className="schedule-tabs"
        id="schedule-tabs"
        defaultActiveKey="schedule"
      >
        <Tabs.Tab key="schedule" label="Ban biểu">
          <Box className="pt-2">
            <CurrentScheduleSection />
          </Box>
        </Tabs.Tab>
        <Tabs.Tab key="register" label="Đăng ban">
          <Box className="pt-2">  
            <AvailabilityRegistrationSection />
          </Box>
        </Tabs.Tab>
        <Tabs.Tab key="history" label="Ban ký">
          <Box className="pt-2">
            <WorkHistorySection />
          </Box>
        </Tabs.Tab>
      </Tabs>
    </Page>
    
  );
}

export default SchedulePage;
