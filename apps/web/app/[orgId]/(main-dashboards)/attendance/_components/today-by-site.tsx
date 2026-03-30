import { Badge } from "@workspace/ui/components/badge";
import { mockSiteSummary } from "./_mock/attendance";

function rateBadgeClass(pct: number): string {
  if (pct >= 90) return "bg-success/15 text-success border-0 font-semibold";
  if (pct >= 75) return "bg-warning/15 text-warning border-0 font-semibold";
  return "bg-destructive/15 text-destructive border-0 font-semibold";
}

export function TodayBySite() {
  return (
    <div className="bg-sidebar border rounded-lg p-4 flex flex-col h-full">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold">Today by Site</h3>
        <p className="text-xs text-muted-foreground">Tuesday, March 17, 2026</p>
      </div>

      {/* Column labels */}
      <div className="grid grid-cols-[1fr_44px_44px_52px] gap-x-2 pb-2 border-b border-border">
        {["Site", "Present", "Absent", "Rate"].map((h) => (
          <span key={h} className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground text-center first:text-left">
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 divide-y divide-border/60">
        {mockSiteSummary.map((site) => (
          <div
            key={site.id}
            className="grid grid-cols-[1fr_44px_44px_52px] gap-x-2 items-center py-2.5 text-sm">
            <span className="font-medium truncate text-sm">{site.name}</span>
            <span className="text-success font-semibold tabular-nums text-center">{site.present}</span>
            <span className="text-destructive font-semibold tabular-nums text-center">{site.absent}</span>
            <div className="flex justify-center">
              <Badge className={rateBadgeClass(site.ratePct)}>{site.ratePct}%</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <button className="mt-3 pt-3 border-t border-border text-xs text-primary hover:underline text-center w-full">
        View all 12 sites →
      </button>
    </div>
  );
}
