"use client";
import { DataTable } from "@/shared/components/data-table";
import { DataTablePagination } from "@/shared/components/data-table-pagination";
import { SearchHeader, FilterConfig } from "@/shared/components/search-header";
import { PageHeader } from "../_components/page-header";
import {
  IconAdjustments,
  IconAdjustmentsAlt,
  IconBolt,
  IconChevronDown,
  IconDownload,
  IconFilter,
  IconLayoutGrid,
  IconList,
  IconPlus,
  IconSearch,
  IconTable,
  IconUpload,
  IconUser,
  IconUsers
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@workspace/ui/components/dropdown-menu";
import { workersColumns, WorkerItem } from "./column-def";
import { useGeneralTable } from "@/hooks/use-general-table";
import { mockWorkers } from "./data/mock";
import React from "react";
import { StatCard } from "@/shared/components/stat-card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@workspace/ui/components/input-group";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

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
  const params = useParams();
  const orgId = params.orgId as string;
  const path = usePathname();
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
      {/* <ButtonGroup>
        <Button variant="outline">
          <IconDownload /> Export
        </Button>
        <Button variant="outline">
          <IconChevronDown />
        </Button>
      </ButtonGroup>
      <Button>
        <IconAdjustmentsAlt /> Hide/show
      </Button> */}
    </>
  );

  return (
    <section className="space-y-3 w-full">
      <PageHeader
        title="Workforce management"
        description="Manage profiles, assignments, and check real-time statuses">
        <ButtonGroup>
          <Button variant="outline">
            <IconDownload /> Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
              <DropdownMenuLabel>Export options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconTable />
                <div>
                  <p>Export as CSV</p>
                  <p className="text-xs text-muted-foreground">Download all worker data</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconDownload />
                <div>
                  <p>Export as Excel</p>
                  <p className="text-xs text-muted-foreground">Formatted spreadsheet</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
        <ButtonGroup>
          <Button size="lg" asChild>
            <Link href={`${path}/create`}>
              <IconPlus />
              Add worker
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-lg">
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-56">
              <DropdownMenuLabel>More options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconBolt />
                <div>
                  <p>Quick add</p>
                  <p className="text-xs text-muted-foreground">Just a name — fill details later</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconTable />
                <div>
                  <p>Import from CSV</p>
                  <p className="text-xs text-muted-foreground">Bulk import multiple workers</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconUpload />
                <div>
                  <p>Bulk provision</p>
                  <p className="text-xs text-muted-foreground">Create provisional profiles in batch</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconUsers />
                <div>
                  <p>Invite by email</p>
                  <p className="text-xs text-muted-foreground">Send sign-up invites to workers</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </PageHeader>
      <section className="pt-3 px-4 space-y-4">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={IconUser} color="var(--destructive)" title="Total users" value="320" />
          <StatCard title="Inactive workers" value="48" icon={IconUser} color="var(--success)" />
          <StatCard title="Pending profiles" value="12" icon={IconUser} color="var(--warning)" />
          <StatCard title="Today's check-ins" value="128" icon={IconUser} color="var(--primary)" />
        </div>
        {/* <SearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by name, trade, phone, email..."
          resultCount={filteredItems.length}
          filters={workerFilters}
          filterValues={filterValues}
          onFilterChange={(key, vals) => setFilterValues((prev) => ({ ...prev, [key]: vals }))}
          actions={actionsNode}
        /> */}
      </section>
      <section className="px-4">
        <div className="flex justify-between pt-3 pb-2">
          <div className="flex gap-2">
            <ButtonGroup>
              <ButtonGroup>
                <InputGroup>
                  <InputGroupAddon align={"inline-start"}>
                    <IconSearch />
                  </InputGroupAddon>
                  <InputGroupInput />
                  <InputGroupAddon align={"inline-end"}>7 results</InputGroupAddon>
                </InputGroup>
              </ButtonGroup>
              <ButtonGroup>
                <Button variant={"outline"}>
                  <IconFilter />
                  Filters
                </Button>
              </ButtonGroup>
            </ButtonGroup>
          </div>
          <div className="flex gap-2">
            <ButtonGroup>
              <Button variant="default" size="sm">
                <IconList /> List
              </Button>
              <Button variant="outline" size="sm">
                <IconLayoutGrid /> Grid
              </Button>
            </ButtonGroup>{" "}
            <Button variant="outline" size="icon-sm">
              <IconAdjustments strokeWidth={1.2} />
            </Button>
          </div>
        </div>
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
