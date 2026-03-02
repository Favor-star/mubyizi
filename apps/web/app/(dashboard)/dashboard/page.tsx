import { KpiCard, type KpiCardProps } from "@/app/(dashboard)/dashboard/components/kpi-card";
import { RevenueChart } from "@/app/(dashboard)/dashboard/components/revenue-chart";
import { ExpenseDonut } from "@/app/(dashboard)/dashboard/components/expense-donut";
import { ApprovalsPanel } from "@/app/(dashboard)/dashboard/components/approvals-panel";
import { ActivityFeed } from "@/app/(dashboard)/dashboard/components/activity-feed";
import { PeriodToggle } from "@/app/(dashboard)/dashboard/components/period-toggle";

// KPI data — swap values with real API data as endpoints are wired
const KPI_CARDS: KpiCardProps[] = [
  {
    label: "Active Workplaces",
    value: "12",
    icon: "workplaces",
    trend: { value: "+20%", positive: true, label: "from last month" }
  },
  {
    label: "Total Workers",
    value: "1,240",
    icon: "workers",
    progress: { value: 85, label: "85% Deployed", secondaryLabel: "15% Bench" }
  },
  {
    label: "Monthly Payroll",
    value: "$4.2M",
    icon: "payroll",
    trend: { value: "+12%", positive: true, label: "vs projected" }
  },
  {
    label: "Budget Consumed",
    value: "71%",
    icon: "budget",
    subStats: { used: "$8.5M used", total: "$12M total" },
    progress: { value: 71, variant: "danger" }
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 ">
      {/* Overview header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <PeriodToggle />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {KPI_CARDS.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]   ">
        {/* Left: charts */}
        <div className="space-y-4 ">
          <RevenueChart />
          <ExpenseDonut />
        </div>

        {/* Right: approvals + activity */}
        <div className="space-y-4">
          <ApprovalsPanel />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
