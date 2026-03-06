"use client";
import { MOCK_WORKPLACES } from "@/data/mock";
import { WorkplaceCard } from "./components/workplace-card";
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { useParams } from "next/navigation";

export default function WorkplacesPage() {
  const params = useParams();
  const orgId = params.orgId as string;

  return (
    <section className="space-y-3 w-full">
      <hgroup className="flex items-center justify-between">
        <header>
          <h1 className="text-xl font-semibold tracking-tight">Workforce management</h1>
          <p className="text-sm text-muted-foreground">Manage profiles, assignments, and check real-time statuses</p>
        </header>
        <div className="flex gap-3">
          <ButtonGroup>
            <Button size={"lg"}>
              <IconPlus />
              Add worker
            </Button>
            <Button size={"icon-lg"}>
              <IconChevronDown />
            </Button>
          </ButtonGroup>
        </div>
      </hgroup>
      {/* <section className="pt-3">
        <SearchHeader
          searchQuery=""
          onSearchChange={() => {}}
          searchPlaceholder="Search by name, location..."
          resultCount={0}
          filters={[]}
          onFilterChange={() => {}}
          actions={null}
        />
      </section> */}
      <section className="w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {MOCK_WORKPLACES[orgId]?.map((workplace, i) => (
          <WorkplaceCard key={workplace.id} workplace={workplace} orgId={orgId} />
        ))}
      </section>
    </section>
  );
}
