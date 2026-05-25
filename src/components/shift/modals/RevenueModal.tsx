import { useState } from 'react'
import type { RevenueData } from '@/types/shift'

interface RevenueModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: RevenueData) => void
}

const MOCK_POS_TOTAL = 2840000
const MOCK_ORDERS = 142

export function RevenueModal({ open, onClose, onSubmit }: RevenueModalProps) {
  const [data, setData] = useState<RevenueData>({
    orders: MOCK_ORDERS,
    posTotal: MOCK_POS_TOTAL,
    cash: 840000,
    card: 2000000,
    discount: 0,
  })

  if (!open) return null

  const total = data.cash + data.card - data.discount
  const diff = total - MOCK_POS_TOTAL
  const balanced = Math.abs(diff) < 1000

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Shift Revenue">
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" aria-hidden="true" />
        <div className="modal-header">
          <h2 className="modal-title">Shift Revenue</h2>
          <p className="modal-sub">Submit end-of-shift sales totals</p>
        </div>
        <div className="modal-body">
          <div className="rev-summary-row">
            <div className="rev-summary-chip">
              <span className="rev-summary-chip__label">Orders</span>
              <span className="rev-summary-chip__value">{MOCK_ORDERS}</span>
            </div>
            <div className="rev-summary-chip">
              <span className="rev-summary-chip__label">POS Total</span>
              <span className="rev-summary-chip__value">{formatVnd(MOCK_POS_TOTAL)}</span>
            </div>
          </div>

          <MoneyField
            id="rev-cash"
            label="Cash collected"
            value={data.cash}
            onChange={v => setData(d => ({ ...d, cash: v }))}
          />
          <MoneyField
            id="rev-card"
            label="Card / Transfer"
            value={data.card}
            onChange={v => setData(d => ({ ...d, card: v }))}
          />
          <MoneyField
            id="rev-discount"
            label="Discounts / Vouchers"
            value={data.discount}
            onChange={v => setData(d => ({ ...d, discount: v }))}
          />

          <div className={`rev-balance-row ${balanced ? 'rev-balance-row--ok' : 'rev-balance-row--warn'}`} aria-live="polite">
            <span>Variance</span>
            <span className="rev-balance-val">
              {diff > 0 ? '+' : ''}{formatVnd(diff)}
              {balanced
                ? <span className="rev-balance-badge rev-balance-badge--ok">Balanced</span>
                : <span className="rev-balance-badge rev-balance-badge--warn">Check amounts</span>
              }
            </span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn--secondary" onClick={onClose}>Cancel</button>
          <button className="modal-btn modal-btn--primary" onClick={() => onSubmit(data)}>Submit</button>
        </div>
      </div>
    </div>
  )
}

function MoneyField({ id, label, value, onChange }: { id: string; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="money-field">
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="money-field__input-row">
        <span className="money-field__prefix" aria-hidden="true">₫</span>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          className="money-field__input"
          value={value || ''}
          onChange={e => onChange(parseInt(e.target.value) || 0)}
        />
      </div>
    </div>
  )
}

function formatVnd(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M₫`
  if (Math.abs(v) >= 1_000) return `${Math.round(v / 1000)}K₫`
  return `${v}₫`
}
