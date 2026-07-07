import {
  sampleMasterShifts,
  sampleScheduleBlocks,
  sampleScheduleDays,
  sampleScheduleLanes,
} from "./sample-data";
import { WeeklyScheduleGrid } from "./WeeklyScheduleGrid";

export function WeeklyScheduleDemo() {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Weekly Schedule Demo
        </h2>
        <p className="text-sm text-slate-500">
          Readonly reusable timeline component
        </p>
      </div>

      <WeeklyScheduleGrid
        days={sampleScheduleDays}
        lanes={sampleScheduleLanes}
        masterShifts={sampleMasterShifts}
        blocks={sampleScheduleBlocks}
        durationMinutes={120}
        slotWidth={76}
        onBlockClick={(block) => {
          console.log("Clicked schedule block:", block);
        }}
      />
    </section>
  );
}
