import { ButtonGroup } from "@workspace/ui/components/button-group";
import { GalleryTab } from "../_components/gallery-tab";
import { WorkplacePageHeader } from "../_components/workplace-page-header";
import { Button } from "@workspace/ui/components/button";
import { IconCalendar, IconChevronLeft, IconChevronRight, IconDownload, IconPlus } from "@tabler/icons-react";

const GalleryPage = () => {
  return (
    <section className="h-full">
      <WorkplacePageHeader title="Documents">
        <section className="mt-8 mb-3 flex justify-between items-center ">
          <hgroup>
            <h1 className="text-2xl font-bold mt-2">Site name - Documents</h1>
            <p className="text-muted-foreground text-sm">
              Site A — Nairobi CBD | All images that are related to this site.
            </p>
          </hgroup>
          <div className="flex gap-3 items-center">
            <ButtonGroup>
              <Button variant="outline" size="icon-lg">
                <IconChevronLeft />
              </Button>
              <Button size="lg" variant="outline">
                <IconCalendar />
                12 Aug - 12 Sep 2024
              </Button>
              <Button variant="outline" size="icon-lg">
                <IconChevronRight />
              </Button>
            </ButtonGroup>
            <Button size="lg" variant="default">
              <IconPlus />
              Add new
            </Button>
          </div>
        </section>
      </WorkplacePageHeader>
      <GalleryTab />
    </section>
  );
};

export default GalleryPage;
