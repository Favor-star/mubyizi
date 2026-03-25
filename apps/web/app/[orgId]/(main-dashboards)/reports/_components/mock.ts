export type SiteAttendanceRow = {
  site: string;
  totalDays: number;
  present: number;
  absent: number;
  rate: number; // 0-100
};

export type SiteComparisonRow = {
  site: string;
  att: string;
  payroll: string;
  workers: number;
  score: "Excellent" | "Good" | "Average" | "Critical";
};

export type PerformanceRow = {
  name: string;
  avatarColor: string;
  attendance: string;
  otHours: string;
  flags: number;
  score: number;
  tier: "Top" | "Good" | "Avg" | "Risk";
};

export const SITE_ATTENDANCE_ROWS: SiteAttendanceRow[] = [
  { site: "Site A — Nairobi CBD",   totalDays: 17, present: 628, absent: 86,  rate: 93 },
  { site: "Site B — Westlands",     totalDays: 17, present: 412, absent: 64,  rate: 87 },
  { site: "Site C — Mombasa Port",  totalDays: 17, present: 701, absent: 234, rate: 75 },
  { site: "Site D — Kisumu Plant",  totalDays: 17, present: 0,   absent: 561, rate: 0  },
  { site: "Site E — Nakuru Farm",   totalDays: 17, present: 986, absent: 34,  rate: 97 }
];

export const SITE_COMPARISON_ROWS: SiteComparisonRow[] = [
  { site: "Site E — Nakuru Farm",  att: "97%", payroll: "$38k", workers: 60, score: "Excellent" },
  { site: "Site A — Nairobi CBD",  att: "93%", payroll: "$26k", workers: 42, score: "Excellent" },
  { site: "Site B — Westlands",    att: "87%", payroll: "$18k", workers: 28, score: "Good"      },
  { site: "Site C — Mombasa Port", att: "75%", payroll: "$34k", workers: 55, score: "Average"   },
  { site: "Site D — Kisumu Plant", att: "0%",  payroll: "$0",   workers: 33, score: "Critical"  }
];

export const PERFORMANCE_ROWS: PerformanceRow[] = [
  { name: "Grace Wanjiru", avatarColor: "bg-emerald-500", attendance: "99%", otHours: "12 hrs", flags: 0, score: 98, tier: "Top"  },
  { name: "James Mwangi",  avatarColor: "bg-blue-500",    attendance: "96%", otHours: "8 hrs",  flags: 1, score: 91, tier: "Good" },
  { name: "Aisha Ochieng", avatarColor: "bg-purple-500",  attendance: "91%", otHours: "6 hrs",  flags: 0, score: 88, tier: "Good" },
  { name: "Brian Njoroge", avatarColor: "bg-red-500",     attendance: "71%", otHours: "0 hrs",  flags: 3, score: 48, tier: "Risk" }
];
