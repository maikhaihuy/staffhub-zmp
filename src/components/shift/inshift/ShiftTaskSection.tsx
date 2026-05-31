import type { ShiftTaskGroup, ShiftTaskKind } from "@/types/shift";
import {
  ChecklistIcon,
  getScopeLabel,
  ShiftTaskCard,
  WarningIcon,
} from "./ShiftTaskCard";

interface ShiftTaskSectionProps {
  label: string;
  icon: "warning" | "checklist";
  groups: ShiftTaskGroup[];
  kind: ShiftTaskKind;
  onToggleTask: (id: string) => void;
  mandatory?: boolean;
}

export function ShiftTaskSection({
  label,
  icon,
  groups,
  kind,
  onToggleTask,
  mandatory,
}: ShiftTaskSectionProps) {
  return (
    <section aria-label={label}>
      <div className="section-label">
        {icon === "warning" ? <WarningIcon /> : <ChecklistIcon />}
        {label}
      </div>

      <div className="scoped-task-stack">
        {groups.map((group) => {
          const tasks = group.tasks.filter((task) => task.kind === kind);
          if (tasks.length === 0) return null;

          return (
            <div
              className={`task-group ${mandatory ? "task-group--mandatory" : ""}`}
              key={`${group.scope}-${kind}`}
            >
              <div className="task-scope-header">
                <div>
                  <div className="task-scope-title">{group.title}</div>
                  <div className="task-scope-subtitle">{group.subtitle}</div>
                </div>
                <span className={`scope-badge scope-badge--${group.scope}`}>
                  {getScopeLabel(group.scope)}
                </span>
              </div>

              {tasks.map((task, index) => (
                <ShiftTaskCard
                  key={task.id}
                  task={task}
                  onToggleTask={onToggleTask}
                  isLast={index === tasks.length - 1}
                />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
