import { IconCalendar, IconChevronLeft, IconChevronRight,  } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

export default function AttendancePage() {
  return (
    <section className="space-y-3 w-full ">
      <hgroup className="flex items-center justify-between">
        <header>
          <h1 className="text-xl font-semibold tracking-tight">
            Attendance tracking: <span className="font-black italic!">25th October 2025</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor attendance, track working hours, and manage time-off requests for your workforce
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
      <section className="pt-3">
        <Tabs defaultValue="overview" className="">
          <div className="w-full border-b ">
            <TabsList variant={"line"} className="">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview" className="">
            <p>Overview content goes here...</p>
          </TabsContent>
          <TabsContent value="details">
            <p>Details content goes here...</p>
          </TabsContent>
        </Tabs>
      </section>
    </section>
  );
}
