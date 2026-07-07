import { useEffect, useMemo, useState, type ReactNode } from "react";
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
import { useShiftTasks } from "@/hooks/useShiftTasks";
import type {
  Shift,
  ShiftCheckStatus,
  ShiftPageState,
  ShiftTask,
  ShiftTimeStatus,
} from "@/types/shift";
import {
  deriveShiftState,
  deriveShiftTimeStatus,
  getCheckinOpenTime,
  getEmployeeShiftWindow,
  isCheckInEnabled,
  isCheckOutAllowed,
  validateShiftContext,
} from "@/utils/shiftUtils";

import { CURRENT_SHIFT, NEXT_SHIFT, TASK_EMPLOYEE } from "./mock-data";

type TaskModal = "missing-required" | "optional-warning" | null;

type TaskPageViewModel =
  | {
      state: "NO_SHIFT_TODAY";
      currentShift: null;
      nextShift: Shift | null;
    }
  | {
      state: "UPCOMING_SHIFT";
      currentShift: Shift;
      nextShift: Shift | null;
    }
  | {
      state: "ACTIVE_SHIFT";
      currentShift: Shift;
      nextShift: Shift | null;
    }
  | {
      state: "COMPLETED_SHIFT";
      currentShift: Shift;
      nextShift: Shift | null;
    };

function TaskPage() {
  const { checkStatus, checkIn, checkOut } = useCheckStatus();
  const shiftTasks = useShiftTasks(TASK_EMPLOYEE.name);
  const evidence = useEvidencePhotos();
  const [modalOpen, setModalOpen] = useState<TaskModal>(null);
  const [serverNowIso, setServerNowIso] = useState(() =>
    new Date().toISOString(),
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setServerNowIso(new Date().toISOString());
    }, 60_000);

    return () => window.clearInterval(id);
  }, []);

  const shiftContext = useMemo(
    () =>
      validateShiftContext({
        currentShift: CURRENT_SHIFT,
        nextShift: NEXT_SHIFT,
        serverNow: serverNowIso,
      }),
    [serverNowIso],
  );
  const { currentShift, nextShift, serverNow } = shiftContext;
  const pageState = deriveShiftState(currentShift, checkStatus);
  const view = createTaskPageViewModel({
    pageState,
    currentShift,
    nextShift,
  });
  const timeStatus = deriveShiftTimeStatus(currentShift, checkStatus, serverNow);
  const checkinEnabled = currentShift
    ? isCheckInEnabled(currentShift, serverNow)
    : false;
  const checkoutAllowed = currentShift
    ? isCheckOutAllowed(currentShift, checkStatus, serverNow)
    : false;

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

  const { statusPill, heroContent, bodyContent } = getTaskPageSections({
    view,
    checkStatus,
    shiftTasks,
    evidence,
  });

  const bottomAction = getBottomAction({
    view,
    checkStatus,
    timeStatus,
    checkinEnabled,
    checkoutAllowed,
    onCheckIn: handleCheckIn,
    onCheckOut: handleCheckOutPress,
  });

  return (
    <Page className="h-full min-h-0 overflow-hidden">
      <ShiftPageShell
        employee={TASK_EMPLOYEE}
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

function createTaskPageViewModel({
  pageState,
  currentShift,
  nextShift,
}: {
  pageState: ShiftPageState;
  currentShift: Shift | null;
  nextShift: Shift | null;
}): TaskPageViewModel {
  if (!currentShift || pageState === "NO_SHIFT_TODAY") {
    return {
      state: "NO_SHIFT_TODAY",
      currentShift: null,
      nextShift,
    };
  }

  switch (pageState) {
    case "UPCOMING_SHIFT":
      return {
        state: "UPCOMING_SHIFT",
        currentShift,
        nextShift,
      };
    case "ACTIVE_SHIFT":
      return {
        state: "ACTIVE_SHIFT",
        currentShift,
        nextShift,
      };
    case "COMPLETED_SHIFT":
      return {
        state: "COMPLETED_SHIFT",
        currentShift,
        nextShift,
      };
  }
}

interface TaskPageSectionsArgs {
  view: TaskPageViewModel;
  checkStatus: ShiftCheckStatus;
  shiftTasks: ReturnType<typeof useShiftTasks>;
  evidence: ReturnType<typeof useEvidencePhotos>;
}

interface TaskPageSections {
  statusPill: ReactNode;
  heroContent: ReactNode;
  bodyContent: ReactNode;
}

function getTaskPageSections({
  view,
  checkStatus,
  shiftTasks,
  evidence,
}: TaskPageSectionsArgs): TaskPageSections {
  const totalDone = shiftTasks.doneCount;
  const totalTasks = shiftTasks.totalCount;
  const statusPill = (
    <StatusPill
      pageState={view.state}
      currentShift={view.currentShift}
      checkStatus={checkStatus}
    />
  );

  switch (view.state) {
    case "NO_SHIFT_TODAY":
      return {
        statusPill,
        heroContent: (
          <OffHeroContent
            nextShift={view.nextShift}
            checkedOutAt={checkStatus.latestCheckoutAt}
          />
        ),
        bodyContent: <OffShiftBody nextShift={view.nextShift} />,
      };

    case "UPCOMING_SHIFT":
      return {
        statusPill,
        heroContent: <BeforeHeroContent shift={view.currentShift} />,
        bodyContent: <BeforeBody shift={view.currentShift} />,
      };

    case "ACTIVE_SHIFT":
    case "COMPLETED_SHIFT":
      return {
        statusPill,
        heroContent: (
          <InShiftHeroContent
            shift={view.currentShift}
            tasksDone={totalDone}
            tasksTotal={totalTasks}
            mandatoryDone={shiftTasks.mandatoryDoneCount}
            mandatoryTotal={shiftTasks.mandatoryTotalCount}
          />
        ),
        bodyContent: (
          <InShiftBody
            taskGroups={shiftTasks.groups}
            photos={evidence.photos}
            onToggleTask={shiftTasks.toggleTask}
            onAddPhoto={evidence.add}
            onRemovePhoto={evidence.remove}
            onOpenCamera={evidence.openCamera}
            canAddPhoto={evidence.canAdd}
          />
        ),
      };
  }
}

function getBottomAction({
  view,
  checkStatus,
  timeStatus,
  checkinEnabled,
  checkoutAllowed,
  onCheckIn,
  onCheckOut,
}: {
  view: TaskPageViewModel;
  checkStatus: ShiftCheckStatus;
  timeStatus: ShiftTimeStatus | null;
  checkinEnabled: boolean;
  checkoutAllowed: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
}) {
  switch (view.state) {
    case "NO_SHIFT_TODAY":
      return (
        <PrimaryActionButton
          variant="view-shift"
          label={
            view.nextShift
              ? `Ca tiếp theo: ${view.nextShift.startTime}`
              : "Chưa có ca tiếp theo"
          }
          sublabel={view.nextShift?.branch}
          disabled
        />
      );

    case "UPCOMING_SHIFT":
      return (
        <PrimaryActionButton
          variant={checkinEnabled ? "checkin" : "checkin-disabled"}
          label={
            checkinEnabled
              ? "Vào ca"
              : `Mở vào ca lúc ${getCheckinOpenTime(
                  getEmployeeShiftWindow(view.currentShift).startTime,
                )}`
          }
          sublabel={
            checkinEnabled
              ? getTimeStatusHelper(timeStatus)
              : "Trước giờ vào ca 15 phút"
          }
          disabled={!checkinEnabled}
          onClick={checkinEnabled ? onCheckIn : undefined}
        />
      );

    case "ACTIVE_SHIFT":
      if (!checkoutAllowed) {
        return (
          <PrimaryActionButton
            variant="checkin-disabled"
            label="Yêu cầu sửa giờ kết ca"
            sublabel="Đã quá giờ kết ca, tính năng này sẽ có sau"
            disabled
          />
        );
      }

      return (
        <PrimaryActionButton
          variant="checkout"
          label="Kết ca"
          sublabel={
            checkStatus.checkedInAt
              ? `Đã vào ca từ ${checkStatus.checkedInAt}`
              : undefined
          }
          onClick={onCheckOut}
        />
      );

    case "COMPLETED_SHIFT":
      return (
        <PrimaryActionButton
          variant="checkout"
          label="Kết ca lần nữa"
          sublabel={
            checkStatus.latestCheckoutAt
              ? `Lần gần nhất lúc ${checkStatus.latestCheckoutAt}`
              : undefined
          }
          onClick={onCheckOut}
        />
      );
  }
}

function getTimeStatusHelper(timeStatus: ShiftTimeStatus | null) {
  if (timeStatus === "LATE_NOT_CHECKED_IN") return "Bạn đang trễ ca";
  if (timeStatus === "CHECKIN_AVAILABLE") return "Có thể vào ca ngay";
  return undefined;
}

function groupTasksForModal(tasks: Pick<ShiftTask, "title" | "scope">[]) {
  return [
    {
      title: "Ca chính",
      items: tasks
        .filter((task) => task.scope === "master")
        .map((task) => task.title),
    },
    {
      title: "Ca của bạn",
      items: tasks
        .filter((task) => task.scope === "sub")
        .map((task) => task.title),
    },
  ];
}

export default TaskPage;
