import { useState, useCallback } from 'react'
import type { EvidencePhoto } from '@/types/shift'
import { ZaloBridge } from '@/utils/shiftUtils'

const MAX_PHOTOS = 6

interface UseEvidencePhotosResult {
  photos: EvidencePhoto[]
  add: (url: string) => void
  remove: (id: string) => void
  openCamera: () => void
  canAdd: boolean
}

export function useEvidencePhotos(): UseEvidencePhotosResult {
  const [photos, setPhotos] = useState<EvidencePhoto[]>([])

  const add = useCallback((url: string) => {
    setPhotos(prev => {
      if (prev.length >= MAX_PHOTOS) return prev
      return [
        ...prev,
        { id: `photo_${Date.now()}_${Math.random()}`, url, addedAt: new Date().toISOString() },
      ]
    })
  }, [])

  const remove = useCallback((id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }, [])

  const openCamera = useCallback(() => {
    ZaloBridge.chooseImage((urls) => {
      urls.forEach(u => add(u))
    })
  }, [add])

  return { photos, add, remove, openCamera, canAdd: photos.length < MAX_PHOTOS }
}
