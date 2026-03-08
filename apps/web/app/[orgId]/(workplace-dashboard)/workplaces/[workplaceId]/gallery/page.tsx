import { GalleryTab } from "../_components/gallery-tab";
import { WorkplacePageHeader } from "../_components/workplace-page-header";

const GalleryPage = () => {
  return (
    <section className="h-full">
      <WorkplacePageHeader title="Gallery" />
      <GalleryTab />
    </section>
  );
};

export default GalleryPage;
