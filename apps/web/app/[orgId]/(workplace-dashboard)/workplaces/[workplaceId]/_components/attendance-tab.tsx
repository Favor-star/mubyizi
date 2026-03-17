"use client";

import React from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  RowSelectionState,
  useReactTable
} from "@tanstack/react-table";
import {
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconUserQuestion
} from "@tabler/icons-react";
import { DataTable } from "@/shared/components/data-table";
import { DataTablePagination } from "@/shared/components/data-table-pagination";
import { StatCard } from "@/shared/components/stat-card";
import { attendanceColumns, type AttendanceTableMeta } from "./attendance-columns";
import { AttendancePanel } from "./attendance-panel";
import { mockAttendanceRows, computeAttendanceSummary } from "./_mock/attendance";
import type { AttendanceEdit, AttendanceRow, AttendanceStatus } from "./types";

const PAGE_SIZE = 10;

export function AttendanceTab({ date }: { date: string }) {
  const [edits, setEdits] = React.useState<Record<string, AttendanceEdit>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<AttendanceStatus | "all">("all");
  const [viewingUserId, setViewingUserId] = React.useState<string | null>(null);
  const [bulkNote, setBulkNote] = React.useState("");
  const [bulkStatus, setBulkStatus] = React.useState<AttendanceStatus | "">("");

  function setEdit(userId: string, patch: Partial<AttendanceEdit>) {
    setEdits((prev) => ({ ...prev, [userId]: { ...prev[userId], ...patch } }));
  }

  // Merge base rows with edits for display
  const effectiveRows: AttendanceRow[] = React.useMemo(
    () => mockAttendanceRows.map((r) => ({ ...r, ...edits[r.userId] })),
    [edits]
  );

  const filteredRows = React.useMemo(() => {
    return effectiveRows.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!r.name.toLowerCase().includes(q) && !r.workerId.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      return true;
    });
  }, [effectiveRows, searchQuery, statusFilter]);

  const summary = React.useMemo(() => computeAttendanceSummary(effectiveRows, date), [effectiveRows, date]);

  const isDirty = Object.keys(edits).length > 0;
  const editCount = Object.keys(edits).length;

  const table = useReactTable({
    data: filteredRows,
    columns: attendanceColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: { sorting, rowSelection },
    initialState: { pagination: { pageSize: PAGE_SIZE } },
    meta: { edits, setEdit, onViewWorker: setViewingUserId } satisfies AttendanceTableMeta
  });

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
  const paginationMeta = {
    page: table.getState().pagination.pageIndex + 1,
    limit: PAGE_SIZE,
    totalItems: filteredRows.length,
    totalPages,
    hasNextPage: table.getCanNextPage(),
    hasPrevPage: table.getCanPreviousPage()
  };

  // Map row-index-keyed selection to userIds via filteredRows
  const selectedUserIds = Object.keys(rowSelection)
    .filter((k) => rowSelection[k])
    .map((idx) => filteredRows[Number(idx)]?.userId)
    .filter((id): id is string => Boolean(id));

  // Derived panel mode
  const panelMode = viewingUserId ? "detail" : selectedUserIds.length > 0 ? "bulk" : "default";

  // Detail worker: find in effectiveRows (not filtered, so eye works even after filter change)
  const viewingWorker = viewingUserId
    ? effectiveRows.find((r) => r.userId === viewingUserId) ?? null
    : null;

  function handleApplyBulkNote() {
    selectedUserIds.forEach((uid) => setEdit(uid, { notes: bulkNote }));
    setBulkNote("");
  }

  function handleApplyBulkStatus() {
    if (!bulkStatus) return;
    selectedUserIds.forEach((uid) => setEdit(uid, { status: bulkStatus as AttendanceStatus }));
    setBulkStatus("");
  }

  function markPresent() {
    if (selectedUserIds.length > 0) {
      selectedUserIds.forEach((uid) => setEdit(uid, { status: "PRESENT" }));
    } else {
      filteredRows.forEach((r) => setEdit(r.userId, { status: "PRESENT" }));
    }
  }

  async function handleSave() {
    setIsSaving(true);
    await new Promise((res) => setTimeout(res, 1200));
    setEdits({});
    setRowSelection({});
    setViewingUserId(null);
    setIsSaving(false);
  }

  function handleDiscard() {
    setEdits({});
    setRowSelection({});
    setViewingUserId(null);
  }

  return (
    <div className="p-4 space-y-4">
      {/* Stat cards — full width */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Total Workers"
          value={`${summary.totalWorkers}`}
          color="var(--primary)"
          icon={IconUsers}
        />
        <StatCard
          title="Present"
          value={`${summary.present}`}
          color="var(--success)"
          icon={IconUserCheck}
        />
        <StatCard
          title="Absent"
          value={`${summary.absent}`}
          color="var(--destructive)"
          icon={IconUserX}
        />
        <StatCard
          title="Not Marked"
          value={`${summary.notMarked}`}
          color="var(--muted-foreground)"
          icon={IconUserQuestion}
        />
      </section>

      {/* 2-col grid */}
      <div className="grid grid-cols-3 gap-4 items-start">
        {/* Left — table (2/3) */}
        <div className="col-span-2">
          <DataTable
            table={table}
            columns={attendanceColumns}
            pagination={
              <DataTablePagination
                meta={paginationMeta}
                limit={PAGE_SIZE}
                page={paginationMeta.page}
                setLimit={() => {}}
                setPage={(p) => table.setPageIndex(p - 1)}
                table={table}
              />
            }
          />
        </div>

        {/* Right — panel (1/3) */}
        <div className="col-span-1">
          <AttendancePanel
            mode={panelMode}
            isDirty={isDirty}
            editCount={editCount}
            isSaving={isSaving}
            onSave={handleSave}
            onDiscard={handleDiscard}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            selectedCount={selectedUserIds.length}
            bulkNote={bulkNote}
            onBulkNoteChange={setBulkNote}
            onApplyBulkNote={handleApplyBulkNote}
            bulkStatus={bulkStatus}
            onBulkStatusChange={setBulkStatus}
            onApplyBulkStatus={handleApplyBulkStatus}
            onMarkPresent={markPresent}
            worker={viewingWorker}
            onBack={() => setViewingUserId(null)}
            onEditWorker={(patch) => viewingUserId && setEdit(viewingUserId, patch)}
          />
        </div>
      </div>
    </div>
  );
}
