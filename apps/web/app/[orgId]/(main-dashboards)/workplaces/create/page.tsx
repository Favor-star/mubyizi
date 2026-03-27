"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBuildingCommunity,
  IconCalendar,
  IconCheck,
  IconMapPin,
  IconPlus,
  IconRoute,
  IconTractor,
  IconTrees,
  IconTrophy
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
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
import { PageHeader } from "../../_components/page-header";
import Link from "next/link";
import { WorkplaceType, WorkplaceStatus } from "@workspace/api-client/enums";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  type: WorkplaceType;
  description: string;
  location: string;
  address: string;
  coordinates: string;
  status: WorkplaceStatus;
  startDate: string;
  endDate: string;
}

// ─── Config ────────────────────────────────────────────────────────────────────

const WORKPLACE_TYPES: { value: WorkplaceType; label: string; description: string; icon: React.ElementType }[] = [
  {
    value: WorkplaceType.PROJECT,
    label: "Project",
    description: "Time-bound project (construction, events)",
    icon: IconBuildingCommunity
  },
  {
    value: WorkplaceType.FACILITY,
    label: "Facility",
    description: "Ongoing facility (factory, warehouse, office)",
    icon: IconTrophy
  },
  { value: WorkplaceType.FIELD, label: "Field", description: "Agricultural or outdoor field work", icon: IconTrees },
  { value: WorkplaceType.VENUE, label: "Venue", description: "Event or hospitality venue", icon: IconTractor },
  { value: WorkplaceType.ROUTE, label: "Route", description: "Delivery or transport route", icon: IconRoute },
  {
    value: WorkplaceType.OTHER,
    label: "Other",
    description: "Any other type of workplace",
    icon: IconBuildingCommunity
  }
];

const WORKPLACE_STATUSES: { value: WorkplaceStatus; label: string; description: string }[] = [
  { value: WorkplaceStatus.NOT_STARTED, label: "Not Started", description: "Set up but not yet active" },
  { value: WorkplaceStatus.ACTIVE, label: "Active", description: "Currently running with workers" },
  { value: WorkplaceStatus.ON_HOLD, label: "On Hold", description: "Temporarily paused" },
  { value: WorkplaceStatus.COMPLETED, label: "Completed", description: "Work is finished" },
  { value: WorkplaceStatus.CANCELLED, label: "Cancelled", description: "Cancelled before completion" }
];

const STEPS = [
  { number: 1, label: "Basic Info", description: "Name, type & description" },
  { number: 2, label: "Location", description: "Address & coordinates" },
  { number: 3, label: "Schedule", description: "Status & dates" }
];

// ─── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-0">
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
                className={`text-xs font-medium ${step.number === currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
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

// ─── Step content ──────────────────────────────────────────────────────────────

function Step1({ data, onChange }: { data: FormData; onChange: (patch: Partial<FormData>) => void }) {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Basic Information</FieldLegend>
        <FieldDescription>Give your workplace a name and tell us what kind of site it is.</FieldDescription>
        <FieldSeparator />
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="wp-name">
              Workplace name <span className="text-destructive ml-0.5">*</span>
            </FieldLabel>
            <Input
              id="wp-name"
              placeholder="e.g. Westlands Construction Site"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel>
              Workplace type <span className="text-destructive ml-0.5">*</span>
            </FieldLabel>
            <FieldDescription>Determines default settings and available features.</FieldDescription>
            <RadioGroup
              value={data.type}
              onValueChange={(v) => onChange({ type: v as WorkplaceType })}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {WORKPLACE_TYPES.map(({ value, label, description, icon: Icon }) => (
                <FieldLabel key={value} htmlFor={`type-${value}`}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>
                        <Icon size={15} />
                        {label}
                      </FieldTitle>
                      <FieldDescription>{description}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={value} id={`type-${value}`} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="wp-description">Description</FieldLabel>
            <Textarea
              id="wp-description"
              placeholder="e.g. 12-floor commercial building in phase 2 construction…"
              rows={3}
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value })}
            />
            <FieldDescription>Optional. Briefly describe the purpose or scope of this workplace.</FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}

function Step2({ data, onChange }: { data: FormData; onChange: (patch: Partial<FormData>) => void }) {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Location</FieldLegend>
        <FieldDescription>Help workers and managers locate this workplace.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="wp-location">Location</FieldLabel>
            <div className="relative">
              <IconMapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                id="wp-location"
                className="pl-9"
                placeholder="e.g. Nairobi, Kenya"
                value={data.location}
                onChange={(e) => onChange({ location: e.target.value })}
              />
            </div>
            <FieldDescription>General location name — city, district, or region.</FieldDescription>
          </Field>

          <FieldSeparator />

          <Field>
            <FieldLabel htmlFor="wp-address">Full address</FieldLabel>
            <Input
              id="wp-address"
              placeholder="e.g. Westlands Rd, Nairobi, P.O. Box 1234"
              value={data.address}
              onChange={(e) => onChange({ address: e.target.value })}
            />
            <FieldDescription>Street address, building number, or site reference.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="wp-coords">GPS coordinates</FieldLabel>
            <Input
              id="wp-coords"
              placeholder="-1.2921, 36.8219"
              value={data.coordinates}
              onChange={(e) => onChange({ coordinates: e.target.value })}
            />
            <FieldDescription>
              Latitude and longitude separated by a comma. Used for geofencing and QR check-in.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}

function Step3({ data, onChange }: { data: FormData; onChange: (patch: Partial<FormData>) => void }) {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Schedule & Status</FieldLegend>
        <FieldDescription>Set the current status and expected timeline for this workplace.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="wp-status">Status</FieldLabel>
            <Select value={data.status} onValueChange={(v) => onChange({ status: v as WorkplaceStatus })}>
              <SelectTrigger id="wp-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WORKPLACE_STATUSES.map(({ value, label, description }) => (
                  <SelectItem key={value} value={value}>
                    <span>{label}</span>
                    <span className="text-muted-foreground ml-2 text-xs">— {description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>You can change this at any time from the workplace settings.</FieldDescription>
          </Field>

          <FieldSeparator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="wp-start">Start date</FieldLabel>
              <div className="relative">
                <IconCalendar
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="wp-start"
                  type="date"
                  className="pl-9"
                  value={data.startDate}
                  onChange={(e) => onChange({ startDate: e.target.value })}
                />
              </div>
              <FieldDescription>When work is expected to begin.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="wp-end">End date</FieldLabel>
              <div className="relative">
                <IconCalendar
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="wp-end"
                  type="date"
                  className="pl-9"
                  value={data.endDate}
                  onChange={(e) => onChange({ endDate: e.target.value })}
                />
              </div>
              <FieldDescription>Expected completion date (optional).</FieldDescription>
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const INITIAL_FORM: FormData = {
  name: "",
  type: "PROJECT",
  description: "",
  location: "",
  address: "",
  coordinates: "",
  status: "NOT_STARTED",
  startDate: "",
  endDate: ""
};

export default function CreateWorkplacePage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.orgId as string;

  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState<FormData>(INITIAL_FORM);

  const patch = (updates: Partial<FormData>) => setForm((prev) => ({ ...prev, ...updates }));

  const canAdvance = step === 1 ? form.name.trim().length > 0 : true;

  const handleNext = () => {
    if (step < 3) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    // TODO: wire up to POST /api/v1/orgs/:orgId/workplaces
    console.log("Create workplace payload:", form);
    router.push(`/${orgId}/workplaces`);
  };

  return (
    <section className="w-full">
      <PageHeader
        title="Create Workplace"
        description="Set up a new site, field, venue, or facility for your organization.">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${orgId}/workplaces`}>
            <IconArrowLeft size={16} />
            Back
          </Link>
        </Button>
      </PageHeader>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <Button variant="ghost" size="sm" asChild className="ps-0">
          <Link href={`/${orgId}/workplaces`}>
            <IconArrowLeft size={16} />
            Back to workplaces
          </Link>
        </Button>
        {/* Step indicator */}
        <StepIndicator currentStep={step} />

        {/* Step card */}
        <Card className="dark:bg-sidebar">
          <CardContent className="p-6">
            {step === 1 && <Step1 data={form} onChange={patch} />}
            {step === 2 && <Step2 data={form} onChange={patch} />}
            {step === 3 && <Step3 data={form} onChange={patch} />}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <IconArrowLeft size={16} />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Step {step} of {STEPS.length}
          </span>

          {step < 3 ? (
            <Button onClick={handleNext} disabled={!canAdvance}>
              Next
              <IconArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!form.name.trim()}>
              <IconPlus size={16} />
              Create Workplace
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
