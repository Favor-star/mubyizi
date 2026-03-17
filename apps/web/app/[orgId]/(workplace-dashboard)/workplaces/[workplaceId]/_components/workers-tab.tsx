"use client";

import { IconAdjustments, IconCash, IconSearch, IconUserCheck, IconUsers } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import React from "react";
import { DataTable } from "@/shared/components/data-table";
import { DataTablePagination } from "@/shared/components/data-table-pagination";
import { useGeneralTable } from "@/hooks/use-general-table";
import { mockPaginatedWorkers, mockWorkerStats } from "./_mock/workers";
import { workplaceWorkersColumns } from "./workers-columns";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@workspace/ui/components/input-group";
import { StatCard } from "@/shared/components/stat-card";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}

export function WorkersTab() {
  const stats = mockWorkerStats;
  const { data: workers, total, page, pageSize } = mockPaginatedWorkers;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all-roles");
  const [statusFilter, setStatusFilter] = React.useState("all-statuses");

  const filteredWorkers = React.useMemo(() => {
    return workers.filter((w) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!w.name.toLowerCase().includes(q) && !w.workerId.toLowerCase().includes(q)) return false;
      }
      if (roleFilter !== "all-roles" && w.role.toLowerCase().replace(" ", "-") !== roleFilter) return false;
      if (statusFilter !== "all-statuses" && w.todayStatus.replace("_", "-") !== statusFilter) return false;
      return true;
    });
  }, [workers, searchQuery, roleFilter, statusFilter]);

  const { table } = useGeneralTable(filteredWorkers, workplaceWorkersColumns);

  const totalPages = Math.ceil(total / pageSize);
  const paginationMeta = {
    page,
    limit: pageSize,
    totalItems: total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };

  return (
    <div className="p-4 space-y-4">
      {/* Stat cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Assigned"
          value={`${stats.totalAssigned} Workers`}
          color="var(--primary)"
          icon={IconUsers}
        />
        <StatCard title="Active Now" value={`${stats.activeNow} On Site`} color="var(--success)" icon={IconUserCheck} />
        <StatCard
          title="Labor Cost Today"
          value={formatCurrency(stats.laborCostToday)}
          color="var(--warning)"
          icon={IconCash}
        />
      </section>

      {/* Search + filter bar */}
      <div className="bg-sidebar border  p-3 flex flex-wrap items-center gap-2">
        <InputGroup className="flex-1 min-w-48  gap-2 ">
          <InputGroupAddon>
            <IconSearch strokeWidth={1.5} size={16} />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search by name or worker ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-36 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-roles">All Roles</SelectItem>
            <SelectItem value="site-foreman">Site Foreman</SelectItem>
            <SelectItem value="electrician">Electrician</SelectItem>
            <SelectItem value="laborer">Laborer</SelectItem>
            <SelectItem value="plumber">Plumber</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-statuses">All Statuses</SelectItem>
            <SelectItem value="on-site">On Site</SelectItem>
            <SelectItem value="on-break">On Break</SelectItem>
            <SelectItem value="not-started">Not Started</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" className="shrink-0">
          <IconAdjustments strokeWidth={1.5} size={18} />
        </Button>
      </div>

      {/* Workers table */}
      <DataTable
        table={table}
        columns={workplaceWorkersColumns}
        pagination={
          <DataTablePagination
            meta={paginationMeta}
            limit={pageSize}
            page={page}
            setLimit={() => {}}
            setPage={() => {}}
            table={table}
          />
        }
      />
    </div>
  );
}
