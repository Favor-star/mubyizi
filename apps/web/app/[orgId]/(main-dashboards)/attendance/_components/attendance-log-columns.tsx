"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/shared/components/data-table-column-header";
import { Badge } from "@workspace/ui/components/badge";
import type { AttendanceLogRow, CheckInMethod, AttendanceStatus } from "./_mock/attendance";

const METHOD_STYLES: Record<CheckInMethod, { label: string; className: string }> = {
  QR_SCAN: { label: "QR Scan", className: "bg-blue-500/15 text-blue-500 border-0 font-medium" },
  MOBILE_APP: { label: "Mobile App", className: "bg-cyan-500/15 text-cyan-600 border-0 font-medium" },
  MANUAL: { label: "Manual", className: "bg-amber-500/15 text-amber-600 border-0 font-medium" },
  GPS: { label: "GPS", className: "bg-purple-500/15 text-purple-500 border-0 font-medium" },
  BIOMETRIC: { label: "Biometric", className: "bg-pink-500/15 text-pink-500 border-0 font-medium" }
};

const STATUS_STYLES: Record<AttendanceStatus, { label: string; className: string }> = {
  PRESENT: { label: "Present", className: "bg-success/15 text-success border-0 font-medium" },
  ABSENT: { label: "Absent", className: "bg-destructive/15 text-destructive border-0 font-medium" },
  ON_LEAVE: { label: "On Leave", className: "bg-warning/15 text-warning border-0 font-medium" }
};

export const attendanceLogColumns: ColumnDef<AttendanceLogRow>[] = [
  {
    accessorKey: "worker",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Worker" />,
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.worker}</span>
  },
  {
    accessorKey: "site",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Site" />,
    cell: ({ row }) => (
      <span className="text-sm text-primary hover:underline cursor-pointer">{row.original.site}</span>
    )
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.date}</span>
  },
  {
    accessorKey: "checkIn",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Check In" />,
    cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.checkIn ?? "—"}</span>
  },
  {
    accessorKey: "checkOut",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Check Out" />,
    cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.checkOut ?? "—"}</span>
  },
  {
    accessorKey: "hours",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Hours" />,
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">{row.original.hours > 0 ? `${row.original.hours} hrs` : "0 hrs"}</span>
    )
  },
  {
    accessorKey: "method",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Method" />,
    cell: ({ row }) => {
      const s = METHOD_STYLES[row.original.method];
      return <Badge className={s.className}>{s.label}</Badge>;
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const s = STATUS_STYLES[row.original.status];
      return <Badge className={s.className}>{s.label}</Badge>;
    }
  },
  {
    id: "edit",
    header: () => <span className="text-xs text-muted-foreground font-medium">Edit</span>,
    cell: () => <span className="text-sm text-primary hover:underline cursor-pointer">Edit</span>
  }
];
