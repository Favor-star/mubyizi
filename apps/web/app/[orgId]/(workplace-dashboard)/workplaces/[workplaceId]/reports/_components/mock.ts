export type AttendanceRow = {
  name: string;
  present: number;
  absent: number;
  rate: number;
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

export const ATTENDANCE_ROWS: AttendanceRow[] = [
  { name: "James Mwangi", present: 16, absent: 1, rate: 94 },
  { name: "Grace Wanjiru", present: 17, absent: 0, rate: 100 },
  { name: "Brian Njoroge", present: 12, absent: 5, rate: 71 }
];

export const PERFORMANCE_ROWS: PerformanceRow[] = [
  { name: "Grace Wanjiru", avatarColor: "bg-emerald-500", attendance: "100%", otHours: "12h",  flags: 0, score: 98, tier: "Top" },
  { name: "James Mwangi",  avatarColor: "bg-blue-500",    attendance: "94%",  otHours: "8h",   flags: 1, score: 91, tier: "Good" },
  { name: "Aisha Ochieng", avatarColor: "bg-purple-500",  attendance: "91%",  otHours: "3.5h", flags: 0, score: 88, tier: "Good" },
  { name: "Peter Kamau",   avatarColor: "bg-orange-500",  attendance: "78%",  otHours: "0h",   flags: 1, score: 68, tier: "Avg" },
  { name: "Brian Njoroge", avatarColor: "bg-red-500",     attendance: "71%",  otHours: "0h",   flags: 3, score: 44, tier: "Risk" }
];
