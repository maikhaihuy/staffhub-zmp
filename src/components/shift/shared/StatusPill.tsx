import type { Shift, ShiftCheckStatus, ShiftPageState } from "@/types/shift";

type PillTone = "off" | "before" | "active";

interface StatusPillProps {
  pageState: ShiftPageState;
  currentShift: Shift | null;
  checkStatus: ShiftCheckStatus;
}

const PILL_TONE_CLASSES: Record<PillTone, string> = {
  off: "bg-white/[.04] text-stone-400",
  before: "bg-amber-400/[.08] text-amber-400",
  active: "bg-green-400/[.08] text-green-400",
};

const DOT_TONE_CLASSES: Record<PillTone, string> = {
  off: "bg-stone-400",
  before: "bg-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,.2)]",
  active:
    "bg-green-400 shadow-[0_0_0_3px_rgba(74,222,128,.15)] animate-[pulse-dot_2s_ease-in-out_infinite]",
};

const STATE_TONE: Record<ShiftPageState, PillTone> = {
  NO_SHIFT_TODAY: "off",
  UPCOMING_SHIFT: "before",
  ACTIVE_SHIFT: "active",
  COMPLETED_SHIFT: "off",
};

export function StatusPill({
  pageState,
  currentShift,
  checkStatus,
}: StatusPillProps) {
  const tone = currentShift ? STATE_TONE[pageState] : "off";
  const label = getStatusLabel(pageState, currentShift, checkStatus);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[20px] border border-white/10 px-2.5 py-1 text-[11.5px] font-medium ${PILL_TONE_CLASSES[tone]}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_TONE_CLASSES[tone]}`}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

function getStatusLabel(
  pageState: ShiftPageState,
  currentShift: Shift | null,
  checkStatus: ShiftCheckStatus,
) {
  if (pageState === "NO_SHIFT_TODAY" || !currentShift) {
    return "Hôm nay nghỉ ca";
  }

  if (pageState === "UPCOMING_SHIFT") {
    return `Ca hôm nay · ${currentShift.startTime}–${currentShift.endTime}`;
  }

  if (pageState === "ACTIVE_SHIFT") {
    return checkStatus.checkedInAt
      ? `Đã vào ca từ ${checkStatus.checkedInAt}`
      : "Đang trong ca";
  }

  return checkStatus.latestCheckoutAt
    ? `Xong ca · ra lúc ${checkStatus.latestCheckoutAt}`
    : "Ngoài ca";
}
