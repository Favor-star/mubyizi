import { cn } from "@workspace/ui/lib/utils";

type ActivityType = "info" | "warning" | "success";

// Recent activity events — wire to real API when ready
const ACTIVITIES: { id: number; text: string; meta: string; type: ActivityType }[] = [
  {
    id: 1,
    text: 'New worker "James Mutua" registered',
    meta: "By Admin • 10 mins ago",
    type: "info",
  },
  {
    id: 2,
    text: "Budget limit reached for Site C",
    meta: "System Alert • 1 hour ago",
    type: "warning",
  },
  {
    id: 3,
    text: "Monthly Payroll Report generated",
    meta: "Automatic • 3 hours ago",
    type: "success",
  },
  {
    id: 4,
    text: "12 workers clocked in at Site A",
    meta: "System • 4 hours ago",
    type: "info",
  },
  {
    id: 5,
    text: "Geofence breach detected at Site D",
    meta: "System Alert • 6 hours ago",
    type: "warning",
  },
];

const DOT_COLORS: Record<ActivityType, string> = {
  info: "bg-primary",
  warning: "bg-amber-500",
  success: "bg-emerald-500",
};

export function ActivityFeed() {
  return (
    <div className="bg-card border border-border p-5">
      <h3 className="mb-4 text-sm font-semibold">Recent Activity</h3>

      <ul className="space-y-0">
        {ACTIVITIES.map((item, idx) => (
          <li key={item.id} className="relative flex gap-3">
            {/* Vertical line connecting dots */}
            {idx < ACTIVITIES.length - 1 && (
              <span className="absolute left-1.25 top-3.5 h-full w-px bg-border" />
            )}

            {/* Dot */}
            <span
              className={cn(
                "relative mt-1.5 h-2.5 w-2.5 shrink-0",
                DOT_COLORS[item.type]
              )}
            />

            {/* Content */}
            <div className="min-w-0 pb-4">
              <p className="text-xs leading-snug">{item.text}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{item.meta}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
