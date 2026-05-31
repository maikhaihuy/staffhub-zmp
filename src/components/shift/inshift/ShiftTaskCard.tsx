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

  return (
    <button
      className={`task-card ${task.kind === "mandatory" ? "task-card--mandatory" : ""} ${task.done ? "task-card--done" : ""} ${isLast ? "task-card--last" : ""}`}
      onClick={() => onToggleTask(task.id)}
      aria-label={`${task.title}: ${task.done ? "đã hoàn thành" : "chưa hoàn thành"}`}
    >
      <div
        className={`task-icon task-icon--${task.done ? "done" : task.kind === "mandatory" ? "amber" : "blue"}`}
        aria-hidden="true"
      >
        {task.done ? <CheckIcon /> : task.kind === "mandatory" ? <FlagIcon /> : <ChecklistIcon large />}
      </div>

      <div className="task-info">
        <span className="task-title">{task.title}</span>
        <span className="task-sub">{task.helperText}</span>
        <span className="task-meta-row">
          <span className={`task-pill task-pill--${task.kind}`}>
            {task.kind === "mandatory" ? "Bắt buộc" : "Không bắt buộc"}
          </span>
          <span className={`task-pill task-pill--${task.scope}`}>
            {getScopeLabel(task.scope)}
          </span>
        </span>
        <span className={`task-completion ${task.done ? "task-completion--done" : ""}`}>
          {statusText}
        </span>
      </div>

      <div className="task-right" aria-hidden="true">
        {task.done
          ? <span className="done-badge"><CheckIcon small />Xong</span>
          : <ChevronIcon />
        }
      </div>
    </button>
  );
}

export function getScopeLabel(scope: ShiftTaskScope) {
  return scope === "master" ? "Ca chính" : "Ca của bạn";
}

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
