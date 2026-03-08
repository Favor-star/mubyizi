import { Button } from "@workspace/ui/components/button";
import { BudgetTab } from "../_components/budget-tab";
import { WorkplacePageHeader } from "../_components/workplace-page-header";
import { IconCalendar, IconChevronDown, IconChevronLeft, IconChevronRight, IconDownload } from "@tabler/icons-react";
import { ButtonGroup } from "@workspace/ui/components/button-group";

export default function AttendancePage() {
  return (
    <section className="h-full">
      <WorkplacePageHeader title="Attendance">
        <section className="mt-8 mb-3 flex justify-between items-center ">
          <hgroup>
            <h1 className="text-2xl font-bold mt-2">Site name - Attendance</h1>
            <p className="text-muted-foreground text-sm">Check attendance data for the site</p>
          </hgroup>
          <div className="flex gap-2">
            <ButtonGroup>
              <ButtonGroup>
                <Button size={"icon-lg"} variant={"outline"}>
                  <IconChevronLeft />
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button size={"lg"} variant={"outline"}>
                  <IconCalendar />
                  Oct 24
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button size={"icon-lg"} variant={"outline"}>
                  <IconChevronRight />
                </Button>
              </ButtonGroup>
            </ButtonGroup>
            <ButtonGroup>
              <Button size={"lg"}>
                <IconDownload />
                Export
              </Button>
              <Button size={"icon-lg"}>
                <IconChevronDown />
              </Button>
            </ButtonGroup>
          </div>
        </section>
      </WorkplacePageHeader>
    </section>
  );
}
