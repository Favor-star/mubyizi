import { IconAlertTriangle } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";

// Pending approvals — wire to real API when ready
const APPROVALS = [
  {
    id: 1,
    title: "Attendance Override Request",
    subtitle: "Worker #W-234 • Site Alpha",
    time: "2h ago",
    primaryAction: "Approve",
    secondaryAction: "Review"
  },
  {
    id: 2,
    title: "Expense Report — Equipment",
    subtitle: "Amount: $3,200 • Site Beta",
    time: "5h ago",
    primaryAction: "Approve",
    secondaryAction: "Details"
  }
] as const;

export function ApprovalsPanel() {
  return (
    <div className="bg-card border border-border p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <IconAlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
        <h3 className="text-sm font-semibold flex-1">Urgent Approvals</h3>
        <span className="bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
          {APPROVALS.length} Pending
        </span>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {APPROVALS.map((item) => (
          <div key={item.id} className="border border-border p-3">
            <div className="mb-2.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium leading-none">{item.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{item.subtitle}</p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground">{item.time}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 h-7 text-[11px]">
                {item.primaryAction}
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-7 text-[11px]">
                {item.secondaryAction}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
