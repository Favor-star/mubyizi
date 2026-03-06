import { BudgetTab } from "../_components/budget-tab";
import { WorkplacePageHeader } from "../_components/page-header";

const BudgetPage = () => {
  return (
    <section className="h-full">
      <WorkplacePageHeader title="Budget" />
      <BudgetTab />
    </section>
  );
};

export default BudgetPage;
