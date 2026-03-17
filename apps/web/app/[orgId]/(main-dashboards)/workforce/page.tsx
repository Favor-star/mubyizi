"use client";
import { DataTable } from "@/shared/components/data-table";
import { DataTablePagination } from "@/shared/components/data-table-pagination";
import { SearchHeader, FilterConfig } from "@/shared/components/search-header";
import { IconAdjustmentsAlt, IconChevronDown, IconDownload, IconPlus } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { workersColumns, WorkerItem } from "./column-def";
import { useGeneralTable } from "@/hooks/use-general-table";
import { mockWorkers } from "./data/mock";
import React from "react";

const workerFilters: FilterConfig[] = [
  {
    key: "role",
    label: "Role",
    options: [
      { label: "Owner", value: "OWNER" },
      { label: "Admin", value: "ADMIN" },
      { label: "Manager", value: "MANAGER" },
      { label: "Member", value: "MEMBER" },
      { label: "Viewer", value: "VIEWER" }
    ]
  },
  {
    key: "accountStatus",
    label: "Status",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Provisional", value: "PROVISIONAL" }
    ]
  },
  {
    key: "occupationCategory",
    label: "Trade",
    options: [
      { label: "Construction", value: "CONSTRUCTION" },
      { label: "Logistics", value: "LOGISTICS" },
      { label: "Agriculture", value: "AGRICULTURE" },
      { label: "Events", value: "EVENTS" }
    ]
  }
];

export default function WorkforcePage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterValues, setFilterValues] = React.useState<Record<string, string[]>>({});

  const filteredItems = React.useMemo(() => {
    return mockWorkers.items.filter((worker) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hit =
          worker.name.toLowerCase().includes(q) ||
          (worker.occupation ?? "").toLowerCase().includes(q) ||
          (worker.phoneNumber ?? "").toLowerCase().includes(q) ||
          (worker.email ?? "").toLowerCase().includes(q);
        if (!hit) return false;
      }
      for (const [key, vals] of Object.entries(filterValues)) {
        if (vals.length === 0) continue;
        if (!vals.includes(worker[key as keyof WorkerItem] as string)) return false;
      }
      return true;
    });
  }, [searchQuery, filterValues]);

  const { table } = useGeneralTable(filteredItems, workersColumns);

  const actionsNode = (
    <>
      <ButtonGroup>
        <Button variant="outline">
          <IconDownload /> Export
        </Button>
        <Button variant="outline">
          <IconChevronDown />
        </Button>
      </ButtonGroup>
      <Button>
        <IconAdjustmentsAlt /> Hide/show
      </Button>
    </>
  );

  return (
    <section className="space-y-3 w-full">
      <hgroup className="flex items-center justify-between bg-sidebar p-4">
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
      <section className="pt-3 px-4">
        <SearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by name, trade, phone, email..."
          resultCount={filteredItems.length}
          filters={workerFilters}
          filterValues={filterValues}
          onFilterChange={(key, vals) => setFilterValues((prev) => ({ ...prev, [key]: vals }))}
          actions={actionsNode}
        />
      </section>
      <section className="px-4">
        <DataTable
          columns={workersColumns}
          table={table}
          pagination={
            <DataTablePagination
              meta={mockWorkers}
              limit={20}
              page={1}
              setLimit={() => {}}
              setPage={() => {}}
              table={table}
            />
          }
        />
      </section>
    </section>
  );
}
