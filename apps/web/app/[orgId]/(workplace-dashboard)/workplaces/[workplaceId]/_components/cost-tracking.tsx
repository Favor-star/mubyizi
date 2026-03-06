import React from "react";
import { IconChartPie, IconDots, IconHammer, IconPackage, IconUsers } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";

const categories = [
  {
    name: "Labor",
    amount: "$750k",
    percentage: 62,
    variance: "+5% vs est.",
    varianceType: "over" as const,
    icon: IconUsers,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    progressColor: "bg-blue-500"
  },
  {
    name: "Materials",
    amount: "$350k",
    percentage: 29,
    variance: "-2% vs est.",
    varianceType: "under" as const,
    icon: IconPackage,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
    progressColor: "bg-orange-500"
  },
  {
    name: "Equipment & Permits",
    amount: "$100k",
    percentage: 9,
    variance: "On track",
    varianceType: "neutral" as const,
    icon: IconHammer,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    progressColor: "bg-purple-500"
  }
];

export const CostTracking = () => {
  return (
    <section className="bg-sidebar border p-4 space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconChartPie strokeWidth={1.5} className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-bold">Cost Tracking</h2>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <IconDots strokeWidth={1.5} className="h-4 w-4" />
        </Button>
      </header>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Budget Spent</span>
          <span className="font-bold text-sm">$1.2M / $2.5M</span>
        </div>
        <Progress value={48} className="h-2" />
      </div>

      <div className="space-y-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`${cat.iconBg} rounded p-1.5 shrink-0`}>
                    <Icon strokeWidth={1.5} className={`h-4 w-4 ${cat.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-none truncate">{cat.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{cat.percentage}% of spent budget</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="font-bold text-sm">{cat.amount}</p>
                  <p
                    className={`text-xs ${
                      cat.varianceType === "over"
                        ? "text-destructive"
                        : cat.varianceType === "under"
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {cat.variance}
                  </p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.progressColor} rounded-full transition-all`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="outline" className="w-full" size="sm">
        Download Cost Report
      </Button>
    </section>
  );
};
