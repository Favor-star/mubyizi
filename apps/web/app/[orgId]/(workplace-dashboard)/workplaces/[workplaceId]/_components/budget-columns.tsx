"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/shared/components/data-table-column-header";
import type { BudgetTransaction, TransactionCategory, TransactionStatus } from "./types";
import { Badge } from "@workspace/ui/components/badge";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

const categoryStyles: Record<TransactionCategory, { bg: string; text: string; label: string }> = {
  labor: { bg: "bg-primary/10", text: "text-primary", label: "LABOR" },
  materials: { bg: "bg-chart-2/10", text: "text-chart-2", label: "MATERIALS" },
  equipment: { bg: "bg-warning/15", text: "text-warning", label: "EQUIPMENT" }
};

const statusStyles: Record<TransactionStatus, { dot: string; label: string }> = {
  approved: { dot: "bg-success", label: "Approved" },
  pending: { dot: "bg-warning", label: "Pending" }
};

export const budgetTransactionColumns: ColumnDef<BudgetTransaction>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.date)}</span>
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => {
      const s = categoryStyles[row.original.category];
      return <Badge className={`${s.bg} ${s.text}`}>{s.label}</Badge>;
    }
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => <span className="text-sm">{row.original.description}</span>
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => <span className="text-sm font-medium">{formatCurrency(row.original.amount)}</span>
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const s = statusStyles[row.original.status];
      return (
        <span className="flex items-center gap-1.5">
          <span className={`inline-block h-2 w-2 rounded-full ${s.dot}`} />
          <span className="text-sm">{s.label}</span>
        </span>
      );
    }
  }
];
