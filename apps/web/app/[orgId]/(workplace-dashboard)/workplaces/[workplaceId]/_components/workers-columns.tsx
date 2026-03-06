"use client";

import { IconCalendar, IconCheckbox, IconEye } from "@tabler/icons-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/shared/components/data-table-column-header";
import type { WorkplaceWorker } from "./types";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}

function formatCheckIn(iso?: string): string {
  if (!iso) return "--";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

const tradeLevelVariants: Record<WorkplaceWorker["tradeLevel"], string> = {
  Master: "border-violet-500 text-violet-600 dark:text-violet-400",
  Journeyman: "border-blue-500 text-blue-600 dark:text-blue-400",
  Apprentice: "border-border text-muted-foreground"
};

const statusColors: Record<WorkplaceWorker["todayStatus"], string> = {
  on_site: "bg-primary",
  on_break: "bg-warning",
  not_started: "bg-muted-foreground",
  checked_out: "bg-muted"
};

const statusLabels: Record<WorkplaceWorker["todayStatus"], string> = {
  on_site: "On Site",
  on_break: "On Break",
  not_started: "Not Started",
  checked_out: "Checked Out"
};

export const workplaceWorkersColumns: ColumnDef<WorkplaceWorker>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Worker Details" />,
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.workerId}</p>
      </div>
    )
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => <span className="text-sm">{row.original.role}</span>
  },
  {
    accessorKey: "tradeLevel",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Trade Level" />,
    cell: ({ row }) => (
      <Badge variant="outline" className={tradeLevelVariants[row.original.tradeLevel]}>
        {row.original.tradeLevel}
      </Badge>
    )
  },
  {
    accessorKey: "todayStatus",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Today's Status" />,
    cell: ({ row }) => (
      <span className="flex items-center gap-1.5">
        <span className={`inline-block h-2 w-2 rounded-full ${statusColors[row.original.todayStatus]}`} />
        <span className="text-sm">{statusLabels[row.original.todayStatus]}</span>
      </span>
    )
  },
  {
    accessorKey: "checkInTime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Check-in Time" />,
    cell: ({ row }) => <span className="text-sm">{formatCheckIn(row.original.checkInTime)}</span>
  },
  {
    accessorKey: "dailyEarnings",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Daily Earnings" />,
    cell: ({ row }) => <span className="text-sm font-medium">{formatCurrency(row.original.dailyEarnings)}</span>
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableResizing: false,
    enableSorting: false,
    cell: () => (
      <div className="flex items-center gap-1 whitespace-nowrap">
        <Button variant="outline" size="icon">
          <IconEye strokeWidth={1.5} size={15} />
        </Button>
        <Button variant="ghost" size="icon">
          <IconCheckbox strokeWidth={1.5} size={15} />
        </Button>
        <Button variant="ghost" size="icon">
          <IconCalendar strokeWidth={1.5} size={15} />
        </Button>
      </div>
    )
  }
];
