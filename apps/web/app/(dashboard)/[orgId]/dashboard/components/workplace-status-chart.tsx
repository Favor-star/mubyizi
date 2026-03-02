"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart";
import type { OrgStatsData } from "@/data/mock";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function buildChartConfig(statuses: string[]): ChartConfig {
  return Object.fromEntries(
    statuses.map((status, i) => [
      status,
      { label: status, color: CHART_COLORS[i % CHART_COLORS.length] },
    ])
  );
}

export function WorkplaceStatusChart({ stats }: { stats: OrgStatsData | undefined }) {
  const workplacesByStatus = stats?.workplacesByStatus ?? {};
  const entries = Object.entries(workplacesByStatus);
  const chartData = entries.map(([name, value]) => ({ name, value }));
  const chartConfig = buildChartConfig(entries.map(([name]) => name));

  return (
    <div className="bg-card border border-border p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Workplaces by Status</h3>
      </div>

      <div className="flex items-center gap-6">
        <ChartContainer config={chartConfig} className="h-[160px] w-[160px] shrink-0">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={44}
              outerRadius={70}
              strokeWidth={0}
            >
              {chartData.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>

        <ul className="space-y-2">
          {entries.map(([status, count], i) => (
            <li key={status} className="flex items-center gap-2 text-xs">
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="text-muted-foreground capitalize">{status.toLowerCase()}</span>
              <span className="ml-auto font-semibold tabular-nums">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
