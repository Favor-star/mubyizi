import { Button } from "@workspace/ui/components/button";
import { BudgetTab } from "../_components/budget-tab";
import { WorkplacePageHeader } from "../_components/workplace-page-header";
import { IconCash, IconDownload, IconEdit, IconPlus } from "@tabler/icons-react";
import { Separator } from "@workspace/ui/components/separator";
import { RecordExpenseDialog } from "../_components/record-expense-dialog";

const BudgetPage = () => {
  return (
    <section className="h-full">
      <WorkplacePageHeader title="Budget">
        <section className="mt-8 mb-3 flex justify-between items-center ">
          <hgroup>
            <h1 className="text-2xl font-bold mt-2">Site name - Budget</h1>
            <p className="text-muted-foreground text-sm">
              Check the budget status, track expenses, and manage financial resources for your project.
            </p>
          </hgroup>
          <div className="flex gap-2">
            <Button size={"lg"} variant={"outline"}>
              <IconEdit strokeWidth={1.5} />
              Edit details
            </Button>
            <Button variant={"outline"} size={"lg"}>
              <IconDownload strokeWidth={1.5} />
              Export
            </Button>
            <Separator orientation="vertical" />
            <RecordExpenseDialog
              trigger={
                <Button size={"lg"}>
                  <IconCash strokeWidth={1.5} />
                  New Expense
                </Button>
              }
            />
          </div>
        </section>
      </WorkplacePageHeader>
      <BudgetTab />
    </section>
  );
};

export default BudgetPage;
