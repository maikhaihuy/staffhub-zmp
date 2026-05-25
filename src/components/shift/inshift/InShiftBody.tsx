import React from 'react'
import type { MandatoryTaskState, TodoTask, EvidencePhoto } from '@/types/shift'
import { MandatoryTasks } from './MandatoryTasks'
import { EvidenceUpload } from './EvidenceUpload'
import { TodoList } from './TodoList'

interface InShiftBodyProps {
  mandatoryState: MandatoryTaskState
  todos: TodoTask[]
  photos: EvidencePhoto[]
  todoDoneCount: number
  onOpenInventory: () => void
  onOpenRevenue: () => void
  onToggleTodo: (id: number) => void
  onAddPhoto: (url: string) => void
  onRemovePhoto: (id: string) => void
  onOpenCamera: () => void
  canAddPhoto: boolean
}

export function InShiftBody({
  mandatoryState,
  todos,
  photos,
  todoDoneCount,
  onOpenInventory,
  onOpenRevenue,
  onToggleTodo,
  onAddPhoto,
  onRemovePhoto,
  onOpenCamera,
  canAddPhoto,
}: InShiftBodyProps) {
  return (
    <div className="body-content body-content--inshift">
      <MandatoryTasks
        state={mandatoryState}
        onOpenInventory={onOpenInventory}
        onOpenRevenue={onOpenRevenue}
      />
      <EvidenceUpload
        photos={photos}
        onAdd={onAddPhoto}
        onRemove={onRemovePhoto}
        onOpenCamera={onOpenCamera}
        canAdd={canAddPhoto}
      />
      <TodoList
        todos={todos}
        onToggle={onToggleTodo}
        doneCount={todoDoneCount}
      />
    </div>
  )
}
