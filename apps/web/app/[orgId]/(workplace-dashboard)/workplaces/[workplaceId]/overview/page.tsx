import { OverviewTab } from "../_components/overview-tab";
import { WorkplacePageHeader } from "../_components/page-header";
import { IconEdit, IconMapPin, IconPoint, IconUpload, IconUserPlus } from "@tabler/icons-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
const OverviewPage = () => {
  return (
    <section className="h-full">
      <WorkplacePageHeader title="Overview">
        <section className="mt-8 mb-3">
          <div className="flex justify-between items-center ">
            <hgroup>
              <h1 className="text-2xl font-bold mt-2">Site name - Overview</h1>
              <div className="flex items-end gap-5">
                <p className="text-sm text-muted-foreground">
                  <span className="italic">Type: </span>
                  <span>PROJECT</span>
                </p>
                <p className="flex items-center text-sm text-muted-foreground mt-1">
                  <IconMapPin className="mr-2" strokeWidth={1.5} size={18} />
                  Kigali, Rwanda
                </p>
                <Badge variant={"outline"} className="border-success text-success">
                  <IconPoint />
                  Active
                </Badge>
              </div>
            </hgroup>
            <div className="flex gap-3 items-center">
              <Button variant={"outline"} size={"lg"}>
                <IconEdit />
                Edit details
              </Button>
              <Button variant={"outline"} size={"lg"}>
                <IconUserPlus />
                Add workers
              </Button>
              <Separator orientation="vertical" />
              <Button variant={"default"} size={"lg"}>
                <IconUpload />
                Upload
              </Button>
            </div>
          </div>
        </section>
      </WorkplacePageHeader>
      <section className="w-full bg-background px-8 py-3">
        <OverviewTab />
      </section>
    </section>
  );
};

export default OverviewPage;
