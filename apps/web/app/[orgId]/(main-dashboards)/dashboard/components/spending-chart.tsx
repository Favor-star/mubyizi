"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@workspace/ui/components/chart";
import type { OrgStatsData } from "@/data/mock";

const chartConfig: ChartConfig = {
  labor: {
    label: "Labor",
    color: "var(--chart-2)"
  },
  operations: {
    label: "Operations",
    color: "var(--chart-1)"
  }
};

export function SpendingChart({ stats }: { stats: OrgStatsData | undefined }) {
  const laborCost = stats?.laborCost ?? 0;
  const totalSpent = stats?.totalSpent ?? 0;
  const operationsCost = totalSpent - laborCost;

  const data = [
    { category: "Labor", labor: laborCost, operations: 120000 },
    { category: "Labor", labor: laborCost, operations: 245000 },
    { category: "Labor", labor: laborCost, operations: 123579 },
    { category: "Labor", labor: laborCost, operations: 420989 },
    { category: "Operations", labor: 92760, operations: operationsCost },
    { category: "Operations", labor: 128090, operations: operationsCost },
    { category: "Operations", labor: 0, operations: operationsCost }
  ];

  return (
    <div className="bg-card border border-border p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Spending Breakdown</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Labor vs. operational costs</p>
      </div>

      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="labor" fill="var(--color-labor)" radius={2} />
          <Bar dataKey="operations" fill="var(--color-operations)" radius={2} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
