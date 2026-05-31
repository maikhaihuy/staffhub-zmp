import { useCallback, useMemo, useState } from 'react'
import type { ShiftTask, ShiftTaskGroup, ShiftTaskKind, ShiftTaskScope } from '@/types/shift'
import { formatTimestamp, ZaloBridge } from '@/utils/shiftUtils'

const INITIAL_TASKS: ShiftTask[] = [
  {
    id: 'master-inventory',
    title: 'Kiểm hàng tồn',
    helperText: 'Cập nhật tồn kho cho cả ca chính',
    scope: 'master',
    kind: 'mandatory',
    done: false,
  },
  {
    id: 'master-revenue',
    title: 'Chốt doanh thu ca',
    helperText: 'Một bạn trong ca chính chốt là đủ',
    scope: 'master',
    kind: 'mandatory',
    done: true,
    completedByName: 'Minh Trần',
    completedAt: '12:10',
  },
  {
    id: 'master-menu-board',
    title: 'Cập nhật bảng món',
    helperText: 'Kiểm tra món hết hàng và món nổi bật',
    scope: 'master',
    kind: 'optional',
    done: false,
  },
  {
    id: 'sub-handover',
    title: 'Dọn khu bàn giao',
    helperText: 'Để khu làm việc sẵn sàng cho nhóm sau',
    scope: 'sub',
    kind: 'mandatory',
    done: false,
  },
  {
    id: 'sub-counter',
    title: 'Lau quầy pha chế',
    helperText: 'Dọn nhanh khu vực ca của bạn',
    scope: 'sub',
    kind: 'optional',
    done: false,
  },
  {
    id: 'sub-cups',
    title: 'Châm ly và nắp mang đi',
    helperText: 'Bổ sung đủ cho khung giờ tiếp theo',
    scope: 'sub',
    kind: 'optional',
    done: true,
    completedByName: 'Linh Nguyễn',
    completedAt: '11:35',
  },
]

const GROUP_META: Record<ShiftTaskScope, Pick<ShiftTaskGroup, 'title' | 'subtitle'>> = {
  master: {
    title: 'Việc của ca chính',
    subtitle: 'Dùng chung với mọi người trong ca chính',
  },
  sub: {
    title: 'Việc của ca của bạn',
    subtitle: 'Dùng chung với các bạn trong ca của bạn',
  },
}

export function useShiftTasks(employeeName: string) {
  const [tasks, setTasks] = useState<ShiftTask[]>(INITIAL_TASKS)

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task

        const done = !task.done
        if (done) ZaloBridge.vibrate()

        return {
          ...task,
          done,
          completedByName: done ? employeeName : undefined,
          completedAt: done ? formatTimestamp() : undefined,
        }
      }),
    )
  }, [employeeName])

  const getTasks = useCallback((scope: ShiftTaskScope, kind?: ShiftTaskKind) => {
    return tasks.filter((task) => task.scope === scope && (!kind || task.kind === kind))
  }, [tasks])

  const groups = useMemo<ShiftTaskGroup[]>(() => (
    (['master', 'sub'] as ShiftTaskScope[]).map((scope) => ({
      scope,
      ...GROUP_META[scope],
      tasks: getTasks(scope),
    }))
  ), [getTasks])

  const mandatoryTasks = tasks.filter((task) => task.kind === 'mandatory')
  const optionalTasks = tasks.filter((task) => task.kind === 'optional')
  const missingMandatory = mandatoryTasks.filter((task) => !task.done)
  const unfinishedOptional = optionalTasks.filter((task) => !task.done)
  const doneCount = tasks.filter((task) => task.done).length
  const mandatoryDoneCount = mandatoryTasks.filter((task) => task.done).length

  return {
    tasks,
    groups,
    toggleTask,
    doneCount,
    totalCount: tasks.length,
    mandatoryDoneCount,
    mandatoryTotalCount: mandatoryTasks.length,
    missingMandatory,
    unfinishedOptional,
    getTasks,
  }
}
