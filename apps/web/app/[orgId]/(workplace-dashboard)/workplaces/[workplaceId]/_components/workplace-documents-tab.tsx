"use client";

import {
  IconAlertTriangle,
  IconCircleCheck,
  IconClockX,
  IconFileText,
  IconFolderOpen,
  IconLayoutGrid,
  IconList,
  IconPlus,
  IconUpload
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { DataTable } from "@/shared/components/data-table";
import { DataTablePagination, type PaginationMeta } from "@/shared/components/data-table-pagination";
import { StatCard } from "@/shared/components/stat-card";
import { useGeneralTable } from "@/hooks/use-general-table";
import { workplaceDocumentColumns } from "./workplace-documents-columns";
import { WorkplaceDocumentRow } from "./types";

const MOCK_DOCUMENTS: WorkplaceDocumentRow[] = [
  {
    id: "1",
    name: "Employment Contract — John Mwangi",
    format: "PDF",
    type: "Contract",
    worker: "John Mwangi",
    expires: "2026-12-31",
    expiryStatus: "valid"
  },
  {
    id: "2",
    name: "Forklift Operator Certification",
    format: "PDF",
    type: "Certification",
    worker: "Alice Kamau",
    expires: "2026-04-10",
    expiryStatus: "warning"
  },
  {
    id: "3",
    name: "Site Safety Induction",
    format: "DOC",
    type: "Safety",
    worker: "All Workers",
    expires: null,
    expiryStatus: "none"
  },
  {
    id: "4",
    name: "First Aid Certificate — Peter Otieno",
    format: "IMG",
    type: "Certification",
    worker: "Peter Otieno",
    expires: "2026-02-28",
    expiryStatus: "expired"
  },
  {
    id: "5",
    name: "Equipment Lease Agreement",
    format: "PDF",
    type: "Contract",
    worker: "Site Management",
    expires: "2026-04-05",
    expiryStatus: "warning"
  },
  {
    id: "6",
    name: "HR Policy v3.2",
    format: "DOC",
    type: "HR Policy",
    worker: "All Workers",
    expires: "2027-01-01",
    expiryStatus: "valid"
  }
];

const CATEGORY_FOLDERS = [
  { name: "All Documents", count: 6, active: true },
  { name: "Contracts", count: 2 },
  { name: "Certifications", count: 2 },
  { name: "HR Policies", count: 1 },
  { name: "Safety & Compliance", count: 1 },
  { name: "Payslips & Finance", count: 0 }
];

const FILTER_TABS = ["All", "Contracts", "Certifications", "HR Policy", "Safety"];

function CategoriesPanel() {
  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold">Categories</CardTitle>
        <Button size="sm" variant="outline">
          <IconPlus className="h-3.5 w-3.5 mr-1" />
          New Folder
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ul>
          {CATEGORY_FOLDERS.map((folder) => (
            <li key={folder.name}>
              <div
                className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer ${
                  folder.active ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                }`}>
                <span className="truncate">{folder.name}</span>
                <span
                  className={`ml-2 shrink-0 text-xs ${
                    folder.active ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}>
                  {folder.count}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="px-4 pt-3 pb-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Expiring Soon</p>
        </div>
        <ul className="pb-2">
          <li>
            <div className="flex items-center justify-between px-4 py-2 text-sm hover:bg-muted cursor-pointer">
              <span className="text-amber-600 dark:text-amber-400">Expires in 30 days</span>
              <span className="ml-2 shrink-0 text-xs text-amber-600 dark:text-amber-400">2</span>
            </div>
          </li>
          <li>
            <div className="flex items-center justify-between px-4 py-2 text-sm hover:bg-muted cursor-pointer">
              <span className="text-destructive">Expired</span>
              <span className="ml-2 shrink-0 text-xs text-destructive">1</span>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

function WorkplaceDocumentsTable() {
  const { table, page, limit, setPage, setLimit } = useGeneralTable(MOCK_DOCUMENTS, workplaceDocumentColumns);

  const totalPages = Math.ceil(MOCK_DOCUMENTS.length / limit);
  const meta: PaginationMeta = {
    page,
    limit,
    totalItems: MOCK_DOCUMENTS.length,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };

  return (
    <Card className="w-full h-fit">
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1 flex-wrap">
            {FILTER_TABS.map((tab, i) => (
              <Button key={tab} size="sm" variant={i === 0 ? "outline" : "ghost"}>
                {tab}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="default">
              <IconList />
              List
            </Button>
            <Button size="sm" variant="outline">
              <IconLayoutGrid />
              Grid
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <DataTable
          table={table}
          columns={workplaceDocumentColumns}
          pagination={
            <DataTablePagination
              meta={meta}
              table={table}
              page={page}
              limit={limit}
              setPage={setPage}
              setLimit={setLimit}
            />
          }
        />
      </CardContent>
    </Card>
  );
}

export function WorkplaceDocumentsTab() {
  return (
    <div className="bg-background px-8 py-4 space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Documents" value="6" icon={IconFileText} color="var(--primary)" />
        <StatCard title="Active / Valid" value="3" icon={IconCircleCheck} color="var(--chart-2)" />
        <StatCard title="Expiring Soon" value="2" icon={IconAlertTriangle} color="var(--chart-3)" />
        <StatCard title="Expired" value="1" icon={IconClockX} color="var(--destructive)" />
      </div>

      {/* Main content */}
      <article className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-4">
        <div className="space-y-4">
          {/* Upload area */}
          <div className="flex flex-col items-center justify-center gap-2 rounded border border-dashed border-border py-8 text-center">
            <IconUpload className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Upload Document</p>
              <p className="text-xs text-muted-foreground">Drag and drop files here, or browse to upload</p>
            </div>
            <Button size="sm" variant="outline" className="mt-1">
              Browse Files
              <IconFolderOpen />
            </Button>
          </div>
          <CategoriesPanel />
        </div>
        <WorkplaceDocumentsTable />
      </article>
    </div>
  );
}
