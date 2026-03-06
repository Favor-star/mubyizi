import type { BudgetTransaction, CostBreakdownItem, PaginatedTransactions, WorkplaceBudgetStats } from "../types";

export const mockBudgetStats: WorkplaceBudgetStats = {
  totalBudget: 250_000_000,
  amountSpent: 115_000_000,
  remaining: 135_000_000,
  remainingPct: 54,
};

export const mockCostBreakdown: CostBreakdownItem[] = [
  { label: "Labor", spent: 65_000_000, total: 100_000_000, colorClass: "bg-primary" },
  { label: "Materials", spent: 35_000_000, total: 100_000_000, colorClass: "bg-chart-2" },
  { label: "Equipment", spent: 15_000_000, total: 50_000_000, colorClass: "bg-warning" },
];

const transactions: BudgetTransaction[] = [
  {
    id: "txn-1",
    date: "2023-10-24",
    category: "labor",
    description: "Weekly Payroll – Week 42",
    amount: 4_250_000,
    status: "approved",
  },
  {
    id: "txn-2",
    date: "2023-10-23",
    category: "materials",
    description: "Concrete Delivery – BuildMax Inc",
    amount: 1_520_000,
    status: "pending",
  },
  {
    id: "txn-3",
    date: "2023-10-21",
    category: "equipment",
    description: "Crane Rental – HeavyLift Pros",
    amount: 845_000,
    status: "approved",
  },
  {
    id: "txn-4",
    date: "2023-10-18",
    category: "labor",
    description: "Subcontractor Payment – ElectricCo",
    amount: 2_200_000,
    status: "approved",
  },
  {
    id: "txn-5",
    date: "2023-10-15",
    category: "materials",
    description: "Steel Beams – IronWorks Supply",
    amount: 5_630_000,
    status: "approved",
  },
];

export const mockPaginatedTransactions: PaginatedTransactions = {
  data: transactions,
  total: 142,
  page: 1,
  pageSize: 10,
};
