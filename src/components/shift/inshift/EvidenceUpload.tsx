import React, { useRef } from 'react'
import type { EvidencePhoto } from '@/types/shift'

interface EvidenceUploadProps {
  photos: EvidencePhoto[]
  onAdd: (url: string) => void
  onRemove: (id: string) => void
  onOpenCamera: () => void
  canAdd: boolean
}

const PLACEHOLDER_COLORS = ['#d1fae5', '#dbeafe', '#fef3c7', '#fce7f3', '#ede9fe', '#fee2e2']

export function EvidenceUpload({ photos, onAdd, onRemove, onOpenCamera, canAdd }: EvidenceUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    files.forEach(f => {
      const url = URL.createObjectURL(f)
      onAdd(url)
    })
    if (fileRef.current) fileRef.current.value = ''
  }

  // Simulate a photo added (web fallback when Zalo API not available)
  function handleGalleryClick() {
    if (fileRef.current) {
      fileRef.current.click()
    }
  }

  return (
    <section aria-label="Ảnh ca của tôi">
      <div className="mb-[7px] flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.08em] text-stone-500">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <span className="flex flex-1 flex-col gap-px leading-[1.15]">
          <span>Ảnh ca của tôi</span>
          <span className="text-[10px] font-medium normal-case tracking-normal text-stone-400">
            Tải ảnh cho ca làm của riêng bạn
          </span>
        </span>
        {photos.length > 0 && (
          <span className="rounded-[10px] bg-stone-200 px-2 py-0.5 text-[11px] font-semibold text-stone-500">
            {photos.length}/6
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="p-3.5">
          {photos.length === 0 && (
            <div className="mb-2.5 flex flex-col items-center gap-1.5 rounded-[10px] border-[1.5px] border-dashed border-stone-300 p-5 text-center text-stone-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span className="text-[13px] font-medium text-stone-500">Chưa có ảnh</span>
              <span className="text-[11px] text-stone-400">Quầy sạch · khu làm việc · ghi chú ca</span>
            </div>
          )}

          {photos.length > 0 && (
            <div className="mb-2.5 flex flex-wrap gap-2" role="list" aria-label="Uploaded evidence photos">
              {photos.map((photo, i) => (
                <div
                  key={photo.id}
                  className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[9px]"
                  role="listitem"
                  style={{ background: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length] }}
                >
                  {photo.url.startsWith('blob:') || photo.url.startsWith('http') ? (
                    <img
                      src={photo.url}
                      alt={`Evidence photo ${i + 1}`}
                      className="block h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                  )}
                  <button
                    className="absolute right-1 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black/55 text-white transition-transform active:scale-90"
                    onClick={() => onRemove(photo.id)}
                    aria-label={`Remove photo ${i + 1}`}
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileChange}
              aria-hidden="true"
            />
            <button
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-stone-200 text-[13px] font-medium text-stone-900 transition-colors active:enabled:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-[.45]"
              onClick={handleGalleryClick}
              disabled={!canAdd}
              aria-label="Chọn ảnh từ thư viện"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Thư viện
            </button>
            <button
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-amber-700 bg-amber-700 text-[13px] font-medium text-white shadow-[0_2px_10px_rgba(180,83,9,.25)] transition-colors active:enabled:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-[.45]"
              onClick={onOpenCamera}
              disabled={!canAdd}
              aria-label="Chụp ảnh bằng camera"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              Chụp ảnh
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
