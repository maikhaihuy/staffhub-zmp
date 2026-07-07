import React from "react";
import type { ApprovalStatus, PayrollStatus } from "@/types/income";

// ─── StatusBadge ──────────────────────────────────────────────────────────────

type AnyStatus = ApprovalStatus | PayrollStatus;

const STATUS_CONFIG: Record<AnyStatus, { label: string; className: string }> = {
  approved: {
    label: "✓ Đã duyệt",
    className: "bg-[#00C853]/[.12] text-[#007A33]",
  },
  pending: {
    label: "⏳ Chờ duyệt",
    className: "bg-[#FFA000]/[.12] text-[#7A4A00]",
  },
  rejected: {
    label: "✕ Từ chối",
    className: "bg-[#FF3B30]/10 text-[#CC0000]",
  },
  paid: {
    label: "✓ Đã thanh toán",
    className: "bg-[#00C853]/[.12] text-[#007A33]",
  },
  processing: {
    label: "⏳ Đang xử lý",
    className: "bg-[#FFA000]/[.12] text-[#7A4A00]",
  },
};

interface StatusBadgeProps {
  status: AnyStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-[9px] py-[3px] text-[11px] font-semibold ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
};

// ─── SectionHeader ────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, className }) => (
  <p
    className={`mb-2 px-0.5 text-[11px] font-bold uppercase tracking-[0.6px] text-[#767A7F] ${
      className ?? ""
    }`}
  >
    {title}
  </p>
);

// ─── EarningsRow ─────────────────────────────────────────────────────────────

interface EarningsRowProps {
  color: string;
  label: string;
  value: string;
}

export const EarningsRow: React.FC<EarningsRowProps> = ({ color, label, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ background: color }}
      />
      <span className="text-[13px] text-[#767A7F]">{label}</span>
    </div>
    <span className="text-sm font-semibold text-[#141415]">{value}</span>
  </div>
);

// ─── EmptyState ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  emoji: string;
  title: string;
  subtitle?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ emoji, title, subtitle }) => (
  <div className="px-0 pb-2 pt-4 text-center">
    <span className="mb-1.5 block text-[30px]">{emoji}</span>
    <p className="mb-1 text-sm font-semibold text-[#00C853]">{title}</p>
    {subtitle && <p className="text-xs text-[#767A7F]">{subtitle}</p>}
  </div>
);
