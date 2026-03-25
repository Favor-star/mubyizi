"use client";

import { IconAdjustments, IconCash, IconFilter, IconLayoutGrid, IconList, IconSearch, IconUserCheck, IconUsers } from "@tabler/icons-react";
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
import { ButtonGroup } from "@workspace/ui/components/button-group";

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
    <div className="p-4 ">
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
      <div className="flex justify-between pt-4 pb-2">
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
