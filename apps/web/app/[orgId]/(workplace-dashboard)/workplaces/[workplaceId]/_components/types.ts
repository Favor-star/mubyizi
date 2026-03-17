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

// ─── Attendance ───────────────────────────────────────────────────────────────

export type AttendanceStatus =
  | "NOT_MARKED"
  | "PRESENT"
  | "ABSENT"
  | "HALF_DAY"
  | "LATE"
  | "ON_LEAVE"
  | "SICK";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

/** One row in the daily attendance sheet (one worker, one date). */
export type AttendanceRow = {
  userId: string;
  workerId: string;
  name: string;
  avatarUrl?: string;
  role: string;
  dailyRate: number; // in cents

  // Record fields (undefined when not yet saved for the day)
  attendanceId?: string;
  date: string; // ISO date string

  status: AttendanceStatus;
  shiftLabel?: string;
  notes?: string;

  checkIn?: string;
  checkOut?: string;
  hoursWorked?: number;
  amountEarned?: number; // in cents

  approvalStatus?: ApprovalStatus;
  rejectionReason?: string;
};

/** Fields the manager can edit inline on the sheet before saving. */
export type AttendanceEdit = {
  status?: AttendanceStatus;
  shiftLabel?: string;
  notes?: string;
};

export type AttendanceDaySummary = {
  date: string;
  totalWorkers: number;
  marked: number;
  notMarked: number;
  present: number;
  absent: number;
  halfDay: number;
  late: number;
  onLeave: number;
  sick: number;
  estimatedLaborCost: number; // in cents
};

// ─── Gallery ──────────────────────────────────────────────────────────────────

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
