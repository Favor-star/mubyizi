import { GalleryDocumentsView } from "../_components/gallery-documents-view";
import { WorkplacePageHeader } from "../_components/workplace-page-header";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { Button } from "@workspace/ui/components/button";
import { IconChevronDown, IconPlus, IconUpload } from "@tabler/icons-react";

const GalleryPage = () => {
  return (
    <section className="h-full">
      <WorkplacePageHeader title="Gallery & Documents">
        <section className="mt-8 mb-3 flex justify-between items-center">
          <hgroup>
            <h1 className="text-2xl font-bold mt-2">Site name — Gallery & Documents</h1>
            <p className="text-muted-foreground text-sm">Media captures and documents for this workplace.</p>
          </hgroup>
          <div className="flex gap-3 items-center">
            <ButtonGroup>
              <Button size="lg" variant="default">
                <IconUpload />
                Upload document
              </Button>
              <Button size="icon-lg" variant="default">
                <IconChevronDown />
              </Button>
            </ButtonGroup>
            <Button size="lg" variant="outline">
              <IconPlus />
              Add media
            </Button>
          </div>
        </section>
      </WorkplacePageHeader>
      <GalleryDocumentsView />
    </section>
  );
};

export default GalleryPage;
