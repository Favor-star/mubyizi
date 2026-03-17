"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IconLayoutGrid, IconList } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { DataTable } from "@/shared/components/data-table";
import { DataTablePagination, type PaginationMeta } from "@/shared/components/data-table-pagination";
import { useGeneralTable } from "@/hooks/use-general-table";
import { documentColumns, type DocumentRow } from "./documents-columns";

const MOCK_DOCUMENTS: DocumentRow[] = [
  {
    id: "1",
    name: "Employment Contract — John Mwangi",
    format: "PDF",
    type: "Contract",
    workerOrSite: "John Mwangi / Site A",
    expires: "2026-12-31",
    expiryStatus: "valid"
  },
  {
    id: "2",
    name: "Forklift Operator Certification",
    format: "PDF",
    type: "Certification",
    workerOrSite: "Alice Kamau / Site B",
    expires: "2026-04-10",
    expiryStatus: "warning"
  },
  {
    id: "3",
    name: "Site Safety Induction — Mombasa",
    format: "DOC",
    type: "Safety",
    workerOrSite: "Site C — Mombasa Port",
    expires: null,
    expiryStatus: "none"
  },
  {
    id: "4",
    name: "HR Policy v3.2",
    format: "DOC",
    type: "HR Policy",
    workerOrSite: "All Sites",
    expires: "2027-01-01",
    expiryStatus: "valid"
  },
  {
    id: "5",
    name: "First Aid Certificate — Peter Otieno",
    format: "IMG",
    type: "Certification",
    workerOrSite: "Peter Otieno / Site D",
    expires: "2026-02-28",
    expiryStatus: "expired"
  },
  {
    id: "6",
    name: "Equipment Lease Agreement",
    format: "PDF",
    type: "Contract",
    workerOrSite: "Site E — Nakuru Farm",
    expires: "2026-04-05",
    expiryStatus: "warning"
  },
  {
    id: "7",
    name: "Annual Leave Policy",
    format: "DOC",
    type: "HR Policy",
    workerOrSite: "All Sites",
    expires: null,
    expiryStatus: "none"
  }
];

const FILTER_TABS = ["All", "Contracts", "Certifications", "HR Policy", "Safety"];

export function DocumentsTable() {
  const { table, page, limit, setPage, setLimit } = useGeneralTable(MOCK_DOCUMENTS, documentColumns);

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
      <CardHeader className="">
        {/* Controls row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 flex-wrap">
            {FILTER_TABS.map((tab, i) => (
              <Button key={tab} size="sm" variant={i === 0 ? "outline" : "ghost"}>
                {tab}
              </Button>
            ))}
          </div>
          {/* View toggle */}
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
          columns={documentColumns}
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
