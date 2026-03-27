"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconMail,
  IconPhone,
  IconPlus,
  IconTrash,
  IconUserEdit,
  IconUsers
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
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
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { PageHeader } from "../../_components/page-header";
import Link from "next/link";
import { getInitials } from "@/shared/utils";
import { JobCategory, SkillLevel, OrgRole, AccountStatus } from "@workspace/api-client/enums";
// ─── Types ────────────────────────────────────────────────────────────────────

interface MemberForm {
  name: string;
  occupationCategory: JobCategory;
  occupation: string;
  skillLevel: SkillLevel;
  phoneNumber: string;
  email: string;
  accountStatus: AccountStatus;
  orgRole: OrgRole;
}

interface QueuedMember extends MemberForm {
  _queueId: string;
}

// ─── Config ────────────────────────────────────────────────────────────────────

const JOB_CATEGORIES: { value: JobCategory; label: string }[] = [
  { value: JobCategory.SKILLED_TRADESPERSON, label: "Skilled Tradesperson" },
  { value: JobCategory.GENERAL_LABORER, label: "General Laborer" },
  { value: JobCategory.MACHINE_OPERATOR, label: "Machine Operator" },
  { value: JobCategory.DRIVER_OR_COURIER, label: "Driver / Courier" },
  { value: JobCategory.TECHNICIAN, label: "Technician" },
  { value: JobCategory.TEAM_LEADER, label: "Team Leader" },
  { value: JobCategory.SUPERVISOR, label: "Supervisor" },
  { value: JobCategory.FOREMAN_OR_FOREWOMAN, label: "Foreman / Forewoman" },
  { value: JobCategory.ENGINEER, label: "Engineer" },
  { value: JobCategory.TECHNOLOGIST, label: "Technologist" },
  { value: JobCategory.SURVEYOR_OR_INSPECTOR, label: "Surveyor / Inspector" },
  { value: JobCategory.SECURITY_GUARD, label: "Security Guard" },
  { value: JobCategory.CLEANER_OR_JANITOR, label: "Cleaner / Janitor" },
  { value: JobCategory.CATERING_OR_HOSPITALITY, label: "Catering / Hospitality" },
  { value: JobCategory.HEALTHCARE_AIDE, label: "Healthcare Aide" },
  { value: JobCategory.RETAIL_ASSISTANT, label: "Retail Assistant" },
  { value: JobCategory.ADMINISTRATIVE_STAFF, label: "Administrative Staff" },
  { value: JobCategory.OTHER, label: "Other" }
];

const SKILL_LEVELS: { value: SkillLevel; label: string; description: string }[] = [
  { value: SkillLevel.ENTRY, label: "Entry", description: "Trainee / new hire" },
  { value: SkillLevel.JUNIOR, label: "Junior", description: "Some experience, supervised" },
  { value: SkillLevel.INTERMEDIATE, label: "Intermediate", description: "Works independently" },
  { value: SkillLevel.SENIOR, label: "Senior", description: "Experienced, guides others" },
  { value: SkillLevel.LEAD, label: "Lead", description: "Leads a small team" },
  { value: SkillLevel.SPECIALIST, label: "Specialist", description: "Deep narrow expertise" },
  { value: SkillLevel.SUPERVISOR, label: "Supervisor", description: "Formal supervisory role" }
];

const ORG_ROLES: { value: OrgRole; label: string; description: string }[] = [
  { value: OrgRole.VIEWER, label: "Viewer", description: "Read-only access" },
  { value: OrgRole.MEMBER, label: "Member", description: "Standard worker access" },
  { value: OrgRole.MANAGER, label: "Manager", description: "Manages attendance & workers" },
  { value: OrgRole.ADMIN, label: "Admin", description: "Full org management" },
  { value: OrgRole.OWNER, label: "Owner", description: "Full control including billing" }
];

const STEPS = [
  { number: 1, label: "Personal", description: "Identity & trade" },
  { number: 2, label: "Contact & Access", description: "Phone, email & role" }
];

const INITIAL_FORM: MemberForm = {
  name: "",
  occupationCategory: JobCategory.OTHER,
  occupation: "",
  skillLevel: SkillLevel.INTERMEDIATE,
  phoneNumber: "",
  email: "",
  accountStatus: AccountStatus.PROVISIONAL,
  orgRole: OrgRole.MEMBER
};

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

function Step1({ data, onChange }: { data: MemberForm; onChange: (p: Partial<MemberForm>) => void }) {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Personal Information</FieldLegend>
        <FieldDescription>Basic identity and trade details for this worker.</FieldDescription>
        <FieldSeparator />
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="m-name">
              Full name <span className="text-destructive ml-0.5">*</span>
            </FieldLabel>
            <Input
              id="m-name"
              placeholder="e.g. Jean Pierre Habimana"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="m-category">Job category</FieldLabel>
              <Select
                value={data.occupationCategory}
                onValueChange={(v) => onChange({ occupationCategory: v as JobCategory })}>
                <SelectTrigger id="m-category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_CATEGORIES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>Broad trade or function category.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="m-occupation">Job title</FieldLabel>
              <Input
                id="m-occupation"
                placeholder="e.g. Site Foreman"
                value={data.occupation}
                onChange={(e) => onChange({ occupation: e.target.value })}
              />
              <FieldDescription>Specific role or title (optional).</FieldDescription>
            </Field>
          </div>

          <FieldSeparator />

          <Field>
            <FieldLabel>
              Skill level <span className="text-destructive ml-0.5">*</span>
            </FieldLabel>
            <FieldDescription>Experience level for this worker.</FieldDescription>
            <RadioGroup
              value={data.skillLevel}
              onValueChange={(v) => onChange({ skillLevel: v as SkillLevel })}
              className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {SKILL_LEVELS.map(({ value, label, description }) => (
                <FieldLabel key={value} htmlFor={`sl-${value}`}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{label}</FieldTitle>
                      <FieldDescription>{description}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={value} id={`sl-${value}`} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}

function Step2({ data, onChange }: { data: MemberForm; onChange: (p: Partial<MemberForm>) => void }) {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Contact & Access</FieldLegend>
        <FieldDescription>How to reach this worker and their role in the organisation.</FieldDescription>
        <FieldGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="m-phone">Phone number</FieldLabel>
              <div className="relative">
                <IconPhone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="m-phone"
                  className="pl-9"
                  placeholder="+250 7xx xxx xxx"
                  value={data.phoneNumber}
                  onChange={(e) => onChange({ phoneNumber: e.target.value })}
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="m-email">Email address</FieldLabel>
              <div className="relative">
                <IconMail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="m-email"
                  type="email"
                  className="pl-9"
                  placeholder="worker@example.com"
                  value={data.email}
                  onChange={(e) => onChange({ email: e.target.value })}
                />
              </div>
            </Field>
          </div>

          <FieldSeparator />

          <Field>
            <FieldLabel>
              Account status <span className="text-destructive ml-0.5">*</span>
            </FieldLabel>
            <FieldDescription>Determines whether this worker can log in to the platform.</FieldDescription>
            <RadioGroup
              value={data.accountStatus}
              onValueChange={(v) => onChange({ accountStatus: v as AccountStatus })}
              className="grid-cols-1 sm:grid-cols-2">
              <FieldLabel htmlFor="as-provisional">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Provisional</FieldTitle>
                    <FieldDescription>Manager-created profile, no login credentials yet</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="PROVISIONAL" id="as-provisional" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="as-active">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Active</FieldTitle>
                    <FieldDescription>Has credentials and can log in to the platform</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="ACTIVE" id="as-active" />
                </Field>
              </FieldLabel>
            </RadioGroup>
          </Field>

          <FieldSeparator />

          <Field>
            <FieldLabel htmlFor="m-role">Organisation role</FieldLabel>
            <Select value={data.orgRole} onValueChange={(v) => onChange({ orgRole: v as OrgRole })}>
              <SelectTrigger id="m-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORG_ROLES.map(({ value, label, description }) => (
                  <SelectItem key={value} value={value}>
                    <span>{label}</span>
                    <span className="text-muted-foreground ml-2 text-xs">— {description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>Controls what this member can see and do within the organisation.</FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}

// ─── Member queue card ─────────────────────────────────────────────────────────

function MemberCard({
  member,
  isEditing,
  onEdit,
  onDelete
}: {
  member: QueuedMember;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const categoryLabel =
    JOB_CATEGORIES.find((c) => c.value === member.occupationCategory)?.label ?? member.occupationCategory;
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-md border bg-background transition-colors ${
        isEditing ? "border-primary bg-primary/5" : "border-border"
      }`}>
      <Avatar className="h-8 w-8 rounded-full shrink-0">
        <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{member.name}</p>
        <p className="text-xs text-muted-foreground truncate">{member.occupation || categoryLabel}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <Badge variant={member.accountStatus === "ACTIVE" ? "default" : "outline"} className="text-[10px] h-5">
          {member.accountStatus === "ACTIVE" ? "Active" : "Provisional"}
        </Badge>
        <Badge variant="secondary" className="text-[10px] h-5">
          {member.orgRole}
        </Badge>
      </div>
      <div className="flex gap-1 shrink-0">
        <Button variant="ghost" size="icon-sm" onClick={onEdit}>
          <IconUserEdit size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onDelete}
          className="text-destructive hover:text-destructive hover:bg-destructive/10">
          <IconTrash size={14} />
        </Button>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CreateWorkersPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.orgId as string;

  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState<MemberForm>(INITIAL_FORM);
  const [queue, setQueue] = React.useState<QueuedMember[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const patch = (updates: Partial<MemberForm>) => setForm((prev) => ({ ...prev, ...updates }));

  const canAdvance = form.name.trim().length > 0;

  const handleAddToQueue = () => {
    if (editingId) {
      setQueue((prev) => prev.map((m) => (m._queueId === editingId ? { ...form, _queueId: editingId } : m)));
      setEditingId(null);
    } else {
      setQueue((prev) => [...prev, { ...form, _queueId: crypto.randomUUID() }]);
    }
    setForm(INITIAL_FORM);
    setStep(1);
  };

  const handleEdit = (member: QueuedMember) => {
    const { _queueId, ...data } = member;
    setForm(data);
    setEditingId(_queueId);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    setQueue((prev) => prev.filter((m) => m._queueId !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(INITIAL_FORM);
      setStep(1);
    }
  };

  const handleSubmit = () => {
    // TODO: wire up to POST /api/v1/orgs/:orgId/workers/provision (bulk)
    console.log("Create workers payload:", queue);
    router.push(`/${orgId}/workforce`);
  };

  return (
    <section className="w-full">
      <PageHeader
        title="Add Workers"
        description="Build a list of workers to add to your organisation, then create them all at once.">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${orgId}/workforce`}>
            <IconArrowLeft size={16} />
            Back
          </Link>
        </Button>
      </PageHeader>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <Button variant="ghost" size="sm" asChild className="ps-0">
          <Link href={`/${orgId}/workforce`}>
            <IconArrowLeft size={16} />
            Back to workforce
          </Link>
        </Button>

        {/* Step indicator */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <StepIndicator currentStep={step} />
          </div>
          {editingId && (
            <Badge variant="outline" className="text-xs shrink-0">
              Editing member
            </Badge>
          )}
        </div>

        {/* Step card */}
        <Card className="dark:bg-sidebar">
          <CardContent className="p-6">
            {step === 1 && <Step1 data={form} onChange={patch} />}
            {step === 2 && <Step2 data={form} onChange={patch} />}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 1}>
            <IconArrowLeft size={16} />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Step {step} of {STEPS.length}
          </span>

          {step < 2 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance}>
              Next
              <IconArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleAddToQueue} disabled={!canAdvance}>
              <IconPlus size={16} />
              {editingId ? "Update member" : "Add to list"}
            </Button>
          )}
        </div>

        {/* Queue section */}
        <div className="space-y-3 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconUsers size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium">Workers to add</span>
              {queue.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {queue.length}
                </Badge>
              )}
            </div>
            {queue.length > 0 && (
              <Button onClick={handleSubmit}>
                <IconPlus size={16} />
                Create {queue.length} worker{queue.length !== 1 ? "s" : ""}
              </Button>
            )}
          </div>

          {queue.length === 0 ? (
            <div className="border border-dashed border-border rounded-md p-8 text-center">
              <IconUsers size={24} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No workers added yet.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Fill in the form above and click &ldquo;Add to list&rdquo;.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {queue.map((member) => (
                <MemberCard
                  key={member._queueId}
                  member={member}
                  isEditing={editingId === member._queueId}
                  onEdit={() => handleEdit(member)}
                  onDelete={() => handleDelete(member._queueId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
