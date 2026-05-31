import React from 'react'
import type { EvidencePhoto, ShiftTaskGroup } from '@/types/shift'
import { ScopedShiftTasks } from './ScopedShiftTasks'
import { EvidenceUpload } from './EvidenceUpload'

interface InShiftBodyProps {
  taskGroups: ShiftTaskGroup[]
  photos: EvidencePhoto[]
  onToggleTask: (id: string) => void
  onAddPhoto: (url: string) => void
  onRemovePhoto: (id: string) => void
  onOpenCamera: () => void
  canAddPhoto: boolean
}

export function InShiftBody({
  taskGroups,
  photos,
  onToggleTask,
  onAddPhoto,
  onRemovePhoto,
  onOpenCamera,
  canAddPhoto,
}: InShiftBodyProps) {
  return (
    <div className="body-content body-content--inshift">
      <ScopedShiftTasks groups={taskGroups} onToggleTask={onToggleTask} />
      <EvidenceUpload
        photos={photos}
        onAdd={onAddPhoto}
        onRemove={onRemovePhoto}
        onOpenCamera={onOpenCamera}
        canAdd={canAddPhoto}
      />
    </div>
  )
}
