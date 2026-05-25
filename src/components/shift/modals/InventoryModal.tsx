import { useState } from 'react'
import type { InventoryData } from '@/types/shift'

interface InventoryModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: InventoryData) => void
}

const FIELDS: { key: keyof Omit<InventoryData, 'notes'>; label: string; unit: string }[] = [
  { key: 'blackTea', label: 'Black tea', unit: 'L' },
  { key: 'greenTea', label: 'Green tea', unit: 'L' },
  { key: 'tapioca', label: 'Tapioca', unit: 'kg' },
  { key: 'milk', label: 'Milk', unit: 'L' },
  { key: 'coconutJelly', label: 'Coconut jelly', unit: 'kg' },
  { key: 'sugarSyrup', label: 'Sugar syrup', unit: 'L' },
]

export function InventoryModal({ open, onClose, onSubmit }: InventoryModalProps) {
  const [data, setData] = useState<InventoryData>({
    blackTea: 0, greenTea: 0, tapioca: 0, milk: 0, coconutJelly: 0, sugarSyrup: 0, notes: '',
  })

  if (!open) return null

  function handleSubmit() {
    onSubmit(data)
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Inventory Check">
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" aria-hidden="true" />
        <div className="modal-header">
          <h2 className="modal-title">Inventory Check</h2>
          <p className="modal-sub">Enter current stock levels</p>
        </div>
        <div className="modal-body">
          <div className="inv-grid">
            {FIELDS.map(f => (
              <div key={f.key} className="inv-field">
                <label htmlFor={`inv-${f.key}`} className="inv-field__label">
                  {f.label} <span className="inv-field__unit">({f.unit})</span>
                </label>
                <input
                  id={`inv-${f.key}`}
                  type="number"
                  min={0}
                  className="inv-field__input"
                  value={data[f.key] || ''}
                  onChange={e => setData(d => ({ ...d, [f.key]: parseFloat(e.target.value) || 0 }))}
                  inputMode="decimal"
                />
              </div>
            ))}
          </div>
          <label htmlFor="inv-notes" className="field-label">Notes (optional)</label>
          <textarea
            id="inv-notes"
            className="field-textarea"
            placeholder="e.g. Black tea running low…"
            value={data.notes}
            onChange={e => setData(d => ({ ...d, notes: e.target.value }))}
            rows={3}
          />
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn--secondary" onClick={onClose}>Cancel</button>
          <button className="modal-btn modal-btn--primary" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  )
}
