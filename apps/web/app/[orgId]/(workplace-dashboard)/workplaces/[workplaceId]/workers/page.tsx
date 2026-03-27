import { WorkplacePageHeader } from "../_components/workplace-page-header";
import { WorkersTab } from "../_components/workers-tab";
import { Button } from "@workspace/ui/components/button";
import { IconChevronDown, IconUpload, IconUserPlus } from "@tabler/icons-react";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { DialogWrapper } from "@/shared/components/dialog-wrapper";

const WorkersPage = () => {
  return (
    <section className="h-full">
      <WorkplacePageHeader title="Workers">
        <section className="mt-8 mb-3 flex justify-between items-center ">
          <hgroup>
            <h1 className="text-2xl font-bold mt-2">Site name - Workers</h1>
            <p className="text-muted-foreground text-sm">Manage workers assigned to this project.</p>
          </hgroup>
          <div className="flex gap-2">
            <ButtonGroup>
              <Button variant={"outline"} size={"lg"}>
                <IconUpload />
                Import
              </Button>
              <Button variant={"outline"} size={"icon-lg"}>
                <IconChevronDown />
              </Button>
            </ButtonGroup>
            <DialogWrapper
              trigger={
                <Button variant={"default"} size={"lg"}>
                  <IconUserPlus />
                  Add Worker
                </Button>
              }
              title="Add Worker"
              description="Enter worker details to add them to the project.">
              <p className="w-screen-xl">Worker details form goes here.</p>
            </DialogWrapper>
          </div>
        </section>
      </WorkplacePageHeader>
      <WorkersTab />
    </section>
  );
};

export default WorkersPage;
