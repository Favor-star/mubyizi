import { IconCalendar, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { PageHeader } from "../_components/page-header";

export default function AttendancePage() {
  return (
    <section className="space-y-3 w-full">
      <PageHeader
        title={
          <>
            Attendance tracking: <span className="font-black italic!">25th October 2025</span>
          </>
        }
        description="Organization-wide attendance overview for 25th October 2025, showing real-time check-ins, absences, and late arrivals across all sites.">
        <ButtonGroup>
          <Button size="icon-lg" variant="outline">
            <IconChevronLeft />
          </Button>
          <Button size="lg" variant="outline">
            <IconCalendar />
            25 Jul, 2025
          </Button>
          <Button size="icon-lg" variant="outline">
            <IconChevronRight />
          </Button>
        </ButtonGroup>
      </PageHeader>
    </section>
  );
}
