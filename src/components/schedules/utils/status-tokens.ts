// utils/status-tokens.ts
// Status styling constants and helpers

import type { ShiftStatus, StatusTokens } from "../weekly-shift-grid.types";

export const STATUS_TOKENS: Record<string, StatusTokens> = {
  assigned: { bg: "#dbeafe", border: "#93c5fd", text: "#1e40af", dot: "#93c5fd" },
  pending: { bg: "#fef3c7", border: "#fcd34d", text: "#92400e", dot: "#fcd34d" },
  completed: { bg: "#d1fae5", border: "#6ee7b7", text: "#065f46", dot: "#6ee7b7" },
  cancelled: { bg: "#fee2e2", border: "#fca5a5", text: "#991b1b", dot: "#fca5a5" },
  available: { bg: "#f8fafc", border: "#cbd5e1", text: "#64748b", dot: "#cbd5e1" },
  registered: { bg: "#ede9fe", border: "#c4b5fd", text: "#5b21b6", dot: "#c4b5fd" },
  conflict: { bg: "#ffe4e6", border: "#fda4af", text: "#9f1239", dot: "#fda4af" },
};

export const DEFAULT_TOKENS: StatusTokens = {
  bg: "#f1f5f9",
  border: "#cbd5e1",
  text: "#475569",
  dot: "#94a3b8",
};

export function getTokens(status?: ShiftStatus): StatusTokens {
  return (status && STATUS_TOKENS[status]) ?? DEFAULT_TOKENS;
}

export const STATUS_LABEL: Record<string, string> = {
  assigned: "Đã phân ca",
  pending: "Chờ duyệt",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  available: "Trống",
  registered: "Đã đăng ký",
  conflict: "Xung đột",
};
