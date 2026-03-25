import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/badge";
import { DataTableColumnHeader } from "@/shared/components/data-table-column-header";
import { AdvanceRow } from "./mock";

export const advancesColumns: ColumnDef<AdvanceRow>[] = [
  {
    accessorKey: "workerName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Worker" />,
    cell: ({ row }) => <span className="font-medium">{row.original.workerName}</span>
  },
  {
    accessorKey: "site",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Site" />,
    cell: ({ row }) => (
      <span className="text-blue-600 dark:text-blue-400">{row.original.site}</span>
    )
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => <span>${row.original.amount.toLocaleString()}</span>
  },
  {
    accessorKey: "requestedDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Requested" />,
    cell: ({ row }) => <span>{row.original.requestedDate}</span>
  },
  {
    accessorKey: "approvedBy",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Approved By" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.approvedBy}</span>
    )
  },
  {
    accessorKey: "deductedStatus",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Deducted" />,
    cell: ({ row }) => {
      const s = row.original.deductedStatus;
      const cls =
        s === "Deducted"
          ? "bg-emerald-500/10 text-emerald-600"
          : "bg-amber-500/10 text-amber-600";
      return <Badge className={cls}>{s}</Badge>;
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const s = row.original.status;
      const cls =
        s === "Settled"
          ? "bg-emerald-500/10 text-emerald-600"
          : "bg-red-500/10 text-red-600";
      return <Badge className={cls}>{s}</Badge>;
    }
  }
];
