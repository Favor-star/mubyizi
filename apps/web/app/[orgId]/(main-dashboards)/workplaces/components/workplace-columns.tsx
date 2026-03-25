import { ColumnDef } from "@tanstack/react-table";
import { IconArrowRight, IconBuildingCommunity } from "@tabler/icons-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { DataTableColumnHeader } from "@/shared/components/data-table-column-header";
import { Workplace } from "@/data/mock";
import Link from "next/link";

export const workplaceColumns = (orgId: string): ColumnDef<Workplace>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Site" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: "color-mix(in oklab, var(--primary) 10%, transparent)" }}
        >
          <IconBuildingCommunity
            strokeWidth={1.5}
            size={18}
            style={{ color: "var(--primary)" }}
          />
        </div>
        <div>
          <p className="font-medium text-sm leading-none">{row.original.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{row.original.location}</p>
        </div>
      </div>
    )
  },
  {
    accessorKey: "location",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.location}</span>
    )
  },
  {
    accessorKey: "activeWorkplaces",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Workers" />,
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.activeWorkplaces} workers</Badge>
    )
  },
  {
    id: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: () => (
      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
        Active
      </Badge>
    )
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    cell: ({ row }) => (
      <Button asChild variant="ghost" size="sm">
        <Link href={`/${orgId}/workplaces/${row.original.id}`}>
          View Site
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    )
  }
];
