"use client";

import React from "react";
import {
  IconSearch,
  IconUsers,
  IconArrowLeft,
  IconClock,
  IconLoader2
} from "@tabler/icons-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import { Textarea } from "@workspace/ui/components/textarea";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@workspace/ui/components/input-group";
import type { AttendanceRow, AttendanceEdit, AttendanceStatus, ApprovalStatus } from "./types";

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; dotClass: string; textClass: string }> = {
  NOT_MARKED: { label: "Not Marked", dotClass: "bg-muted-foreground/50", textClass: "text-muted-foreground" },
  PRESENT: { label: "Present", dotClass: "bg-success", textClass: "text-success" },
  ABSENT: { label: "Absent", dotClass: "bg-destructive", textClass: "text-destructive" },
  HALF_DAY: { label: "Half Day", dotClass: "bg-primary", textClass: "text-primary" },
  LATE: { label: "Late", dotClass: "bg-warning", textClass: "text-warning" },
  ON_LEAVE: { label: "On Leave", dotClass: "bg-violet-500", textClass: "text-violet-500" },
  SICK: { label: "Sick", dotClass: "bg-rose-400", textClass: "text-rose-400" }
};
const ALL_STATUSES = Object.keys(STATUS_CONFIG) as AttendanceStatus[];

// ─── Approval badge ────────────────────────────────────────────────────────────

const APPROVAL_VARIANTS: Record<ApprovalStatus, string> = {
  PENDING: "border-warning text-warning bg-warning/10",
  APPROVED: "border-success text-success bg-success/10",
  REJECTED: "border-destructive text-destructive bg-destructive/10"
};

function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  return (
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${APPROVAL_VARIANTS[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}

// ─── Currency / time helpers ──────────────────────────────────────────────────

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function formatTime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Initials avatar ──────────────────────────────────────────────────────────

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
      {initials}
    </span>
  );
}

// ─── Save bar ─────────────────────────────────────────────────────────────────

function SaveBar({
  editCount,
  isSaving,
  onSave,
  onDiscard
}: {
  editCount: number;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="rounded bg-muted/40 p-3 mt-auto shrink-0">
      <p className="text-xs text-muted-foreground mb-2">
        <span className="font-semibold text-foreground">{editCount}</span>{" "}
        {editCount === 1 ? "row" : "rows"} with unsaved changes
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onDiscard} disabled={isSaving} className="flex-1">
          Discard
        </Button>
        <Button size="sm" onClick={onSave} disabled={isSaving} className="flex-1">
          {isSaving ? (
            <>
              <IconLoader2 size={13} className="animate-spin" />
              Saving…
            </>
          ) : (
            "Save Sheet"
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type AttendancePanelProps = {
  mode: "default" | "bulk" | "detail";

  // shared
  isDirty: boolean;
  editCount: number;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;

  // default + bulk
  searchQuery: string;
  onSearchChange: (v: string) => void;
  statusFilter: AttendanceStatus | "all";
  onStatusFilterChange: (v: AttendanceStatus | "all") => void;

  // bulk
  selectedCount: number;
  bulkNote: string;
  onBulkNoteChange: (v: string) => void;
  onApplyBulkNote: () => void;
  bulkStatus: AttendanceStatus | "";
  onBulkStatusChange: (v: AttendanceStatus | "") => void;
  onApplyBulkStatus: () => void;
  onMarkPresent: () => void;

  // detail
  worker: AttendanceRow | null;
  onBack: () => void;
  onEditWorker: (patch: Partial<AttendanceEdit>) => void;
};

// ─── Panel ────────────────────────────────────────────────────────────────────

export function AttendancePanel(props: AttendancePanelProps) {
  const {
    mode,
    isDirty,
    editCount,
    isSaving,
    onSave,
    onDiscard,
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    selectedCount,
    bulkNote,
    onBulkNoteChange,
    onApplyBulkNote,
    bulkStatus,
    onBulkStatusChange,
    onApplyBulkStatus,
    onMarkPresent,
    worker,
    onBack,
    onEditWorker
  } = props;

  return (
    <div className="bg-sidebar border rounded-lg flex flex-col gap-4 p-4 sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
      {mode === "default" && (
        <>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Filters</p>
            <div className="flex flex-col gap-2">
              <InputGroup>
                <InputGroupAddon>
                  <IconSearch strokeWidth={1.5} size={15} />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Search by name or ID…"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </InputGroup>
              <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as AttendanceStatus | "all")}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_CONFIG[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Bulk Actions</p>
            <p className="text-xs text-muted-foreground">Select rows in the table to edit them here.</p>
          </div>

          <div className="flex-1" />

          {isDirty && (
            <SaveBar editCount={editCount} isSaving={isSaving} onSave={onSave} onDiscard={onDiscard} />
          )}
        </>
      )}

      {mode === "bulk" && (
        <>
          <div className="flex items-center gap-2">
            <IconUsers size={16} className="text-muted-foreground shrink-0" />
            <p className="text-sm font-semibold">
              <span className="text-foreground">{selectedCount}</span> workers selected
            </p>
          </div>

          <Separator />

          <div>
            <p className="text-xs font-medium mb-1.5">Set Status</p>
            <div className="flex gap-2">
              <Select value={bulkStatus} onValueChange={(v) => onBulkStatusChange(v as AttendanceStatus | "")}>
                <SelectTrigger className="bg-background flex-1">
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      <span className="flex items-center gap-2">
                        <span className={`inline-block h-2 w-2 rounded-full ${STATUS_CONFIG[s].dotClass}`} />
                        {STATUS_CONFIG[s].label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={onApplyBulkStatus} disabled={!bulkStatus}>
                Apply
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs font-medium mb-1.5">Bulk Note</p>
            <Textarea
              placeholder="Type a note for selected workers…"
              value={bulkNote}
              onChange={(e) => onBulkNoteChange(e.target.value)}
              rows={3}
              className="text-xs resize-none"
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={onApplyBulkNote}
              disabled={!bulkNote.trim()}>
              Apply to selected
            </Button>
          </div>

          <Separator />

          <Button variant="outline" size="sm" onClick={onMarkPresent} className="w-full">
            Mark all present
          </Button>

          <div className="flex-1" />

          {isDirty && (
            <SaveBar editCount={editCount} isSaving={isSaving} onSave={onSave} onDiscard={onDiscard} />
          )}
        </>
      )}

      {mode === "detail" && worker && (
        <>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 -ml-2 text-xs h-7">
              <IconArrowLeft size={13} />
              Back
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <InitialsAvatar name={worker.name} />
            <div className="min-w-0">
              <p className="font-semibold text-sm leading-tight truncate">{worker.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {worker.workerId} · {worker.role}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            {/* Status */}
            <div>
              <p className="text-xs font-medium mb-1">Status</p>
              <Select
                value={worker.status}
                onValueChange={(v) => onEditWorker({ status: v as AttendanceStatus })}>
                <SelectTrigger className="h-8 text-xs bg-background">
                  <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${STATUS_CONFIG[worker.status].dotClass}`} />
                  <SelectValue>
                    <span className={`text-xs ${STATUS_CONFIG[worker.status].textClass}`}>
                      {STATUS_CONFIG[worker.status].label}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      <span className="flex items-center gap-2">
                        <span className={`inline-block h-2 w-2 rounded-full ${STATUS_CONFIG[s].dotClass}`} />
                        <span className={STATUS_CONFIG[s].textClass}>{STATUS_CONFIG[s].label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Shift */}
            <div>
              <p className="text-xs font-medium mb-1">Shift</p>
              <Select
                value={worker.shiftLabel || "none"}
                onValueChange={(v) => onEditWorker({ shiftLabel: v === "none" ? undefined : v })}>
                <SelectTrigger className="h-8 text-xs bg-background">
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
            </div>

            {/* Notes */}
            <div>
              <p className="text-xs font-medium mb-1">Notes</p>
              <Textarea
                placeholder="Add a note…"
                value={worker.notes ?? ""}
                onChange={(e) => onEditWorker({ notes: e.target.value })}
                rows={3}
                className="text-xs resize-none"
              />
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <IconClock size={13} />
                Check-in
              </span>
              <span className="text-xs font-medium">{formatTime(worker.checkIn)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <IconClock size={13} />
                Check-out
              </span>
              <span className="text-xs font-medium">{formatTime(worker.checkOut)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Hours worked</span>
              <span className="text-xs font-medium">
                {worker.hoursWorked != null ? `${worker.hoursWorked}h` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Amount earned</span>
              <span className="text-xs font-medium">
                {worker.amountEarned != null ? formatCurrency(worker.amountEarned) : "—"}
              </span>
            </div>
          </div>

          {worker.approvalStatus && (
            <>
              <Separator />
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Approval</span>
                  <ApprovalBadge status={worker.approvalStatus} />
                </div>
                {worker.approvalStatus === "REJECTED" && worker.rejectionReason && (
                  <p className="text-[11px] text-destructive">{worker.rejectionReason}</p>
                )}
              </div>
            </>
          )}

          <div className="flex-1" />

          {isDirty && (
            <SaveBar editCount={editCount} isSaving={isSaving} onSave={onSave} onDiscard={onDiscard} />
          )}
        </>
      )}
    </div>
  );
}
