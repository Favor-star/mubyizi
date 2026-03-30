"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { mockCalendarWeeks, type CalendarDay } from "./_mock/attendance";

const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function dayCell(cell: CalendarDay, di: number) {
  // Filler (blank padding)
  if (cell.day === 0) return <div key={di} />;

  // Weekend / holiday
  if (cell.isWeekend) {
    return (
      <div
        key={di}
        className="rounded-md border border-border bg-muted/40 p-1.5 text-center min-h-[46px] flex flex-col items-center justify-center">
        <p className="text-xs font-medium text-muted-foreground">{cell.day}</p>
        <p className="text-[10px] text-muted-foreground leading-tight">Weekend</p>
      </div>
    );
  }

  // Future (no data yet)
  if (cell.isFuture) {
    return (
      <div
        key={di}
        className="rounded-md border border-border p-1.5 text-center min-h-[46px] flex flex-col items-center justify-center">
        <p className="text-xs font-medium text-muted-foreground">{cell.day}</p>
        <p className="text-[10px] text-muted-foreground">—</p>
      </div>
    );
  }

  // Past / today with attendance data
  const pct = cell.attendancePct ?? 0;
  const colorClass =
    pct >= 90
      ? "bg-success/10 border-success/40 text-success"
      : pct >= 75
        ? "bg-warning/10 border-warning/40 text-warning"
        : "bg-destructive/10 border-destructive/40 text-destructive";

  return (
    <div
      key={di}
      className={`rounded-md border p-1.5 text-center min-h-[46px] flex flex-col items-center justify-center transition-colors ${colorClass} ${
        cell.isToday ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""
      }`}>
      <p className="text-xs font-semibold">{cell.day}</p>
      <p className="text-[10px] font-medium">{pct}%</p>
    </div>
  );
}

export function MonthlyCalendarView() {
  return (
    <div className="bg-sidebar border rounded-lg p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Monthly Calendar View</h3>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm" disabled>
            <IconChevronLeft size={14} />
          </Button>
          <span className="text-xs font-medium px-2 text-muted-foreground">March 2026</span>
          <Button variant="outline" size="icon-sm" disabled>
            <IconChevronRight size={14} />
          </Button>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-0.5">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 space-y-1">
        {mockCalendarWeeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((cell, di) => dayCell(cell, di))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 flex-wrap border-t border-border pt-3">
        {[
          { label: "90%+", bg: "bg-success/20 border-success/40" },
          { label: "75–90%", bg: "bg-warning/20 border-warning/40" },
          { label: "Below 75%", bg: "bg-destructive/20 border-destructive/40" },
          { label: "Weekend / Holiday", bg: "bg-muted border-border" }
        ].map(({ label, bg }) => (
          <span key={label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className={`h-2.5 w-2.5 rounded-sm border ${bg}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
