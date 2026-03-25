export type PayslipRow = {
  id: string;
  workerName: string;
  workerColor: string;
  site: string;
  baseWage: number;
  overtime: number;
  deductions: number;
  advance: number;
  netPay: number;
  status: "Paid" | "Pending" | "Unpaid";
};

export type AdvanceRow = {
  id: string;
  workerName: string;
  site: string;
  amount: number;
  requestedDate: string;
  approvedBy: string;
  deductedStatus: "Deducted" | "Pending";
  status: "Settled" | "Active";
};

export const MOCK_PAYSLIPS: PayslipRow[] = [
  { id: "1", workerName: "James Mwangi",  workerColor: "bg-blue-500",    site: "Site A",    baseWage: 1600, overtime: 240, deductions: 80,  advance: 0,   netPay: 1760, status: "Paid" },
  { id: "2", workerName: "Aisha Ochieng", workerColor: "bg-purple-500",  site: "Site B",    baseWage: 1800, overtime: 180, deductions: 60,  advance: 0,   netPay: 1920, status: "Paid" },
  { id: "3", workerName: "Peter Kamau",   workerColor: "bg-orange-500",  site: "Site C",    baseWage: 1200, overtime: 0,   deductions: 40,  advance: 200, netPay: 960,  status: "Pending" },
  { id: "4", workerName: "Grace Wanjiru", workerColor: "bg-emerald-500", site: "Site A, D", baseWage: 1500, overtime: 300, deductions: 50,  advance: 0,   netPay: 1750, status: "Paid" },
  { id: "5", workerName: "Samuel Otieno", workerColor: "bg-cyan-500",    site: "Site C",    baseWage: 1100, overtime: 0,   deductions: 30,  advance: 150, netPay: 920,  status: "Unpaid" },
];

export const MOCK_ADVANCES: AdvanceRow[] = [
  { id: "1", workerName: "Peter Kamau",   site: "Site C", amount: 200, requestedDate: "Mar 5, 2026",  approvedBy: "P. Kamau (SM)", deductedStatus: "Deducted", status: "Settled" },
  { id: "2", workerName: "Samuel Otieno", site: "Site C", amount: 150, requestedDate: "Mar 12, 2026", approvedBy: "P. Kamau (SM)", deductedStatus: "Pending",  status: "Active" },
];

export const PAYROLL_HISTORY = [
  { period: "Feb 2026 (Monthly)",   total: 118400, workers: 320, status: "Paid" },
  { period: "Jan 2026 (Monthly)",   total: 121000, workers: 318, status: "Paid" },
  { period: "Wk of Mar 3 (Weekly)", total: 32100,  workers: 85,  status: "Paid" },
];
