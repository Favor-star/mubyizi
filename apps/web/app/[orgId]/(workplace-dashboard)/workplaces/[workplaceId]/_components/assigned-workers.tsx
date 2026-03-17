"use client";

import { IconAdjustments, IconArrowRight, IconDots, IconDownload } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@workspace/ui/components/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/components/data-table";
import { DataTableColumnHeader } from "@/shared/components/data-table-column-header";
import { useGeneralTable } from "@/hooks/use-general-table";

type AssignedWorker = {
  id: string;
  name: string;
  role: string;
  tradeLevel: string;
  status: string;
  onSite: boolean;
};

const workers: AssignedWorker[] = [
  { id: "W-4021", name: "Michael Chen", role: "Site Foreman", tradeLevel: "Master", status: "On Site", onSite: true },
  {
    id: "W-3391",
    name: "Sarah Johnson",
    role: "Electrician",
    tradeLevel: "Journeyman",
    status: "On Site",
    onSite: true
  },
  { id: "W-5110", name: "David Smith", role: "Laborer", tradeLevel: "Apprentice", status: "Break", onSite: false }
];

const columns: ColumnDef<AssignedWorker>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Worker" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${row.original.name}&backgroundColor=1e293b`}
            alt={row.original.name}
          />
          <AvatarFallback className="text-xs">
            {row.original.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm leading-none">{row.original.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{row.original.id}</p>
        </div>
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
      <Badge variant="outline" className="text-xs font-normal">
        {row.original.tradeLevel}
      </Badge>
    )
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${row.original.onSite ? "bg-green-500" : "bg-yellow-500"}`} />
        <span className="text-sm">{row.original.status}</span>
      </div>
    )
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    cell: ({ row: _ }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <IconDots strokeWidth={1.5} className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Profile</DropdownMenuItem>
          <DropdownMenuItem>Edit Role</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
];

export const AssignedWorkers = () => {
  const { table } = useGeneralTable(workers, columns);

  return (
    <section className="mt-4 bg-sidebar border p-3">
      <header className="flex items-center justify-between pb-3 border-b">
        <div>
          <h2 className="font-bold">Assigned Workers</h2>
          <p className="text-sm text-muted-foreground">24 active on site today</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <IconAdjustments strokeWidth={1.5} className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <IconDownload strokeWidth={1.5} className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <DataTable
        table={table}
        columns={columns}
        pagination={
          <Button variant="link" className="mx-auto flex">
            View All Workers
            <IconArrowRight className="h-4 w-4" />
          </Button>
        }
      />
    </section>
  );
};
