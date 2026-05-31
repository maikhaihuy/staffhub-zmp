import { useMemo, useState } from "react";
import { Page } from "zmp-ui";

import { BeforeBody } from "@/components/shift/before/BeforeBody";
import { BeforeHeroContent } from "@/components/shift/before/BeforeHeroContent";
import { InShiftBody } from "@/components/shift/inshift/InShiftBody";
import { InShiftHeroContent } from "@/components/shift/inshift/InShiftHeroContent";
import { WarnModal } from "@/components/shift/modals/WarnModal";
import { ToastProvider, showToast } from "@/components/shift/modals/Toast";
import { OffHeroContent } from "@/components/shift/offshift/OffHeroContent";
import { OffShiftBody } from "@/components/shift/offshift/OffShiftBody";
import { PrimaryActionButton } from "@/components/shift/shared/PrimaryActionButton";
import { ShiftPageShell } from "@/components/shift/shared/ShiftPageShell";
import { StatusPill } from "@/components/shift/shared/StatusPill";
import { useCheckStatus } from "@/hooks/useCheckStatus";
import { useEvidencePhotos } from "@/hooks/useEvidencePhotos";
import { useShiftState } from "@/hooks/useShiftState";
import { useShiftTasks } from "@/hooks/useShiftTasks";
import type { ShiftTask } from "@/types/shift";
import { isCheckInEnabled } from "@/utils/shiftUtils";

import { CURRENT_SHIFT, NEXT_SHIFT, TASK_EMPLOYEE } from "./mock-data";

type TaskModal = "missing-required" | "optional-warning" | null;

function TaskPage() {
  const { pageState } = useShiftState(CURRENT_SHIFT, NEXT_SHIFT);
  const { checkStatus, checkIn, checkOut } = useCheckStatus();
  const shiftTasks = useShiftTasks(TASK_EMPLOYEE.name);
  const evidence = useEvidencePhotos();
  const [modalOpen, setModalOpen] = useState<TaskModal>(null);

  const checkinEnabled = isCheckInEnabled(CURRENT_SHIFT);
  const totalDone = shiftTasks.doneCount;
  const totalTasks = shiftTasks.totalCount;

  const missingRequiredGroups = useMemo(
    () => groupTasksForModal(shiftTasks.missingMandatory),
    [shiftTasks.missingMandatory],
  );
  const optionalWarningGroups = useMemo(
    () => groupTasksForModal(shiftTasks.unfinishedOptional),
    [shiftTasks.unfinishedOptional],
  );

  function handleCheckIn() {
    checkIn();
    showToast("Đã vào ca. Chúc bạn làm việc tốt!");
  }

  function doCheckOut() {
    setModalOpen(null);
    checkOut();
    showToast("Đã kết ca.");
  }

  function handleCheckOutPress() {
    if (shiftTasks.missingMandatory.length > 0) {
      setModalOpen("missing-required");
      return;
    }

    if (shiftTasks.unfinishedOptional.length > 0) {
      setModalOpen("optional-warning");
      return;
    }

    doCheckOut();
  }

  const statusPill = (
    <StatusPill
      pageState={pageState}
      shiftLabel={`Ca hôm nay · ${CURRENT_SHIFT.startTime}–${CURRENT_SHIFT.endTime}`}
      checkedInAt={checkStatus.checkedInAt}
      checkedOutAt={checkStatus.lastCheckedOutAt}
    />
  );

  const heroContent = pageState === "BEFORE_SHIFT"
    ? <BeforeHeroContent shift={CURRENT_SHIFT} />
    : pageState === "IN_SHIFT"
      ? (
        <InShiftHeroContent
          shift={CURRENT_SHIFT}
          tasksDone={totalDone}
          tasksTotal={totalTasks}
          mandatoryDone={shiftTasks.mandatoryDoneCount}
          mandatoryTotal={shiftTasks.mandatoryTotalCount}
        />
      )
      : <OffHeroContent nextShift={NEXT_SHIFT} checkedOutAt={checkStatus.lastCheckedOutAt} />;

  const bodyContent = pageState === "BEFORE_SHIFT"
    ? <BeforeBody shift={CURRENT_SHIFT} />
    : pageState === "IN_SHIFT"
      ? (
        <InShiftBody
          taskGroups={shiftTasks.groups}
          photos={evidence.photos}
          onToggleTask={shiftTasks.toggleTask}
          onAddPhoto={evidence.add}
          onRemovePhoto={evidence.remove}
          onOpenCamera={evidence.openCamera}
          canAddPhoto={evidence.canAdd}
        />
      )
      : (
        <OffShiftBody
          nextShift={NEXT_SHIFT}
          shiftSummary={checkStatus.lastCheckedOutAt ? {
            checkedInAt: checkStatus.checkedInAt ?? "10:00",
            checkedOutAt: checkStatus.lastCheckedOutAt,
            tasksCompleted: totalDone,
            tasksTotal: totalTasks,
          } : undefined}
        />
      );

  const bottomAction = getBottomAction({
    pageState,
    checkStatus,
    checkinEnabled,
    onCheckIn: handleCheckIn,
    onCheckOut: handleCheckOutPress,
  });

  return (
    <Page className="h-full min-h-0 overflow-hidden bg-white dark:bg-black">
      <ShiftPageShell
        employee={TASK_EMPLOYEE}
        currentShift={CURRENT_SHIFT}
        nextShift={NEXT_SHIFT}
        pageState={pageState}
        statusPill={statusPill}
        heroContent={heroContent}
        bodyContent={bodyContent}
        bottomAction={bottomAction}
      />

      <WarnModal
        open={modalOpen === "missing-required"}
        onClose={() => setModalOpen(null)}
        title="Còn việc bắt buộc"
        message="Bạn cần hoàn thành việc bắt buộc của ca chính và ca của bạn trước khi kết ca."
        groups={missingRequiredGroups}
        cancelLabel="Quay lại"
      />
      <WarnModal
        open={modalOpen === "optional-warning"}
        onClose={() => setModalOpen(null)}
        onConfirm={doCheckOut}
        title="Còn việc chưa làm xong"
        message="Bạn vẫn có thể kết ca, các việc này sẽ còn đang mở."
        groups={optionalWarningGroups}
        cancelLabel="Quay lại"
        confirmLabel="Vẫn kết ca"
      />
      <ToastProvider />
    </Page>
  );
}

function getBottomAction({
  pageState,
  checkStatus,
  checkinEnabled,
  onCheckIn,
  onCheckOut,
}: {
  pageState: "BEFORE_SHIFT" | "IN_SHIFT" | "OFF_SHIFT";
  checkStatus: ReturnType<typeof useCheckStatus>["checkStatus"];
  checkinEnabled: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
}) {
  if (pageState === "BEFORE_SHIFT") {
    if (checkStatus.status === "checked_in") {
      return (
        <PrimaryActionButton
          variant="checked-out"
          label="Đã vào ca"
          sublabel={`Từ ${checkStatus.checkedInAt}`}
        />
      );
    }

    const enabled = checkinEnabled && checkStatus.status === "idle";
    return (
      <PrimaryActionButton
        variant={enabled ? "checkin" : "checkin-disabled"}
        label={enabled ? "Vào ca" : `Mở vào ca lúc ${getCheckinOpenTime(CURRENT_SHIFT.startTime)}`}
        sublabel={enabled ? undefined : "Trước giờ vào ca 15 phút"}
        onClick={onCheckIn}
      />
    );
  }

  if (pageState === "IN_SHIFT") {
    if (checkStatus.status === "checked_out") {
      return (
        <PrimaryActionButton
          variant="checked-out"
          label={`Đã kết ca lúc ${checkStatus.lastCheckedOutAt}`}
          sublabel="Xong ca rồi, hẹn gặp lại!"
        />
      );
    }

    return (
      <PrimaryActionButton
        variant="checkout"
        label="Kết ca"
        sublabel={checkStatus.checkedInAt ? `Đã vào ca từ ${checkStatus.checkedInAt}` : undefined}
        onClick={onCheckOut}
      />
    );
  }

  return (
    <PrimaryActionButton
      variant="view-shift"
      label={NEXT_SHIFT ? `Ca tiếp theo: ${NEXT_SHIFT.startTime}` : "Chưa có ca tiếp theo"}
      sublabel={NEXT_SHIFT ? NEXT_SHIFT.branch : undefined}
      disabled={!NEXT_SHIFT}
    />
  );
}

function groupTasksForModal(tasks: Pick<ShiftTask, "title" | "scope">[]) {
  return [
    {
      title: "Ca chính",
      items: tasks.filter((task) => task.scope === "master").map((task) => task.title),
    },
    {
      title: "Ca của bạn",
      items: tasks.filter((task) => task.scope === "sub").map((task) => task.title),
    },
  ];
}

function getCheckinOpenTime(startTime: string): string {
  const [h, m] = startTime.split(":").map(Number);
  const t = h * 60 + m - 15;
  return `${Math.floor(t / 60).toString().padStart(2, "0")}:${(t % 60).toString().padStart(2, "0")}`;
}

export default TaskPage;
