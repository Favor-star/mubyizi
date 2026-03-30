"use client";

import React from "react";
import {
  IconCalendar,
  IconCash,
  IconCheck,
  IconChevronDown,
  IconFileDescription,
  IconPaperclip,
  IconReceipt,
  IconX
} from "@tabler/icons-react";
import { format } from "date-fns";
import { DialogWrapper } from "@/shared/components/dialog-wrapper";
import { DialogClose, DialogFooter } from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  FieldLegend
} from "@workspace/ui/components/field";
import { Badge } from "@workspace/ui/components/badge";
import type { TransactionCategory } from "./types";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@workspace/ui/components/input-group";

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentMethod = "cash" | "bank_transfer" | "mobile_money" | "cheque" | "card";

interface ExpenseForm {
  date: Date;
  description: string;
  category: TransactionCategory | "";
  amount: string;
  paymentMethod: PaymentMethod | "";
  vendorReference: string;
  notes: string;
  receipt: File | null;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORIES: { value: TransactionCategory; label: string }[] = [
  { value: "labor", label: "Labor" },
  { value: "materials", label: "Materials" },
  { value: "equipment", label: "Equipment" }
];

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "cheque", label: "Cheque" },
  { value: "card", label: "Card" }
];

const INITIAL_FORM: ExpenseForm = {
  date: new Date(),
  description: "",
  category: "",
  amount: "",
  paymentMethod: "",
  vendorReference: "",
  notes: "",
  receipt: null
};

// ─── Amount helpers ───────────────────────────────────────────────────────────

function parseAmount(raw: string): number {
  return Math.round(parseFloat(raw.replace(/,/g, "")) * 100) || 0;
}

function formatReceiptSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function RecordExpenseForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = React.useState<ExpenseForm>(INITIAL_FORM);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [receiptPreview, setReceiptPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const patch = (updates: Partial<ExpenseForm>) => setForm((prev) => ({ ...prev, ...updates }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    patch({ receipt: file });
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setReceiptPreview(url);
    } else {
      setReceiptPreview(null);
    }
  };

  const removeReceipt = () => {
    if (receiptPreview) URL.revokeObjectURL(receiptPreview);
    patch({ receipt: null });
    setReceiptPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isValid =
    form.description.trim().length > 0 &&
    form.category !== "" &&
    form.amount.trim().length > 0 &&
    parseAmount(form.amount) > 0;

  const handleSubmit = () => {
    const payload = {
      date: form.date.toISOString(),
      description: form.description,
      category: form.category,
      amount: parseAmount(form.amount),
      paymentMethod: form.paymentMethod || null,
      vendorReference: form.vendorReference || null,
      notes: form.notes || null,
      receiptName: form.receipt?.name ?? null
    };
    // TODO: wire up to POST /api/v1/workplaces/:workplaceId/budget/transactions
    console.log("Record expense payload:", payload);
    onSuccess();
  };

  return (
    <div className="space-y-0">
      <div className="max-h-[65vh] overflow-y-auto scrollbar_styles px-1 pb-2 space-y-4">
        <FieldGroup>
          {/* ── Row 1: Date + Category ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="exp-date">
                Date <span className="text-destructive ml-0.5">*</span>
              </FieldLabel>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button id="exp-date" variant="outline" className="w-full justify-between font-normal text-left">
                    {format(form.date, "PPP")}
                    <IconCalendar size={16} className="text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.date}
                    onSelect={(d) => {
                      if (d) {
                        patch({ date: d });
                        setCalendarOpen(false);
                      }
                    }}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FieldDescription>When the expense was incurred.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="exp-category">
                Category <span className="text-destructive ml-0.5">*</span>
              </FieldLabel>
              <Select value={form.category} onValueChange={(v) => patch({ category: v as TransactionCategory })}>
                <SelectTrigger id="exp-category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {CATEGORIES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>Type of expense.</FieldDescription>
            </Field>
          </div>

          {/* ── Description ── */}
          <Field>
            <FieldLabel htmlFor="exp-desc">
              Description <span className="text-destructive ml-0.5">*</span>
            </FieldLabel>
            <Textarea
              id="exp-desc"
              placeholder="e.g. Concrete delivery – BuildMax Inc, Week 42 payroll…"
              rows={2}
              value={form.description}
              onChange={(e) => patch({ description: e.target.value })}
              className="resize-none"
            />
            <FieldDescription>Brief summary of what was purchased or paid.</FieldDescription>
          </Field>

          {/* ── Row 2: Amount + Payment method ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="exp-amount">
                Amount <span className="text-destructive ml-0.5">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon align={"inline-start"}>$</InputGroupAddon>
                <InputGroupInput
                  id="exp-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-7"
                  value={form.amount}
                  onChange={(e) => patch({ amount: e.target.value })}
                />
              </InputGroup>
              <FieldDescription>Total amount in USD.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="exp-payment">Payment method</FieldLabel>
              <Select value={form.paymentMethod} onValueChange={(v) => patch({ paymentMethod: v as PaymentMethod })}>
                <SelectTrigger id="exp-payment" className="w-full">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {PAYMENT_METHODS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>How the payment was made.</FieldDescription>
            </Field>
          </div>

          <FieldSeparator />

          {/* ── Vendor / reference ── */}
          <Field>
            <FieldLabel htmlFor="exp-ref">Vendor / Reference</FieldLabel>
            <Input
              id="exp-ref"
              placeholder="e.g. PO-2024-0042, BuildMax Inc, Invoice #1234"
              value={form.vendorReference}
              onChange={(e) => patch({ vendorReference: e.target.value })}
            />
            <FieldDescription>Supplier name, PO number, or invoice reference (optional).</FieldDescription>
          </Field>

          {/* ── Notes ── */}
          <Field>
            <FieldLabel htmlFor="exp-notes">Additional notes</FieldLabel>
            <Textarea
              id="exp-notes"
              placeholder="Any extra context — delivery conditions, split billing details, approver name…"
              rows={2}
              value={form.notes}
              onChange={(e) => patch({ notes: e.target.value })}
              className="resize-none"
            />
          </Field>

          <FieldSeparator />

          {/* ── Receipt upload ── */}
          <FieldSet>
            <FieldLegend>Receipt</FieldLegend>
            <FieldDescription>Attach a photo or scan of the receipt for audit purposes.</FieldDescription>

            {form.receipt ? (
              <div className="mt-2 flex items-start gap-3 p-3 rounded-md border border-border bg-muted/30">
                {receiptPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={receiptPreview}
                    alt="Receipt preview"
                    className="h-16 w-16 rounded object-cover shrink-0 border border-border"
                  />
                ) : (
                  <div className="h-16 w-16 rounded border border-border bg-muted flex items-center justify-center shrink-0">
                    <IconFileDescription size={24} className="text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{form.receipt.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatReceiptSize(form.receipt.size)}</p>
                  <Badge variant="outline" className="mt-1.5 text-[10px] h-4 gap-1">
                    <IconCheck size={10} />
                    Attached
                  </Badge>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={removeReceipt} className="shrink-0">
                  <IconX size={14} />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 w-full flex flex-col items-center gap-2 rounded-md border border-dashed border-border p-6 text-center transition-colors hover:bg-muted/30 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <IconPaperclip size={20} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to attach receipt</span>
                <span className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10 MB</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </FieldSet>
        </FieldGroup>
      </div>

      <DialogFooter className="pt-4 border-t border-border mt-4">
        <p className="text-xs text-muted-foreground flex-1">
          Submitted expenses are marked <span className="font-medium text-foreground">pending</span> until approved by a
          manager.
        </p>
        <div className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline">
              <IconX size={16} />
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={!isValid}>
            <IconReceipt size={16} />
            Record expense
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function RecordExpenseDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <DialogWrapper
      trigger={trigger}
      title={
        <span className="flex items-center gap-2">
          <IconReceipt size={18} />
          Record Expense
        </span>
      }
      description="Log a new expense against this workplace's budget. All entries are pending manager approval.">
      <RecordExpenseForm onSuccess={() => setOpen(false)} />
    </DialogWrapper>
  );
}
