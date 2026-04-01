import { WorkplacePageHeader } from "../_components/workplace-page-header";
import { WorkersTab } from "../_components/workers-tab";
import { Button } from "@workspace/ui/components/button";
import { IconChevronDown, IconUpload } from "@tabler/icons-react";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { AddWorkersModal } from "./_components/add-workers-action";

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
            <AddWorkersModal />
          </div>
        </section>
      </WorkplacePageHeader>
      <WorkersTab />
    </section>
  );
};

export default WorkersPage;
