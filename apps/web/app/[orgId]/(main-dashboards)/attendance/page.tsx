import { IconCalendar, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";

export default function AttendancePage() {
  return (
    <section className="space-y-3 w-full ">
      <hgroup className="flex items-center justify-between bg-sidebar p-4 border-b border-border">
        <header>
          <h1 className="text-xl font-semibold tracking-tight">
            Attendance tracking: <span className="font-black italic!">25th October 2025</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Organization-wide attendance overview for 25th October 2025, showing real-time check-ins, absences, and late
            arrivals across all sites.
          </p>
        </header>
        <div className="flex gap-3 ">
          <ButtonGroup>
            <Button size={"icon-lg"} variant={"outline"}>
              <IconChevronLeft />
            </Button>
            <Button size={"lg"} variant={"outline"}>
              <IconCalendar />
              25 Jul, 2025
            </Button>
            <Button size={"icon-lg"} variant={"outline"}>
              <IconChevronRight />
            </Button>
          </ButtonGroup>
        </div>
      </hgroup>
    </section>
  );
}
