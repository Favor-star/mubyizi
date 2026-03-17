"use client";

import { useParams } from "next/navigation";
import {
  IconBuildingCommunity,
  IconUsers,
  IconCoin,
  IconChartPie
} from "@tabler/icons-react";
import { StatCard } from "@/shared/components/stat-card";
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

  return (
    <div className="space-y-6 px-4">
      {/* Overview header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <PeriodToggle />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Active Workplaces"
          value={String(activeWorkplaces)}
          icon={IconBuildingCommunity}
          color="var(--primary)"
        />
        <StatCard
          title="Total Members"
          value={String(stats?.totalMembers ?? 0)}
          icon={IconUsers}
          color="var(--chart-2)"
        />
        <StatCard
          title="Total Spent"
          value={`$${((stats?.totalSpent ?? 0) / 1000).toFixed(1)}k`}
          icon={IconCoin}
          color="var(--chart-3)"
        />
        <StatCard
          title="Pending Approvals"
          value={String(stats?.pendingAttendance ?? 0)}
          icon={IconChartPie}
          color="var(--destructive)"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
        {/* Left: charts */}
        <div className="space-y-4">
          <SpendingChart stats={stats} />
          <div className="flex gap-4">
            <WorkplaceStatusChart stats={stats} />
            <section className="flex-1 bg-card rounded-lg p-4 border border-border">

            </section>
          </div>
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
