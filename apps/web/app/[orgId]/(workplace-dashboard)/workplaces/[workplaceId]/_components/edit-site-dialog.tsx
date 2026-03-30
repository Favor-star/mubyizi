"use client";

import React from "react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconDeviceFloppyFilled,
  IconEdit,
  IconFile,
  IconMap,
  IconMapPin,
  IconMapPin2,
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
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle
} from "@workspace/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { Badge } from "@workspace/ui/components/badge";
import { WorkplaceType, WorkplaceStatus } from "@workspace/api-client/enums";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@workspace/ui/components/input-group";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SiteForm {
  name: string;
  type: WorkplaceType;
  status: WorkplaceStatus;
  description: string;
  location: string;
  address: string;
  coordinates: string;
  startDate: Date | null;
  endDate: Date | null;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const WORKPLACE_TYPES: { value: WorkplaceType; label: string; description: string }[] = [
  { value: WorkplaceType.PROJECT, label: "Project", description: "Time-bound project (construction, event)" },
  { value: WorkplaceType.FACILITY, label: "Facility", description: "Ongoing facility (factory, warehouse, office)" },
  { value: WorkplaceType.FIELD, label: "Field", description: "Agricultural or outdoor field work" },
  { value: WorkplaceType.VENUE, label: "Venue", description: "Event or hospitality venue" },
  { value: WorkplaceType.ROUTE, label: "Route", description: "Delivery or transport route" },
  { value: WorkplaceType.OTHER, label: "Other", description: "Any other type of workplace" }
];

const STATUS_OPTIONS: {
  value: WorkplaceStatus;
  label: string;
}[] = [
  { value: WorkplaceStatus.NOT_STARTED, label: "Not Started" },
  { value: WorkplaceStatus.ACTIVE, label: "Active" },
  { value: WorkplaceStatus.ON_HOLD, label: "On Hold" },
  { value: WorkplaceStatus.COMPLETED, label: "Completed" },
  { value: WorkplaceStatus.CANCELLED, label: "Cancelled" }
];

const STEPS = [
  { number: 1, label: "Basic Info", description: "Name, type & status" },
  { number: 2, label: "Location", description: "Address & coordinates" },
  { number: 3, label: "Schedule", description: "Start & end dates" }
];

const INITIAL_FORM: SiteForm = {
  name: "",
  type: WorkplaceType.PROJECT,
  status: WorkplaceStatus.ACTIVE,
  description: "",
  location: "",
  address: "",
  coordinates: "",
  startDate: null,
  endDate: null
};

// ─── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border transition-colors ${
                step.number < currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : step.number === currentStep
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted-foreground bg-background"
              }`}>
              {step.number < currentStep ? <IconCheck size={14} /> : step.number}
            </div>
            <div className="text-center">
              <p
                className={`text-xs font-medium leading-tight ${step.number === currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground hidden sm:block leading-tight">{step.description}</p>
            </div>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`flex-1 h-px mx-3 mb-6 transition-colors ${step.number < currentStep ? "bg-primary" : "bg-border"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Date picker ───────────────────────────────────────────────────────────────

function DatePickerButton({
  id,
  value,
  onChange,
  placeholder = "Pick a date"
}: {
  id?: string;
  value: Date | null;
  onChange: (d: Date | null) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={`w-full justify-between font-normal ${!value ? "text-muted-foreground" : ""}`}>
          {value ? format(value, "PPP") : placeholder}
          <IconCalendar size={16} className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(d) => {
            onChange(d ?? null);
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// ─── Step content ──────────────────────────────────────────────────────────────

function Step1({ data, onChange }: { data: SiteForm; onChange: (p: Partial<SiteForm>) => void }) {
  return (
    <FieldGroup>
      {/* Name */}
      <Field>
        <FieldLabel htmlFor="site-name">
          Site name <span className="text-destructive ml-0.5">*</span>
        </FieldLabel>
        <Input
          id="site-name"
          placeholder="e.g. Kigali Convention Centre Renovation"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
        <FieldDescription>The display name for this workplace / site.</FieldDescription>
      </Field>

      {/* Description */}
      <Field>
        <FieldLabel htmlFor="site-desc">Description</FieldLabel>
        <Textarea
          id="site-desc"
          placeholder="Brief description of the project, scope, or objectives…"
          rows={3}
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="resize-none"
        />
      </Field>

      <FieldSeparator />

      {/* Type */}
      <FieldSet>
        <FieldLegend>
          Workplace type <span className="text-destructive ml-0.5">*</span>
        </FieldLegend>
        <FieldDescription>Describes the nature of this site.</FieldDescription>
        <RadioGroup
          value={data.type}
          onValueChange={(v) => onChange({ type: v as WorkplaceType })}
          className="grid-cols-1 sm:grid-cols-3 mt-2">
          {WORKPLACE_TYPES.map(({ value, label, description }) => (
            <FieldLabel key={value} htmlFor={`type-${value}`}>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{label}</FieldTitle>
                  <FieldDescription className="text-xs">{description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem value={value} id={`type-${value}`} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </FieldSet>

      <FieldSeparator />

      {/* Status */}
      <Field>
        <FieldLabel htmlFor="site-status">
          Status <span className="text-destructive ml-0.5">*</span>
        </FieldLabel>
        <Select value={data.status} onValueChange={(v) => onChange({ status: v as WorkplaceStatus })}>
          <SelectTrigger id="site-status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {STATUS_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>Current operational status of the site.</FieldDescription>
      </Field>
    </FieldGroup>
  );
}

function Step2({ data, onChange }: { data: SiteForm; onChange: (p: Partial<SiteForm>) => void }) {
  return (
    <FieldGroup>
      {/* Location */}
      <Field>
        <FieldLabel htmlFor="site-location">
          <IconMapPin size={14} className="inline mr-1 text-muted-foreground" />
          Location
        </FieldLabel>
        <Input
          id="site-location"
          placeholder="e.g. Kigali, Rwanda"
          value={data.location}
          onChange={(e) => onChange({ location: e.target.value })}
        />
        <FieldDescription>City, district, or region — human-readable.</FieldDescription>
      </Field>

      {/* Address */}
      <Field>
        <FieldLabel htmlFor="site-address">Full address</FieldLabel>
        <Textarea
          id="site-address"
          placeholder="e.g. KG 123 St, Kigali, Rwanda"
          rows={2}
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
          className="resize-none"
        />
        <FieldDescription>Street-level address for navigation and records.</FieldDescription>
      </Field>

      <FieldSeparator />

      {/* Coordinates */}
      <FieldSet>
        <FieldLegend>
          <IconMap size={14} className="inline mr-1 text-muted-foreground" />
          GPS Coordinates
        </FieldLegend>
        <FieldDescription>
          Used for geofencing and map pin. Enter as <code className="text-xs bg-muted px-1 rounded">lat,lng</code> (e.g.{" "}
          <code className="text-xs bg-muted px-1 rounded">-1.9441,30.0619</code>).
        </FieldDescription>
        <Field>
          <InputGroup>
            <InputGroupAddon>
              <IconMapPin />
            </InputGroupAddon>
            <InputGroupInput
              id="site-coords"
              placeholder="-1.9441,30.0619"
              value={data.coordinates}
              onChange={(e) => onChange({ coordinates: e.target.value })}
            />
            <InputGroupAddon align={"inline-end"}>
              <InputGroupButton variant={"link"}>Open Map</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription className="italic">
            You can copy coordinates directly from Google Maps — right-click a location and select the lat/lng at the
            top.
          </FieldDescription>
        </Field>
      </FieldSet>
    </FieldGroup>
  );
}

function Step3({ data, onChange }: { data: SiteForm; onChange: (p: Partial<SiteForm>) => void }) {
  const dateError =
    data.startDate && data.endDate && data.endDate <= data.startDate ? "End date must be after start date." : null;

  return (
    <FieldGroup>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="site-start">Start date</FieldLabel>
          <DatePickerButton
            id="site-start"
            value={data.startDate}
            onChange={(d) => onChange({ startDate: d })}
            placeholder="Pick start date"
          />
          <FieldDescription>When work on this site begins.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="site-end">End date</FieldLabel>
          <DatePickerButton
            id="site-end"
            value={data.endDate}
            onChange={(d) => onChange({ endDate: d })}
            placeholder="Pick end date"
          />
          <FieldDescription>Planned completion date.</FieldDescription>
        </Field>
      </div>

      {dateError && <p className="text-xs text-destructive mt-1">{dateError}</p>}

      <FieldSeparator />

      {/* Summary card */}
      <FieldSet>
        <FieldLegend>Review</FieldLegend>
        <FieldDescription>Check the details before saving.</FieldDescription>
        <div className="mt-2 rounded-md border border-border divide-y divide-border text-sm">
          {[
            { label: "Name", value: data.name || "—" },
            { label: "Type", value: WORKPLACE_TYPES.find((t) => t.value === data.type)?.label ?? data.type },
            { label: "Status", value: STATUS_OPTIONS.find((s) => s.value === data.status)?.label ?? data.status },
            { label: "Location", value: data.location || "—" },
            { label: "Start date", value: data.startDate ? format(data.startDate, "PPP") : "—" },
            { label: "End date", value: data.endDate ? format(data.endDate, "PPP") : "—" }
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </FieldSet>
    </FieldGroup>
  );
}

// ─── Multi-step form ──────────────────────────────────────────────────────────

function EditSiteForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState<SiteForm>(INITIAL_FORM);

  const patch = (updates: Partial<SiteForm>) => setForm((prev) => ({ ...prev, ...updates }));

  const canAdvance =
    step === 1
      ? form.name.trim().length > 0
      : step === 2
        ? true
        : !(form.startDate && form.endDate && form.endDate <= form.startDate);

  const handleSave = () => {
    const payload = {
      name: form.name,
      type: form.type,
      status: form.status,
      description: form.description || null,
      location: form.location || null,
      address: form.address || null,
      coordinates: form.coordinates || null,
      startDate: form.startDate?.toISOString() ?? null,
      endDate: form.endDate?.toISOString() ?? null
    };
    // TODO: wire up to PATCH /api/v1/workplaces/:workplaceId
    console.log("Update workplace payload:", payload);
    onSuccess();
  };

  return (
    <div className="space-y-0">
      <StepIndicator currentStep={step} />

      <div className="max-h-[55vh] overflow-y-auto scrollbar_styles px-1 pb-2">
        {step === 1 && <Step1 data={form} onChange={patch} />}
        {step === 2 && <Step2 data={form} onChange={patch} />}
        {step === 3 && <Step3 data={form} onChange={patch} />}
      </div>

      <DialogFooter className="pt-4 border-t border-border mt-4 gap-2">
        <span className="text-xs text-muted-foreground flex-1 self-center">
          Step {step} of {STEPS.length}
        </span>

        <div className="flex gap-2">
          <DialogClose asChild>
            <Button variant="destructive" size="sm">
              <IconX size={14} />
              Cancel
            </Button>
          </DialogClose>

          {step > 1 && (
            <Button variant="outline" size="sm" onClick={() => setStep((s) => s - 1)}>
              <IconArrowLeft />
              Back
            </Button>
          )}

          {step < STEPS.length ? (
            <Button size="sm" onClick={() => setStep((s) => s + 1)} disabled={!canAdvance}>
              Next
              <IconArrowRight />
            </Button>
          ) : (
            <Button size="sm" onClick={handleSave} disabled={!canAdvance}>
              <IconDeviceFloppyFilled size={14} />
              Save changes
            </Button>
          )}
        </div>
      </DialogFooter>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function EditSiteDialog() {
  return (
    <DialogWrapper
      trigger={
        <Button variant="outline" size="lg">
          <IconEdit />
          Edit details
        </Button>
      }
      title={
        <span className="flex items-center gap-2">
          <IconBuilding size={18} />
          Edit Site Details
        </span>
      }
      description="Update the name, type, status, location, and schedule for this workplace.">
      <EditSiteForm onSuccess={() => {}} />
    </DialogWrapper>
  );
}
