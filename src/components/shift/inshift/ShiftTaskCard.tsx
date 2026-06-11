import type { ShiftTask, ShiftTaskScope } from "@/types/shift";

interface ShiftTaskCardProps {
  task: ShiftTask;
  onToggleTask: (id: string) => void;
  isLast: boolean;
}

export function ShiftTaskCard({ task, onToggleTask, isLast }: ShiftTaskCardProps) {
  const statusText = task.done
    ? `Đã xong bởi ${task.completedByName ?? "một bạn trong ca"}${task.completedAt ? ` · ${task.completedAt}` : ""}`
    : "Chưa hoàn thành";
  const iconTone = task.done ? "done" : task.kind === "mandatory" ? "amber" : "blue";

  return (
    <button
      className={`flex w-full items-center gap-3 bg-white px-3.5 py-3.5 text-left transition-colors active:bg-stone-50 ${
        isLast ? "border-b-0" : "border-b border-stone-100"
      }`}
      onClick={() => onToggleTask(task.id)}
      aria-label={`${task.title}: ${task.done ? "đã hoàn thành" : "chưa hoàn thành"}`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] transition-colors ${TASK_ICON_CLASSES[iconTone]}`}
        aria-hidden="true"
      >
        {task.done ? <CheckIcon /> : task.kind === "mandatory" ? <FlagIcon /> : <ChecklistIcon large />}
      </div>

      <div className="min-w-0 flex-1">
        <span
          className={`block text-sm font-medium leading-[1.3] transition-colors ${
            task.done ? "text-stone-500" : "text-stone-900"
          }`}
        >
          {task.title}
        </span>
        <span className="mt-0.5 block text-xs text-stone-400">{task.helperText}</span>
        <span className="mt-1.5 flex flex-wrap gap-[5px]">
          <span className={`inline-flex items-center rounded-full px-[7px] py-0.5 text-[10.5px] font-semibold leading-tight ${TASK_KIND_PILL_CLASSES[task.kind]}`}>
            {task.kind === "mandatory" ? "Bắt buộc" : "Không bắt buộc"}
          </span>
          <span className={`inline-flex items-center rounded-full px-[7px] py-0.5 text-[10.5px] font-semibold leading-tight ${TASK_SCOPE_PILL_CLASSES[task.scope]}`}>
            {getScopeLabel(task.scope)}
          </span>
        </span>
        <span
          className={`mt-[5px] block text-[11px] ${
            task.done ? "font-semibold text-green-700" : "text-stone-400"
          }`}
        >
          {statusText}
        </span>
      </div>

      <div className="shrink-0 text-stone-400" aria-hidden="true">
        {task.done
          ? <span className="inline-flex items-center gap-[3px] rounded-[20px] bg-green-50 px-[9px] py-[3px] text-[11px] font-semibold text-green-700"><CheckIcon small />Xong</span>
          : <ChevronIcon />
        }
      </div>
    </button>
  );
}

export function getScopeLabel(scope: ShiftTaskScope) {
  return scope === "master" ? "Ca chính" : "Ca của bạn";
}

const TASK_ICON_CLASSES = {
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-blue-700",
  done: "bg-green-50 text-green-700",
};

const TASK_KIND_PILL_CLASSES = {
  mandatory: "bg-amber-50 text-amber-600",
  optional: "bg-stone-100 text-stone-500",
};

const TASK_SCOPE_PILL_CLASSES: Record<ShiftTaskScope, string> = {
  master: "bg-amber-100 text-amber-800",
  sub: "bg-blue-50 text-blue-700",
};

export const WarningIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

export const ChecklistIcon = ({ large }: { large?: boolean }) => (
  <svg width={large ? 18 : 13} height={large ? 18 : 13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={large ? 2 : 2.5} aria-hidden="true"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
);

const CheckIcon = ({ small }: { small?: boolean }) => (
  <svg width={small ? 12 : 18} height={small ? 12 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
);

const FlagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
);
