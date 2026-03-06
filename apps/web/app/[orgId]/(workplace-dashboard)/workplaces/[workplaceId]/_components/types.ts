export type WorkplaceWorker = {
  id: string;
  workerId: string;
  name: string;
  avatarUrl?: string;
  role: string;
  tradeLevel: "Master" | "Journeyman" | "Apprentice";
  todayStatus: "on_site" | "on_break" | "not_started" | "checked_out";
  checkInTime?: string;
  dailyEarnings: number;
};

export type WorkplaceWorkerStats = {
  totalAssigned: number;
  activeNow: number;
  laborCostToday: number;
};

export type PaginatedWorkers = {
  data: WorkplaceWorker[];
  total: number;
  page: number;
  pageSize: number;
};

export type TransactionCategory = "labor" | "materials" | "equipment";
export type TransactionStatus = "approved" | "pending";

export type BudgetTransaction = {
  id: string;
  date: string;
  category: TransactionCategory;
  description: string;
  amount: number;
  status: TransactionStatus;
};

export type CostBreakdownItem = {
  label: string;
  spent: number;
  total: number;
  colorClass: string;
};

export type WorkplaceBudgetStats = {
  totalBudget: number;
  amountSpent: number;
  remaining: number;
  remainingPct: number;
};

export type PaginatedTransactions = {
  data: BudgetTransaction[];
  total: number;
  page: number;
  pageSize: number;
};

export type TradeCategory = "concrete" | "framing" | "electrical" | "plumbing";
export type MediaType = "photo" | "video" | "360";

export type GalleryMedia = {
  id: string;
  title: string;
  tradeCategory: TradeCategory;
  mediaType: MediaType;
  thumbnailUrl?: string;
  uploadedBy: string;
  uploadTime: string;
  commentCount: number;
};

export type GalleryPhaseGroup = {
  phase: string;
  date: string;
  dotColorClass: string;
  media: GalleryMedia[];
};
