// ─── Types ────────────────────────────────────────────────────────────────────

export type CheckInMethod = "QR_SCAN" | "MOBILE_APP" | "MANUAL" | "GPS" | "BIOMETRIC";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "ON_LEAVE";

export interface AttendanceLogRow {
  id: string;
  worker: string;
  site: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  hours: number;
  method: CheckInMethod;
  status: AttendanceStatus;
}

export interface SiteSummaryRow {
  id: string;
  name: string;
  present: number;
  absent: number;
  ratePct: number;
}

export interface CalendarDay {
  day: number; // 0 = filler cell
  isWeekend: boolean;
  isToday: boolean;
  isFuture: boolean;
  attendancePct?: number;
}

// ─── KPI stats ────────────────────────────────────────────────────────────────

export const mockAttendanceStats = {
  avgAttendanceRate: 94.2,
  presentToday: 301,
  absentToday: 19,
  onLeaveToday: 14
};

// ─── Calendar (March 2026, today = Tue Mar 17) ────────────────────────────────

export const mockCalendarWeeks: CalendarDay[][] = [
  // Week 1: fillers + Sat Mar 1 + Sun Mar 2
  [
    { day: 0, isWeekend: false, isToday: false, isFuture: false },
    { day: 0, isWeekend: false, isToday: false, isFuture: false },
    { day: 0, isWeekend: false, isToday: false, isFuture: false },
    { day: 0, isWeekend: false, isToday: false, isFuture: false },
    { day: 0, isWeekend: false, isToday: false, isFuture: false },
    { day: 1, isWeekend: true, isToday: false, isFuture: false },
    { day: 2, isWeekend: true, isToday: false, isFuture: false }
  ],
  // Week 2: Mar 3-9
  [
    { day: 3, isWeekend: false, isToday: false, isFuture: false, attendancePct: 96 },
    { day: 4, isWeekend: false, isToday: false, isFuture: false, attendancePct: 94 },
    { day: 5, isWeekend: false, isToday: false, isFuture: false, attendancePct: 98 },
    { day: 6, isWeekend: false, isToday: false, isFuture: false, attendancePct: 82 },
    { day: 7, isWeekend: false, isToday: false, isFuture: false, attendancePct: 95 },
    { day: 8, isWeekend: true, isToday: false, isFuture: false },
    { day: 9, isWeekend: true, isToday: false, isFuture: false }
  ],
  // Week 3: Mar 10-16
  [
    { day: 10, isWeekend: false, isToday: false, isFuture: false, attendancePct: 97 },
    { day: 11, isWeekend: false, isToday: false, isFuture: false, attendancePct: 93 },
    { day: 12, isWeekend: false, isToday: false, isFuture: false, attendancePct: 74 },
    { day: 13, isWeekend: false, isToday: false, isFuture: false, attendancePct: 96 },
    { day: 14, isWeekend: false, isToday: false, isFuture: false, attendancePct: 91 },
    { day: 15, isWeekend: true, isToday: false, isFuture: false },
    { day: 16, isWeekend: true, isToday: false, isFuture: false }
  ],
  // Week 4: Mar 17 (today) - 23
  [
    { day: 17, isWeekend: false, isToday: true, isFuture: false, attendancePct: 94 },
    { day: 18, isWeekend: false, isToday: false, isFuture: true },
    { day: 19, isWeekend: false, isToday: false, isFuture: true },
    { day: 20, isWeekend: false, isToday: false, isFuture: true },
    { day: 21, isWeekend: false, isToday: false, isFuture: true },
    { day: 22, isWeekend: true, isToday: false, isFuture: true },
    { day: 23, isWeekend: true, isToday: false, isFuture: true }
  ],
  // Week 5: Mar 24-30
  [
    { day: 24, isWeekend: false, isToday: false, isFuture: true },
    { day: 25, isWeekend: false, isToday: false, isFuture: true },
    { day: 26, isWeekend: false, isToday: false, isFuture: true },
    { day: 27, isWeekend: false, isToday: false, isFuture: true },
    { day: 28, isWeekend: false, isToday: false, isFuture: true },
    { day: 29, isWeekend: true, isToday: false, isFuture: true },
    { day: 30, isWeekend: true, isToday: false, isFuture: true }
  ],
  // Week 6: Mar 31
  [
    { day: 31, isWeekend: false, isToday: false, isFuture: true },
    { day: 0, isWeekend: false, isToday: false, isFuture: false },
    { day: 0, isWeekend: false, isToday: false, isFuture: false },
    { day: 0, isWeekend: false, isToday: false, isFuture: false },
    { day: 0, isWeekend: false, isToday: false, isFuture: false },
    { day: 0, isWeekend: false, isToday: false, isFuture: false },
    { day: 0, isWeekend: false, isToday: false, isFuture: false }
  ]
];

// ─── Today by Site ────────────────────────────────────────────────────────────

export const mockSiteSummary: SiteSummaryRow[] = [
  { id: "site-a", name: "Site A — Nairobi CBD", present: 38, absent: 4, ratePct: 90 },
  { id: "site-b", name: "Site B — Westlands", present: 25, absent: 3, ratePct: 89 },
  { id: "site-c", name: "Site C — Mombasa Port", present: 41, absent: 14, ratePct: 75 },
  { id: "site-d", name: "Site D — Kisumu Plant", present: 0, absent: 33, ratePct: 0 },
  { id: "site-e", name: "Site E — Nakuru Farm", present: 58, absent: 2, ratePct: 97 }
];

// ─── Attendance Log ───────────────────────────────────────────────────────────

export const mockAttendanceLog: AttendanceLogRow[] = [
  {
    id: "1",
    worker: "James Mwangi",
    site: "Site A",
    date: "Mar 17",
    checkIn: "07:52 AM",
    checkOut: "05:01 PM",
    hours: 9.1,
    method: "QR_SCAN",
    status: "PRESENT"
  },
  {
    id: "2",
    worker: "Aisha Ochieng",
    site: "Site B",
    date: "Mar 17",
    checkIn: "08:05 AM",
    checkOut: "05:10 PM",
    hours: 9.0,
    method: "MOBILE_APP",
    status: "PRESENT"
  },
  {
    id: "3",
    worker: "Peter Kamau",
    site: "Site C",
    date: "Mar 17",
    checkIn: null,
    checkOut: null,
    hours: 0,
    method: "MANUAL",
    status: "ON_LEAVE"
  },
  {
    id: "4",
    worker: "Grace Wanjiru",
    site: "Site A",
    date: "Mar 17",
    checkIn: "07:44 AM",
    checkOut: "04:50 PM",
    hours: 9.1,
    method: "GPS",
    status: "PRESENT"
  },
  {
    id: "5",
    worker: "Samuel Otieno",
    site: "Site C",
    date: "Mar 17",
    checkIn: null,
    checkOut: null,
    hours: 0,
    method: "BIOMETRIC",
    status: "ABSENT"
  }
];

export const mockAttendancePagination = {
  total: 320,
  page: 1,
  pageSize: 5,
  totalPages: 64,
  hasNextPage: true,
  hasPrevPage: false
};
