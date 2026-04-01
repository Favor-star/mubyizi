"use client";
import React from "react";
import { IconCalendar, IconCloudUpload, IconFileDescription, IconUpload, IconX } from "@tabler/icons-react";
import { DialogWrapper } from "@/shared/components/dialog-wrapper";
import { Button } from "@workspace/ui/components/button";
import { DialogFooter } from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet
} from "@workspace/ui/components/field";
import type { WorkplaceDocType } from "../../_components/types";
// ─── Config ───────────────────────────────────────────────────────────────────

const DOC_TYPES: { value: WorkplaceDocType; label: string; description: string }[] = [
  { value: "Contract", label: "Contract", description: "Legal or employment agreements" },
  { value: "Certification", label: "Certification", description: "Trade or safety certifications" },
  { value: "HR Policy", label: "HR Policy", description: "Internal HR policies and procedures" },
  { value: "Safety", label: "Safety", description: "Safety checklists and compliance docs" }
];

const MOCK_WORKERS = [
  { id: "1", name: "Jean Pierre Habimana", jobTitle: "Site Foreman" },
  { id: "2", name: "Alice Uwimana", jobTitle: "Electrician" },
  { id: "3", name: "Robert Mugisha", jobTitle: "Plumber" },
  { id: "4", name: "Grace Ineza", jobTitle: "Civil Engineer" },
  { id: "5", name: "Diane Mukamana", jobTitle: "Safety Officer" },
  { id: "6", name: "Eric Habimana", jobTitle: "Carpenter" }
];

// ─── Mock queued file ─────────────────────────────────────────────────────────

interface MockDocFile {
  id: string;
  name: string;
  size: string;
}

const INITIAL_FILE: MockDocFile = {
  id: "1",
  name: "safety-checklist-q4.pdf",
  size: "340 KB"
};

// ─── Modal ────────────────────────────────────────────────────────────────────

export function UploadDocumentModal() {
  const [file, setFile] = React.useState<MockDocFile | null>(INITIAL_FILE);
  const [title, setTitle] = React.useState("");
  const [docType, setDocType] = React.useState<WorkplaceDocType>("Safety");
  const [workerId, setWorkerId] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState("");
  const [notes, setNotes] = React.useState("");

  return (
    <DialogWrapper
      trigger={
        <Button size="lg" variant="default">
          <IconUpload />
          Upload document
        </Button>
      }
      title="Upload document"
      description="Add a contract, certification, policy, or safety document to this workplace.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: drop zone + queued file ── */}
        <div className="space-y-3">
          {/* Drop zone */}
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/20 px-6 py-10 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-colors">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <IconCloudUpload size={20} />
            </div>
            <div>
              <p className="text-sm font-medium">Drop a file here or browse</p>
              <p className="text-xs text-muted-foreground mt-0.5">PDF, DOCX, XLSX — up to 25 MB</p>
            </div>
            <Button variant="outline" size="sm" className="mt-1">
              Browse files
            </Button>
          </div>

          {/* Queued file */}
          {file ? (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Selected file</p>
              <div className="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-background group hover:bg-muted/30 transition-colors">
                <div className="h-8 w-8 rounded shrink-0 bg-muted flex items-center justify-center text-muted-foreground">
                  <IconFileDescription size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground">{file.size}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setFile(null)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <IconX size={12} />
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-center text-muted-foreground py-2">No file selected. Use the drop zone above.</p>
          )}
        </div>

        {/* ── Right: metadata fields ── */}
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Document details</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="doc-title">
                  Document title <span className="text-destructive ml-0.5">*</span>
                </FieldLabel>
                <Input
                  id="doc-title"
                  placeholder="e.g. Q4 Safety Inspection Checklist"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="doc-type">Document type</FieldLabel>
                <Select value={docType} onValueChange={(v) => setDocType(v as WorkplaceDocType)}>
                  <SelectTrigger id="doc-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {DOC_TYPES.map(({ value, label, description }) => (
                      <SelectItem key={value} value={value}>
                        <span>{label}</span>
                        <span className="text-muted-foreground ml-2 text-xs">— {description}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>Category determines where this document appears.</FieldDescription>
              </Field>

              <FieldSeparator />

              <Field>
                <FieldLabel htmlFor="doc-worker">Assigned worker</FieldLabel>
                <Select value={workerId} onValueChange={setWorkerId}>
                  <SelectTrigger id="doc-worker" className="w-full">
                    <SelectValue placeholder="Select a worker (optional)" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {MOCK_WORKERS.map(({ id, name, jobTitle }) => (
                      <SelectItem key={id} value={id}>
                        <span>{name}</span>
                        <span className="text-muted-foreground ml-2 text-xs">— {jobTitle}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>Link this document to a specific worker (optional).</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="doc-expiry">Expiry date</FieldLabel>
                <div className="relative">
                  <IconCalendar
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    id="doc-expiry"
                    type="date"
                    className="pl-9"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
                <FieldDescription>Leave blank if this document does not expire.</FieldDescription>
              </Field>

              <FieldSeparator />

              <Field>
                <FieldLabel htmlFor="doc-notes">Notes</FieldLabel>
                <Textarea
                  id="doc-notes"
                  placeholder="Any additional context about this document…"
                  className="resize-none"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <FieldDescription>Optional — visible only to managers and above.</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </div>

      <DialogFooter className="mt-6">
        <Button disabled={!file || !title.trim()}>Upload document</Button>
      </DialogFooter>
    </DialogWrapper>
  );
}
