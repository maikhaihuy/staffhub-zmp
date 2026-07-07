import type { ShiftTaskGroup } from "@/types/shift";
import { ShiftTaskSection } from "./ShiftTaskSection";

interface ScopedShiftTasksProps {
  groups: ShiftTaskGroup[];
  onToggleTask: (id: string) => void;
}

export function ScopedShiftTasks({ groups, onToggleTask }: ScopedShiftTasksProps) {
  return (
    <>
      <ShiftTaskSection
        label="Cần xong trước khi kết ca"
        icon="warning"
        groups={groups}
        kind="mandatory"
        onToggleTask={onToggleTask}
        mandatory
      />
      <ShiftTaskSection
        label="Việc không bắt buộc"
        icon="checklist"
        groups={groups}
        kind="optional"
        onToggleTask={onToggleTask}
      />
    </>
  );
}
