import React from "react";
import type { ApprovalStatus, PayrollStatus } from "@/types/income";

// ─── StatusBadge ──────────────────────────────────────────────────────────────

type AnyStatus = ApprovalStatus | PayrollStatus;

const STATUS_CONFIG: Record<AnyStatus, { label: string; className: string }> = {
  approved: { label: "✓ Đã duyệt",        className: "badge badge--approved" },
  pending:  { label: "⏳ Chờ duyệt",       className: "badge badge--pending" },
  rejected: { label: "✕ Từ chối",          className: "badge badge--rejected" },
  paid:     { label: "✓ Đã thanh toán",    className: "badge badge--approved" },
  processing:{ label: "⏳ Đang xử lý",     className: "badge badge--pending" },
};

interface StatusBadgeProps {
  status: AnyStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return <span className={cfg.className}>{cfg.label}</span>;
};

// ─── SectionHeader ────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, className }) => (
  <p className={`section-header ${className ?? ""}`}>{title}</p>
);

// ─── EarningsRow ─────────────────────────────────────────────────────────────

interface EarningsRowProps {
  color: string;
  label: string;
  value: string;
}

export const EarningsRow: React.FC<EarningsRowProps> = ({ color, label, value }) => (
  <div className="earnings-row">
    <div className="earnings-row__left">
      <span className="earnings-row__dot" style={{ background: color }} />
      <span className="earnings-row__label">{label}</span>
    </div>
    <span className="earnings-row__value">{value}</span>
  </div>
);

// ─── EmptyState ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  emoji: string;
  title: string;
  subtitle?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ emoji, title, subtitle }) => (
  <div className="empty-state">
    <span className="empty-state__emoji">{emoji}</span>
    <p className="empty-state__title">{title}</p>
    {subtitle && <p className="empty-state__subtitle">{subtitle}</p>}
  </div>
);
