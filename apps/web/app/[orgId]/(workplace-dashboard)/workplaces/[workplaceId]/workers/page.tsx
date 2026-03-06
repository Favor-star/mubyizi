import { WorkplacePageHeader } from "../_components/page-header";
import { WorkersTab } from "../_components/workers-tab";

const WorkersPage = () => {
  return (
    <section className="h-full">
      <WorkplacePageHeader title="Workers" />
      <WorkersTab />
    </section>
  );
};

export default WorkersPage;
