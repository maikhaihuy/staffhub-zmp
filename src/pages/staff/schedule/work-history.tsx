import { WeeklyScheduleGrid } from "@/components/weekly-schedule/WeeklyScheduleGrid";
import {
  sampleMasterShifts,
  sampleScheduleBlocks,
  sampleScheduleDays,
  sampleScheduleLanes
} from "@/components/weekly-schedule/sample-data";
import { WorkScheduleShiftBlock } from "@/components/weekly-schedule/shift-blocks";

export const WorkHistorySection = () => {
  return (
    <WeeklyScheduleGrid
          days={sampleScheduleDays}
          lanes={sampleScheduleLanes}
          masterShifts={sampleMasterShifts}
          blocks={sampleScheduleBlocks}
          durationMinutes={120}
          slotWidth={88}
          renderBlock={(block) => <WorkScheduleShiftBlock block={block} />}
          onBlockClick={(block) => {
            console.log("Clicked schedule block:", block);
          }}
        />
  );
};
