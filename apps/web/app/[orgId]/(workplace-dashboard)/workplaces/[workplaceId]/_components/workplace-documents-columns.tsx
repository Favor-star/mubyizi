import { IconDownload, IconEye, IconSwitch3 } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { WorkplaceDocumentRow } from "./types";

const FORMAT_STYLES: Record<WorkplaceDocumentRow["format"], string> = {
  PDF: "bg-destructive/20 text-destructive",
  IMG: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  DOC: "bg-violet-500/20 text-violet-600 dark:text-violet-400"
};

const EXPIRY_STYLES: Record<WorkplaceDocumentRow["expiryStatus"], string> = {
  valid: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  expired: "text-destructive",
  none: "text-muted-foreground"
};

export const workplaceDocumentColumns: ColumnDef<WorkplaceDocumentRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center text-[10px] font-bold ${FORMAT_STYLES[row.original.format]}`}>
          {row.original.format}
        </div>
        <span className="text-sm font-medium leading-tight">{row.original.name}</span>
      </div>
    )
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>
  },
  {
    accessorKey: "worker",
    header: "Worker",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.worker}</span>
  },
  {
    accessorKey: "expires",
    header: "Expires",
    cell: ({ row }) => (
      <span className={`text-sm ${EXPIRY_STYLES[row.original.expiryStatus]}`}>{row.original.expires ?? "—"}</span>
    )
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    cell: ({ row }) =>
      row.original.expiryStatus === "expired" ? (
        <div className="text-end">
          <Button size="sm" variant="link">
            <IconSwitch3 />
            Renew
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-end gap-1">
          <Button size="sm" variant="link">
            <IconEye />
            View
          </Button>
          <Button size="sm" variant="link">
            <IconDownload />
            Download
          </Button>
        </div>
      )
  }
];
