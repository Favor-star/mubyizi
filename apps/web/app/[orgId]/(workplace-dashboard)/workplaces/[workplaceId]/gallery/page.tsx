import { GalleryDocumentsView } from "../_components/gallery-documents-view";
import { WorkplacePageHeader } from "../_components/workplace-page-header";
import { AddMediaModal } from "./_components/upload-media-modal";
import { UploadDocumentModal } from "./_components/upload-document-modal";

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
            <AddMediaModal />
            <UploadDocumentModal />
          </div>
        </section>
      </WorkplacePageHeader>
      <GalleryDocumentsView />
    </section>
  );
};

export default GalleryPage;
