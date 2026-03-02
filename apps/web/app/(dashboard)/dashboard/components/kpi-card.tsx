import {
  IconBuildingCommunity,
  IconUsers,
  IconCoin,
  IconChartPie,
  IconTrendingUp,
  IconTrendingDown
} from "@tabler/icons-react";
import { cn } from "@workspace/ui/lib/utils";

const ICONS = {
  workplaces: IconBuildingCommunity,
  workers: IconUsers,
  payroll: IconCoin,
  budget: IconChartPie
} as const;

export type KpiCardProps = {
  label: string;
  value: string;
  icon: keyof typeof ICONS;
  trend?: {
    value: string;
    positive: boolean;
    label: string;
  };
  progress?: {
    value: number; // 0–100
    label?: string;
    secondaryLabel?: string;
    variant?: "default" | "danger";
  };
  subStats?: {
    used: string;
    total: string;
  };
};

export function KpiCard({ label, value, icon, trend, progress, subStats }: Readonly<KpiCardProps>) {
  const Icon = ICONS[icon];

  return (
    <div className="bg-card border border-border p-5">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground truncate">{label}</p>
          <p className="mt-1 text-[28px] font-semibold leading-none tracking-tight">{value}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* Progress bar */}
      {progress && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden bg-muted">
            <div
              className={cn(
                "h-full transition-all duration-500",
                progress.variant === "danger" ? "bg-linear-to-r from-amber-500 to-destructive" : "bg-primary"
              )}
              style={{ width: `${progress.value}%` }}
            />
          </div>
          {(progress.label || progress.secondaryLabel) && (
            <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
              {progress.label && <span>{progress.label}</span>}
              {progress.secondaryLabel && <span>{progress.secondaryLabel}</span>}
            </div>
          )}
        </div>
      )}

      {/* Sub stats (budget used/total) */}
      {subStats && (
        <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
          <span>{subStats.used}</span>
          <span>{subStats.total}</span>
        </div>
      )}

      {/* Trend indicator */}
      {trend && (
        <div
          className={cn(
            "mt-3 flex items-center gap-1 text-[11px] font-medium",
            trend.positive ? "text-emerald-500" : "text-destructive"
          )}>
          {trend.positive ? <IconTrendingUp className="h-3.5 w-3.5" /> : <IconTrendingDown className="h-3.5 w-3.5" />}
          <span>{trend.value}</span>
          <span className="font-normal text-muted-foreground">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
