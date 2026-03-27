"use client";

import React from "react";
import { useParams, usePathname } from "next/navigation";
import {
  IconAdjustments,
  IconBuildingCommunity,
  IconChartBar,
  IconChevronDown,
  IconCircleCheck,
  IconCopy,
  IconFilter,
  IconLayoutGrid,
  IconList,
  IconPlus,
  IconSearch,
  IconTable,
  IconUpload,
  IconUsers,
  IconBolt
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@workspace/ui/components/input-group";
import { StatCard } from "@/shared/components/stat-card";
import { DataTable } from "@/shared/components/data-table";
import { DataTablePagination, type PaginationMeta } from "@/shared/components/data-table-pagination";
import { useGeneralTable } from "@/hooks/use-general-table";
import { MOCK_WORKPLACES } from "@/data/mock";
import { WorkplaceCard } from "./components/workplace-card";
import { workplaceColumns } from "./components/workplace-columns";
import { PageHeader } from "../_components/page-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@workspace/ui/components/dropdown-menu";
import Link from "next/link";

export default function WorkplacesPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const path = usePathname();
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("grid");
  const [searchQuery, setSearchQuery] = React.useState("");

  const allWorkplaces = MOCK_WORKPLACES[orgId] ?? [];

  const filtered = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allWorkplaces;
    return allWorkplaces.filter((w) => w.name.toLowerCase().includes(q) || w.location.toLowerCase().includes(q));
  }, [allWorkplaces, searchQuery]);

  const totalWorkers = allWorkplaces.reduce((sum, w) => sum + w.activeWorkplaces, 0);
  const avgWorkers = allWorkplaces.length ? Math.round(totalWorkers / allWorkplaces.length) : 0;

  const columns = React.useMemo(() => workplaceColumns(orgId), [orgId]);
  const { table, page, limit, setPage, setLimit } = useGeneralTable(filtered, columns);

  const totalPages = Math.ceil(filtered.length / limit);
  const meta: PaginationMeta = {
    page,
    limit,
    totalItems: filtered.length,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };

  return (
    <section className="space-y-3 w-full">
      <PageHeader
        title="Workplaces"
        description="Manage sites, track workers, and monitor activity across all locations">
        <ButtonGroup>
          <Button size="lg" asChild>
            <Link href={`${path}/create`}>
              <IconPlus />
              Create workplace
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
                  <p>Quick create</p>
                  <p className="text-xs text-muted-foreground">Just a name — fill details later</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconUpload />
                <div>
                  <p>Use template</p>
                  <p className="text-xs text-muted-foreground">Start from a preset configuration</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconTable />
                <div>
                  <p>Import from CSV</p>
                  <p className="text-xs text-muted-foreground">Bulk import multiple workplaces</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconCopy />
                <div>
                  <p>Duplicate existing</p>
                  <p className="text-xs text-muted-foreground">Copy settings from a workplace</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </PageHeader>

      <section className="pt-3 px-4 space-y-4">
        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Sites"
            value={String(allWorkplaces.length)}
            icon={IconBuildingCommunity}
            color="var(--primary)"
          />
          <StatCard
            title="Active Sites"
            value={String(allWorkplaces.length)}
            icon={IconCircleCheck}
            color="var(--chart-2)"
          />
          <StatCard title="Total Workers" value={String(totalWorkers)} icon={IconUsers} color="var(--chart-3)" />
          <StatCard title="Avg Workers / Site" value={String(avgWorkers)} icon={IconChartBar} color="var(--warning)" />
        </div>
      </section>

      <section className="px-4 space-y-3">
        {/* Controls bar */}
        <div className="flex justify-between pt-2">
          <ButtonGroup>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <IconSearch />
              </InputGroupAddon>
              <InputGroupInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or location..."
              />
              <InputGroupAddon align="inline-end">{filtered.length} results</InputGroupAddon>
            </InputGroup>
            <ButtonGroup>
              <Button variant="outline">
                <IconFilter />
                Filters
              </Button>
            </ButtonGroup>
          </ButtonGroup>

          <div className="flex gap-2">
            <ButtonGroup>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}>
                <IconList /> List
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}>
                <IconLayoutGrid /> Grid
              </Button>
            </ButtonGroup>
            <Button variant="outline" size="icon-sm">
              <IconAdjustments strokeWidth={1.2} />
            </Button>
          </div>
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          <DataTable
            table={table}
            columns={columns}
            pagination={
              <DataTablePagination
                meta={meta}
                table={table}
                page={page}
                limit={limit}
                setPage={setPage}
                setLimit={setLimit}
              />
            }
          />
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 ">
            {filtered.map((workplace) => (
              <WorkplaceCard key={workplace.id} workplace={workplace} orgId={orgId} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
