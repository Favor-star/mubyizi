"use client";

import { useParams } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import { MOCK_ORG_ACTIVITY, type ActivityItem } from "@/data/mock";

function relativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

function getDotColor(item: ActivityItem): string {
  return item.type === "REMOVED" ? "bg-amber-500" : "bg-primary";
}

export function ActivityFeed() {
  const { orgId } = useParams<{ orgId: string }>();
  const activityData = MOCK_ORG_ACTIVITY[orgId];
  const items = activityData?.data.items ?? [];

  return (
    <div className="bg-card border border-border p-5">
      <h3 className="mb-4 text-sm font-semibold">Recent Activity</h3>

      <ul className="space-y-0">
        {items.map((item, idx) => (
          <li key={`${item.userId}-${item.timestamp}`} className="relative flex gap-3">
            {/* Vertical connecting line */}
            {idx < items.length - 1 && (
              <span className="absolute left-1.25 top-3.5 h-full w-px bg-border" />
            )}

            {/* Dot */}
            <span
              className={cn(
                "relative mt-1.5 h-2.5 w-2.5 shrink-0",
                getDotColor(item)
              )}
            />

            {/* Content */}
            <div className="min-w-0 pb-4">
              <p className="text-xs leading-snug">
                {item.type === "JOINED"
                  ? `${item.userName} joined as ${item.role}`
                  : `${item.userName} was removed (was ${item.role})`}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {relativeTime(item.timestamp)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
