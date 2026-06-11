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
      <div className="mb-[7px] flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.08em] text-stone-500">
        {icon === "warning" ? <WarningIcon /> : <ChecklistIcon />}
        {label}
      </div>

      <div className="grid gap-2.5">
        {groups.map((group) => {
          const tasks = group.tasks.filter((task) => task.kind === kind);
          if (tasks.length === 0) return null;

          return (
            <div
              className={`overflow-hidden rounded-xl border bg-white ${
                mandatory ? "border-amber-200" : "border-stone-200"
              }`}
              key={`${group.scope}-${kind}`}
            >
              <div className="flex items-center justify-between gap-2.5 border-b border-amber-200 bg-amber-100 px-3.5 py-[9px]">
                <div>
                  <div className="text-xs font-bold text-amber-900">{group.title}</div>
                  <div className="mt-0.5 text-[11px] text-stone-500">
                    {group.subtitle}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-[3px] text-[10.5px] font-bold ${
                    group.scope === "master"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
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
