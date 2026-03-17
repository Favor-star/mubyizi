import type { AttendanceRow, AttendanceDaySummary } from "../types";

export const mockAttendanceRows: AttendanceRow[] = [
  {
    userId: "01hv8x9k2n0000000000000001",
    workerId: "W-4021",
    name: "Michael Chen",
    role: "Site Foreman",
    dailyRate: 42000,
    attendanceId: "att-001",
    date: "2026-03-11",
    status: "PRESENT",
    shiftLabel: "Full Day",
    notes: "Arrived early, briefed team",
    checkIn: "2026-03-11T07:05:00Z",
    checkOut: "2026-03-11T17:10:00Z",
    hoursWorked: 10.08,
    amountEarned: 42000,
    approvalStatus: "APPROVED"
  },
  {
    userId: "01hv8x9k2n0000000000000002",
    workerId: "W-3391",
    name: "Sarah Johnson",
    role: "Electrician",
    dailyRate: 34000,
    attendanceId: "att-002",
    date: "2026-03-11",
    status: "PRESENT",
    shiftLabel: "Morning",
    notes: "",
    checkIn: "2026-03-11T08:12:00Z",
    checkOut: "2026-03-11T13:00:00Z",
    hoursWorked: 4.8,
    amountEarned: 17000,
    approvalStatus: "PENDING"
  },
  {
    userId: "01hv8x9k2n0000000000000003",
    workerId: "W-5110",
    name: "David Smith",
    role: "Laborer",
    dailyRate: 21000,
    attendanceId: "att-003",
    date: "2026-03-11",
    status: "LATE",
    shiftLabel: "Full Day",
    notes: "Traffic delay reported",
    checkIn: "2026-03-11T09:45:00Z",
    checkOut: undefined,
    hoursWorked: undefined,
    amountEarned: undefined,
    approvalStatus: "PENDING"
  },
  {
    userId: "01hv8x9k2n0000000000000004",
    workerId: "W-2190",
    name: "Robert Wilson",
    role: "Plumber",
    dailyRate: 32000,
    attendanceId: "att-004",
    date: "2026-03-11",
    status: "ABSENT",
    shiftLabel: undefined,
    notes: "Called in sick — see separate sick note",
    approvalStatus: "REJECTED",
    rejectionReason: "No prior notice given"
  },
  {
    userId: "01hv8x9k2n0000000000000005",
    workerId: "W-6043",
    name: "Emily Torres",
    role: "Electrician",
    dailyRate: 34000,
    date: "2026-03-11",
    status: "NOT_MARKED"
  },
  {
    userId: "01hv8x9k2n0000000000000006",
    workerId: "W-7812",
    name: "James Okafor",
    role: "Carpenter",
    dailyRate: 28000,
    attendanceId: "att-006",
    date: "2026-03-11",
    status: "ON_LEAVE",
    shiftLabel: undefined,
    notes: "Approved annual leave",
    approvalStatus: "APPROVED"
  },
  {
    userId: "01hv8x9k2n0000000000000007",
    workerId: "W-1105",
    name: "Maria Santos",
    role: "Laborer",
    dailyRate: 21000,
    date: "2026-03-11",
    status: "NOT_MARKED"
  },
  {
    userId: "01hv8x9k2n0000000000000008",
    workerId: "W-9234",
    name: "Kevin Patel",
    role: "Mason",
    dailyRate: 29000,
    attendanceId: "att-008",
    date: "2026-03-11",
    status: "HALF_DAY",
    shiftLabel: "Afternoon",
    notes: "Doctor appointment in the morning",
    checkIn: "2026-03-11T13:00:00Z",
    checkOut: "2026-03-11T17:00:00Z",
    hoursWorked: 4,
    amountEarned: 14500,
    approvalStatus: "PENDING"
  },
  {
    userId: "01hv8x9k2n0000000000000009",
    workerId: "W-3308",
    name: "Aisha Nwosu",
    role: "Site Engineer",
    dailyRate: 48000,
    attendanceId: "att-009",
    date: "2026-03-11",
    status: "PRESENT",
    shiftLabel: "Full Day",
    notes: "",
    checkIn: "2026-03-11T07:30:00Z",
    checkOut: "2026-03-11T17:30:00Z",
    hoursWorked: 10,
    amountEarned: 48000,
    approvalStatus: "APPROVED"
  },
  {
    userId: "01hv8x9k2n0000000000000010",
    workerId: "W-4417",
    name: "Thomas Brennan",
    role: "Supervisor",
    dailyRate: 38000,
    attendanceId: "att-010",
    date: "2026-03-11",
    status: "SICK",
    shiftLabel: undefined,
    notes: "Submitted medical certificate",
    approvalStatus: "PENDING"
  }
];

export function computeAttendanceSummary(rows: AttendanceRow[], date: string): AttendanceDaySummary {
  const totalWorkers = rows.length;
  const present = rows.filter((r) => r.status === "PRESENT").length;
  const absent = rows.filter((r) => r.status === "ABSENT").length;
  const halfDay = rows.filter((r) => r.status === "HALF_DAY").length;
  const late = rows.filter((r) => r.status === "LATE").length;
  const onLeave = rows.filter((r) => r.status === "ON_LEAVE").length;
  const sick = rows.filter((r) => r.status === "SICK").length;
  const notMarked = rows.filter((r) => r.status === "NOT_MARKED").length;
  const marked = totalWorkers - notMarked;
  const estimatedLaborCost = rows.reduce((acc, r) => acc + (r.amountEarned ?? 0), 0);

  return { date, totalWorkers, marked, notMarked, present, absent, halfDay, late, onLeave, sick, estimatedLaborCost };
}
