"use client";

import { useParams } from "next/navigation";
import { KpiCard, type KpiCardProps } from "./components/kpi-card";
import { SpendingChart } from "./components/spending-chart";
import { WorkplaceStatusChart } from "./components/workplace-status-chart";
import { ApprovalsPanel } from "./components/approvals-panel";
import { ActivityFeed } from "./components/activity-feed";
import { PeriodToggle } from "./components/period-toggle";
import { MOCK_ORG_STATS } from "@/data/mock";

export default function DashboardPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const stats = MOCK_ORG_STATS[orgId];

  const activeWorkplaces =
    stats?.workplacesByStatus["ACTIVE"] ?? stats?.totalWorkplaces ?? 0;

  const kpiCards: KpiCardProps[] = [
    {
      label: "Active Workplaces",
      value: String(activeWorkplaces),
      icon: "workplaces",
      trend: { value: "+20%", positive: true, label: "from last month" },
    },
    {
      label: "Total Members",
      value: String(stats?.totalMembers ?? 0),
      icon: "workers",
      progress: { value: 85, label: "85% Deployed", secondaryLabel: "15% Bench" },
    },
    {
      label: "Total Spent",
      value: `$${((stats?.totalSpent ?? 0) / 1000).toFixed(1)}k`,
      icon: "payroll",
      trend: { value: "+12%", positive: true, label: "vs projected" },
    },
    {
      label: "Pending Approvals",
      value: String(stats?.pendingAttendance ?? 0),
      icon: "budget",
      trend: {
        value: stats?.pendingAttendance ? "Needs review" : "All clear",
        positive: !stats?.pendingAttendance,
        label: "",
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <PeriodToggle />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpiCards.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
        {/* Left: charts */}
        <div className="space-y-4">
          <SpendingChart stats={stats} />
          <WorkplaceStatusChart stats={stats} />
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
