import type { NormalizedScheduleBlock } from "./types";

export type ShiftBlockProps = {
  block: NormalizedScheduleBlock;
  onClick?: () => void;
};

const statusClassNameMap: Record<string, string> = {
  available: "border-slate-200 bg-slate-50 text-slate-700",
  selected: "border-blue-200 bg-blue-50 text-blue-900",
  disabled: "border-slate-200 bg-slate-100 text-slate-400 opacity-70",
  assigned: "border-emerald-200 bg-emerald-50 text-emerald-900",
  unassigned: "border-amber-200 bg-amber-50 text-amber-900",
  conflict: "border-red-200 bg-red-50 text-red-900",
  upcoming: "border-blue-200 bg-blue-50 text-blue-900",
  "checked-in": "border-indigo-200 bg-indigo-50 text-indigo-900",
  checkedIn: "border-indigo-200 bg-indigo-50 text-indigo-900",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-900",
  missed: "border-red-200 bg-red-50 text-red-900",
  done: "border-emerald-200 bg-emerald-50 text-emerald-900",
  open: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

const badgeClassNameMap: Record<string, string> = {
  available: "bg-slate-100 text-slate-600",
  selected: "bg-blue-100 text-blue-700",
  disabled: "bg-slate-200 text-slate-500",
  assigned: "bg-emerald-100 text-emerald-700",
  unassigned: "bg-amber-100 text-amber-700",
  conflict: "bg-red-100 text-red-700",
  upcoming: "bg-blue-100 text-blue-700",
  "checked-in": "bg-indigo-100 text-indigo-700",
  checkedIn: "bg-indigo-100 text-indigo-700",
  completed: "bg-emerald-100 text-emerald-700",
  missed: "bg-red-100 text-red-700",
  done: "bg-emerald-100 text-emerald-700",
  open: "bg-emerald-100 text-emerald-700",
};

const statusLabelMap: Record<string, string> = {
  available: "Rảnh",
  selected: "Đã chọn",
  disabled: "Đóng",
  assigned: "Đã giao",
  unassigned: "Trống",
  conflict: "Trùng",
  upcoming: "Sắp tới",
  "checked-in": "Đã vào",
  checkedIn: "Đã vào",
  completed: "Xong",
  missed: "Lỡ",
  done: "Xong",
  open: "Mở",
};

function getStatusClassName(status?: string) {
  return (
    statusClassNameMap[status ?? ""] ??
    "border-slate-200 bg-slate-50 text-slate-700"
  );
}

function getBadgeClassName(status?: string) {
  return badgeClassNameMap[status ?? ""] ?? "bg-slate-100 text-slate-600";
}

function getStatusLabel(status: string) {
  return statusLabelMap[status] ?? status;
}

function ShiftBlockContent({ block }: ShiftBlockProps) {
  return (
    <div className="flex h-full min-w-0 items-start justify-between gap-1">
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-semibold leading-4">
          {block.title}
        </div>
        <div className="truncate text-[11px] leading-4 opacity-70">
          {block.description ?? block.subtitle}
        </div>
        <div className="truncate text-[10px] leading-3 opacity-60">
          {block.startTime} - {block.endTime}
        </div>
      </div>

      {block.status ? (
        <span
          className={`shrink-0 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-3 ${getBadgeClassName(
            block.status
          )}`}
        >
          {getStatusLabel(block.status)}
        </span>
      ) : null}
    </div>
  );
}

function BaseShiftBlock({ block, onClick }: ShiftBlockProps) {
  const className = `h-full w-full min-w-0 overflow-hidden rounded-xl border px-2 py-1 text-left shadow-sm transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${getStatusClassName(
    block.status
  )}`;

  if (onClick) {
    return (
      <button className={className} type="button" onClick={onClick}>
        <ShiftBlockContent block={block} />
      </button>
    );
  }

  return (
    <div className={className}>
      <ShiftBlockContent block={block} />
    </div>
  );
}

export function DefaultShiftBlock({ block, onClick }: ShiftBlockProps) {
  return <BaseShiftBlock block={block} onClick={onClick} />;
}

export function AvailabilityShiftBlock({ block, onClick }: ShiftBlockProps) {
  return <BaseShiftBlock block={block} onClick={onClick} />;
}

export function AssignmentShiftBlock({ block, onClick }: ShiftBlockProps) {
  return <BaseShiftBlock block={block} onClick={onClick} />;
}

export function WorkScheduleShiftBlock({ block, onClick }: ShiftBlockProps) {
  return <BaseShiftBlock block={block} onClick={onClick} />;
}
