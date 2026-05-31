import type {
  MonthlyEarnings,
  PendingApproval,
  Payroll,
  ShiftEarning,
  DeliveryEarning,
} from "@/types/income";

export const mockMonthlyEarnings: MonthlyEarnings = {
  total: 3_500_000,
  periodStart: "01/05/2025",
  periodEnd: "26/05/2025",
  breakdown: {
    shiftPay: 2_400_000,
    approvedOT: 500_000,
    deliveryIncome: 300_000,
    bonus: 300_000,
  },
};

export const mockPendingApproval: PendingApproval = {
  pendingOTCount: 1,
  pendingDeliveryCount: 1,
};

export const mockLatestPaidPayroll: Payroll = {
  id: "payroll-apr-2025",
  period: "01/04 – 30/04/2025",
  payDate: "05/05/2025",
  totalAmount: 4_200_000,
  status: "paid",
  breakdown: {
    shiftPay: 2_800_000,
    overtime: 600_000,
    deliveryIncome: 500_000,
    bonus: 300_000,
  },
};

export const mockPayrollHistory: Payroll[] = [
  mockLatestPaidPayroll,
  {
    id: "payroll-mar-2025",
    period: "01/03 – 31/03/2025",
    payDate: "05/04/2025",
    totalAmount: 3_900_000,
    status: "paid",
    breakdown: {
      shiftPay: 2_600_000,
      overtime: 500_000,
      deliveryIncome: 500_000,
      bonus: 300_000,
    },
  },
  {
    id: "payroll-feb-2025",
    period: "01/02 – 28/02/2025",
    payDate: "05/03/2025",
    totalAmount: 3_750_000,
    status: "paid",
    breakdown: {
      shiftPay: 2_500_000,
      overtime: 400_000,
      deliveryIncome: 550_000,
      bonus: 300_000,
    },
  },
];

export const mockShiftEarnings: ShiftEarning[] = [
  {
    id: "shift-001",
    date: "Hôm nay",
    timeRange: "08:00 – 16:00",
    branch: "Chi nhánh Q.1",
    basePay: 320_000,
    overtime: 80_000,
    bonus: 50_000,
    bonusTag: { type: "kpi", label: "⭐ Bonus KPI" },
    status: "pending",
    weekGroup: "Tuần này",
  },
  {
    id: "shift-002",
    date: "Hôm qua",
    timeRange: "09:00 – 17:00",
    branch: "Chi nhánh Q.3",
    basePay: 320_000,
    overtime: 0,
    bonus: 0,
    status: "approved",
    weekGroup: "Tuần này",
  },
  {
    id: "shift-003",
    date: "24/05",
    timeRange: "08:00 – 16:00",
    branch: "Chi nhánh Q.1",
    basePay: 320_000,
    overtime: 40_000,
    bonus: 30_000,
    bonusTag: { type: "peak", label: "🔥 Giờ cao điểm" },
    status: "approved",
    weekGroup: "Tuần này",
  },
  {
    id: "shift-004",
    date: "22/05",
    timeRange: "13:00 – 21:00",
    branch: "Chi nhánh Q.7",
    basePay: 320_000,
    overtime: 80_000,
    bonus: 0,
    status: "approved",
    weekGroup: "Tuần trước",
  },
  {
    id: "shift-005",
    date: "20/05",
    timeRange: "08:00 – 16:00",
    branch: "Chi nhánh Q.1",
    basePay: 320_000,
    overtime: 0,
    bonus: 50_000,
    bonusTag: { type: "sales", label: "🎯 Doanh số" },
    status: "approved",
    weekGroup: "Tuần trước",
  },
];

export const mockDeliveryEarnings: DeliveryEarning[] = [
  {
    id: "del-001",
    datetime: "Hôm nay 14:30",
    orderCode: "#DL-20420",
    fee: 35_000,
    status: "pending",
  },
  {
    id: "del-002",
    datetime: "Hôm qua 11:00",
    orderCode: "#DL-20387",
    fee: 28_000,
    status: "approved",
  },
  {
    id: "del-003",
    datetime: "24/05 16:45",
    orderCode: "#DL-20310",
    fee: 42_000,
    status: "approved",
  },
  {
    id: "del-004",
    datetime: "23/05 09:20",
    orderCode: "#DL-20255",
    fee: 35_000,
    status: "approved",
  },
];
