"use client";

import { useParams } from "next/navigation";
import { IconAlertTriangle } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { MOCK_PENDING_ATTENDANCE } from "@/data/mock";

export function ApprovalsPanel() {
  const { orgId } = useParams<{ orgId: string }>();
  const attendanceData = MOCK_PENDING_ATTENDANCE[orgId];
  const items = attendanceData?.data.items ?? [];
  const total = attendanceData?.data.meta.total ?? 0;

  return (
    <div className="bg-card border border-border p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <IconAlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
        <h3 className="text-sm font-semibold flex-1">Urgent Approvals</h3>
        <span className="bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
          {total} Pending
        </span>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="border border-border p-3">
            <div className="mb-2.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium leading-none">
                  Worker …{item.userId.slice(-8)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {item.date} · Site …{item.workplaceId.slice(-8)}
                  {item.notes ? ` · ${item.notes}` : ""}
                </p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {item.hoursWorked != null ? `${item.hoursWorked}h` : "—"}
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 h-7 text-[11px]">
                Approve
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-7 text-[11px]">
                Review
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
