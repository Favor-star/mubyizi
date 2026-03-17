"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { WorkplacePageHeader } from "../_components/workplace-page-header";
import { AttendanceTab } from "../_components/attendance-tab";
import { IconCalendar, IconChevronDown, IconChevronLeft, IconChevronRight, IconDownload } from "@tabler/icons-react";

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatDisplayDate(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return toISODate(d);
}

// export const metadata: Metadata = {
//   title: "Attendance - Workplace Dashboard",
//   description: "Mark and review daily attendance for this site"
// };
export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = React.useState<string>(toISODate(new Date()));

  return (
    <section className="h-full">
      <WorkplacePageHeader title="Attendance - 23rd ">
        <section className="mt-8 mb-3 flex justify-between items-center">
          <hgroup>
            <h1 className="text-2xl font-bold mt-2">Site name — Attendance</h1>
            <p className="text-muted-foreground text-sm">Mark and review daily attendance for this site</p>
          </hgroup>

          <div className="flex gap-2">
            <ButtonGroup>
              <Button
                size="icon-lg"
                variant="outline"
                aria-label="Previous day"
                onClick={() => setSelectedDate((d) => addDays(d, -1))}>
                <IconChevronLeft />
              </Button>
              <Button size="lg" variant="outline" className="min-w-36 justify-center gap-2">
                <IconCalendar size={16} strokeWidth={1.5} />
                {formatDisplayDate(selectedDate)}
              </Button>
              <Button
                size="icon-lg"
                variant="outline"
                aria-label="Next day"
                onClick={() => setSelectedDate((d) => addDays(d, 1))}>
                <IconChevronRight />
              </Button>
            </ButtonGroup>

            <ButtonGroup>
              <Button size="lg">
                <IconDownload size={16} strokeWidth={1.5} />
                Export
              </Button>
              <Button size="icon-lg">
                <IconChevronDown size={16} />
              </Button>
            </ButtonGroup>
          </div>
        </section>
      </WorkplacePageHeader>

      <AttendanceTab date={selectedDate} />
    </section>
  );
}
