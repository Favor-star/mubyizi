import type { WorkplaceWorker, WorkplaceWorkerStats, PaginatedWorkers } from "../types";

export const mockWorkerStats: WorkplaceWorkerStats = {
  totalAssigned: 24,
  activeNow: 18,
  laborCostToday: 420000,
};

export const mockWorkers: WorkplaceWorker[] = [
  {
    id: "01hv8x9k2n0000000000000001",
    workerId: "W-4021",
    name: "Michael Chen",
    role: "Site Foreman",
    tradeLevel: "Master",
    todayStatus: "on_site",
    checkInTime: "2026-03-05T07:05:00Z",
    dailyEarnings: 42000,
  },
  {
    id: "01hv8x9k2n0000000000000002",
    workerId: "W-3391",
    name: "Sarah Johnson",
    role: "Electrician",
    tradeLevel: "Journeyman",
    todayStatus: "on_site",
    checkInTime: "2026-03-05T08:12:00Z",
    dailyEarnings: 34000,
  },
  {
    id: "01hv8x9k2n0000000000000003",
    workerId: "W-5110",
    name: "David Smith",
    role: "Laborer",
    tradeLevel: "Apprentice",
    todayStatus: "on_break",
    checkInTime: "2026-03-05T07:50:00Z",
    dailyEarnings: 21000,
  },
  {
    id: "01hv8x9k2n0000000000000004",
    workerId: "W-2190",
    name: "Robert Wilson",
    role: "Plumber",
    tradeLevel: "Journeyman",
    todayStatus: "not_started",
    checkInTime: undefined,
    dailyEarnings: 0,
  },
];

export const mockPaginatedWorkers: PaginatedWorkers = {
  data: mockWorkers,
  total: 24,
  page: 1,
  pageSize: 10,
};
