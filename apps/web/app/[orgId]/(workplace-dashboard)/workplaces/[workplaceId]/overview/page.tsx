import { WorkplacePageHeader } from "../_components/workplace-page-header";
import { IconEdit, IconMapPin, IconPointFilled, IconUpload, IconUserPlus } from "@tabler/icons-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { ProjectSummary } from "../_components/project-summary";
import { AssignedWorkers } from "../_components/assigned-workers";
import { RecentImages } from "../_components/recent-images";
import { SiteMap } from "../_components/site-map";
import { CostTracking } from "../_components/cost-tracking";
const OverviewPage = () => {
  return (
    <section className="h-full">
      <WorkplacePageHeader title="Overview">
        <section className="mt-8 mb-3 flex justify-between items-center ">
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
                <IconPointFilled />
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
        </section>
      </WorkplacePageHeader>
      <section className="w-full bg-background p-4  grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ProjectSummary />
          <RecentImages />
          <AssignedWorkers />
        </div>
        <div className="md:col-span-1 space-y-4">
          <SiteMap />
          <CostTracking />
        </div>
      </section>
    </section>
  );
};

export default OverviewPage;
