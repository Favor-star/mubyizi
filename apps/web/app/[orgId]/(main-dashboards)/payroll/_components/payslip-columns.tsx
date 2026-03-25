import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { DataTableColumnHeader } from "@/shared/components/data-table-column-header";
import { PayslipRow } from "./mock";

const fmt = (n: number) =>
  n === 0 ? null : `$${n.toLocaleString()}`;

export const payslipColumns: ColumnDef<PayslipRow>[] = [
  {
    accessorKey: "workerName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Worker" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${row.original.workerColor}`}>
          {row.original.workerName[0]}
        </span>
        <span className="font-medium">{row.original.workerName}</span>
      </div>
    )
  },
  {
    accessorKey: "site",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Site" />,
    cell: ({ row }) => (
      <span className="text-blue-600 dark:text-blue-400">{row.original.site}</span>
    )
  },
  {
    accessorKey: "baseWage",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Base Wage" />,
    cell: ({ row }) => <span>${row.original.baseWage.toLocaleString()}</span>
  },
  {
    accessorKey: "overtime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Overtime" />,
    cell: ({ row }) => {
      const val = fmt(row.original.overtime);
      return val ? (
        <span className="text-emerald-600">{val}</span>
      ) : (
        <span className="text-muted-foreground">$0</span>
      );
    }
  },
  {
    accessorKey: "deductions",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Deductions" />,
    cell: ({ row }) => {
      const val = fmt(row.original.deductions);
      return val ? (
        <span className="text-red-500">{val}</span>
      ) : (
        <span className="text-muted-foreground">$0</span>
      );
    }
  },
  {
    accessorKey: "advance",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Advance" />,
    cell: ({ row }) => {
      const val = fmt(row.original.advance);
      return val ? (
        <span className="text-amber-500">{val}</span>
      ) : (
        <span className="text-muted-foreground">$0</span>
      );
    }
  },
  {
    accessorKey: "netPay",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Net Pay" />,
    cell: ({ row }) => (
      <span className="font-semibold">${row.original.netPay.toLocaleString()}</span>
    )
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const s = row.original.status;
      const cls =
        s === "Paid"
          ? "bg-emerald-500/10 text-emerald-600"
          : s === "Pending"
            ? "bg-amber-500/10 text-amber-600"
            : "bg-red-500/10 text-red-600";
      return <Badge className={cls}>{s}</Badge>;
    }
  },
  {
    id: "actions",
    enableSorting: false,
    header: "Payslip",
    cell: () => (
      <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
        Download
      </Button>
    )
  }
];
