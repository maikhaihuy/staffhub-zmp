// ─── Enums ────────────────────────────────────────────────────────────────────

export type ApprovalStatus = "pending" | "approved" | "rejected";
export type PayrollStatus = "paid" | "processing" | "pending";

// ─── Earnings Overview ────────────────────────────────────────────────────────

export interface EarningsBreakdown {
  shiftPay: number;
  approvedOT: number;
  deliveryIncome: number;
  bonus: number;
}

export interface MonthlyEarnings {
  total: number;
  breakdown: EarningsBreakdown;
  periodStart: string; // e.g. "01/05/2025"
  periodEnd: string;   // e.g. "26/05/2025"
}

export interface PendingApproval {
  pendingOTCount: number;
  pendingDeliveryCount: number;
}

// ─── Payroll ──────────────────────────────────────────────────────────────────

export interface PayrollBreakdown {
  shiftPay: number;
  overtime: number;
  deliveryIncome: number;
  bonus: number;
}

export interface Payroll {
  id: string;
  period: string;       // "01/04 – 30/04/2025"
  payDate: string;      // "05/05/2025"
  totalAmount: number;
  status: PayrollStatus;
  breakdown: PayrollBreakdown;
}

// ─── Shift Earnings ───────────────────────────────────────────────────────────

export type BonusTag =
  | { type: "kpi";   label: "⭐ Bonus KPI" }
  | { type: "peak";  label: "🔥 Giờ cao điểm" }
  | { type: "sales"; label: "🎯 Doanh số" };

export interface ShiftEarning {
  id: string;
  date: string;         // "Hôm nay", "25/05"
  timeRange: string;    // "08:00 – 16:00"
  branch: string;
  basePay: number;
  overtime: number;
  bonus: number;
  bonusTag?: BonusTag;
  status: ApprovalStatus;
  weekGroup: string;    // "Tuần này", "Tuần trước"
}

// ─── Delivery Earnings ────────────────────────────────────────────────────────

export interface DeliveryEarning {
  id: string;
  datetime: string;     // "Hôm nay 14:30"
  orderCode: string;    // "#DL-20420"
  fee: number;
  status: ApprovalStatus;
  receiptImageUrl?: string;
}
