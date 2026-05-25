import { RETAIL_FB_PERIODS, RETAIL_FB_SAMPLE_BLOCKS, WeeklyShiftGrid } from "@/components/schedules/weekly-shift-grid";

export const WorkHistorySection = () => {
  return (
    <WeeklyShiftGrid periods={RETAIL_FB_PERIODS}
          blocks={RETAIL_FB_SAMPLE_BLOCKS} mode="read-only" />
  );
};
