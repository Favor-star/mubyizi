"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";

const PERIODS = ["This Month", "Last Month", "YTD"] as const;
type Period = (typeof PERIODS)[number];

export function PeriodToggle() {
  const [active, setActive] = useState<Period>("This Month");

  return (
    <div className="flex border border-border">
      {PERIODS.map((period) => (
        <button
          key={period}
          onClick={() => setActive(period)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium transition-colors",
            active === period
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {period}
        </button>
      ))}
    </div>
  );
}
