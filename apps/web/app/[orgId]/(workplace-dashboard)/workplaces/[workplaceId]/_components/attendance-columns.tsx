"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Button } from "@workspace/ui/components/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { IconArrowRight, IconCircleFilled, IconEye } from "@tabler/icons-react";
import { DataTableColumnHeader } from "@/shared/components/data-table-column-header";
import type { AttendanceRow, AttendanceEdit, AttendanceStatus } from "./types";

export type AttendanceTableMeta = {
  edits: Record<string, AttendanceEdit>;
  setEdit: (userId: string, patch: Partial<AttendanceEdit>) => void;
  onViewWorker: (userId: string) => void;
};

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

// ─── Status config ────────────────────────────────────────────────────────────

type StatusConfig = {
  label: string;
  dotClass: string;
  textClass: string;
};

const STATUS_CONFIG: Record<AttendanceStatus, StatusConfig> = {
  NOT_MARKED: { label: "Not Marked", dotClass: "bg-muted-foreground/50", textClass: "text-muted-foreground" },
  PRESENT: { label: "Present", dotClass: "bg-success", textClass: "text-success" },
  ABSENT: { label: "Absent", dotClass: "bg-destructive", textClass: "text-destructive" },
  HALF_DAY: { label: "Half Day", dotClass: "bg-primary", textClass: "text-primary" },
  LATE: { label: "Late", dotClass: "bg-warning", textClass: "text-warning" },
  ON_LEAVE: { label: "On Leave", dotClass: "bg-violet-500", textClass: "text-violet-500" },
  SICK: { label: "Sick", dotClass: "bg-rose-400", textClass: "text-rose-400" }
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as AttendanceStatus[];

// ─── Column definitions ───────────────────────────────────────────────────────

export const attendanceColumns: ColumnDef<AttendanceRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableResizing: false
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Worker" />,
    cell: ({ row }) => (
      <div className="min-w-[140px]">
        <p className="font-medium text-sm leading-tight">{row.original.name}</p>
        <p className="text-[11px] text-muted-foreground">
          {row.original.workerId} · {row.original.role}
        </p>
      </div>
    )
  },
  {
    id: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row, table }) => {
      const meta = table.options.meta as AttendanceTableMeta | undefined;
      const effectiveStatus = meta?.edits[row.original.userId]?.status ?? row.original.status;
      const cfg = STATUS_CONFIG[effectiveStatus];

      return (
        <Select
          value={effectiveStatus}
          onValueChange={(v) => meta?.setEdit(row.original.userId, { status: v as AttendanceStatus })}>
          <SelectTrigger className="h-7 w-36 text-xs gap-1.5 bg-background">
            <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${cfg.dotClass}`} />
            <SelectValue>
              <span className={`text-xs ${cfg.textClass}`}>{cfg.label}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent position="popper">
            {ALL_STATUSES.map((s) => {
              const c = STATUS_CONFIG[s];
              return (
                <SelectItem key={s} value={s}>
                  <span className="flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${c.dotClass}`} />
                    <span className={c.textClass}>{c.label}</span>
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      );
    }
  },
  {
    id: "shift",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Shift" />,
    cell: ({ row, table }) => {
      const meta = table.options.meta as AttendanceTableMeta | undefined;
      const effectiveShift = meta?.edits[row.original.userId]?.shiftLabel ?? row.original.shiftLabel ?? "";

      return (
        <Select
          value={effectiveShift || "none"}
          onValueChange={(v) => meta?.setEdit(row.original.userId, { shiftLabel: v === "none" ? undefined : v })}>
          <SelectTrigger className="h-7 w-32 text-xs bg-background">
            <SelectValue placeholder="—" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">—</SelectItem>
            <SelectItem value="Morning">Morning</SelectItem>
            <SelectItem value="Afternoon">Afternoon</SelectItem>
            <SelectItem value="Night">Night</SelectItem>
            <SelectItem value="Full Day">Full Day</SelectItem>
          </SelectContent>
        </Select>
      );
    }
  },
  {
    accessorKey: "dailyRate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Daily Rate" />,
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">{formatCurrency(row.original.dailyRate)}</span>
    )
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    enableResizing: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as AttendanceTableMeta | undefined;
      const isDirty = !!meta?.edits[row.original.userId];

      return (
        <div className="flex items-center gap-1">
          <span className="size-2">
            {isDirty && <IconCircleFilled size={8} className="text-warning shrink-0" aria-label="Unsaved changes" />}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => meta?.onViewWorker(row.original.userId)}>
            <IconArrowRight strokeWidth={1.5} size={14} />
          </Button>
        </div>
      );
    }
  }
];
