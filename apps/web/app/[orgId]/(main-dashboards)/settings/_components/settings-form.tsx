"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { IconCircle, IconCircleCheck } from "@tabler/icons-react";

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function SelectField({
  label,
  defaultValue,
  options
}: {
  label: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <Field label={label}>
      <Select defaultValue={defaultValue}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent side="top">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

const ALL_TRACKING_METHODS = ["QR Scan", "GPS", "Biometric", "Mobile App", "Manual"];
const DEFAULT_ACTIVE = ["QR Scan", "GPS", "Biometric", "Mobile App"];

export function SettingsForm() {
  const [activeMethods, setActiveMethods] = React.useState<string[]>(DEFAULT_ACTIVE);

  const toggleMethod = (method: string) => {
    setActiveMethods((prev) => (prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]));
  };

  return (
    <div className="space-y-6">
      {/* Organization Profile */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <SectionHeading title="Organization Profile" subtitle="Basic information about your organization" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Organization Name">
              <Input defaultValue="Horizon Construction Ltd" />
            </Field>
            <SelectField
              label="Industry"
              defaultValue="construction"
              options={[
                { value: "construction", label: "Construction" },
                { value: "agriculture", label: "Agriculture" },
                { value: "logistics", label: "Logistics" },
                { value: "events", label: "Events" }
              ]}
            />
            <Field label="Primary Contact Email">
              <Input type="email" defaultValue="admin@horizon.co" />
            </Field>
            <Field label="Phone Number">
              <Input type="tel" defaultValue="+254 700 000 000" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Headquarters Location">
                <Input defaultValue="Nairobi, Kenya" />
              </Field>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payroll & Billing */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <SectionHeading title="Payroll & Billing" subtitle="Payment cycles and billing preferences" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Default Payment Cycle"
              defaultValue="monthly"
              options={[
                { value: "weekly", label: "Weekly" },
                { value: "bi-weekly", label: "Bi-weekly" },
                { value: "monthly", label: "Monthly" }
              ]}
            />
            <SelectField
              label="Currency"
              defaultValue="kes"
              options={[
                { value: "kes", label: "KES — Kenyan Shilling" },
                { value: "usd", label: "USD — US Dollar" },
                { value: "eur", label: "EUR — Euro" },
                { value: "ugx", label: "UGX — Ugandan Shilling" }
              ]}
            />
            <SelectField
              label="Payroll Processing Day"
              defaultValue="last"
              options={[
                { value: "1", label: "1st of month" },
                { value: "15", label: "15th of month" },
                { value: "last", label: "Last day of month" }
              ]}
            />
            <SelectField
              label="Payment Gateway"
              defaultValue="mpesa-bank"
              options={[
                { value: "mpesa-bank", label: "M-Pesa / Bank Transfer" },
                { value: "mpesa", label: "M-Pesa only" },
                { value: "bank", label: "Bank Transfer only" }
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Attendance Rules */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <SectionHeading title="Attendance Rules" subtitle="Define how attendance is tracked and validated" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField
              label="Work Start Time"
              defaultValue="07:00"
              options={[
                { value: "06:00", label: "06:00 AM" },
                { value: "07:00", label: "07:00 AM" },
                { value: "08:00", label: "08:00 AM" },
                { value: "09:00", label: "09:00 AM" }
              ]}
            />
            <SelectField
              label="Work End Time"
              defaultValue="17:00"
              options={[
                { value: "15:00", label: "03:00 PM" },
                { value: "16:00", label: "04:00 PM" },
                { value: "17:00", label: "05:00 PM" },
                { value: "18:00", label: "06:00 PM" }
              ]}
            />
            <SelectField
              label="Late Threshold"
              defaultValue="15"
              options={[
                { value: "5", label: "5 minutes" },
                { value: "10", label: "10 minutes" },
                { value: "15", label: "15 minutes" },
                { value: "30", label: "30 minutes" }
              ]}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Allowed Tracking Methods</Label>
            <div className="flex flex-wrap gap-2">
              {ALL_TRACKING_METHODS.map((method) => (
                <Button
                  key={method}
                  size="sm"
                  variant={activeMethods.includes(method) ? "default" : "outline"}
                  onClick={() => toggleMethod(method)}>
                  {activeMethods.includes(method) ? <IconCircleCheck /> : <IconCircle />}
                  {method}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Localization */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <SectionHeading title="Localization" subtitle="Platform language and regional settings" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Platform Language"
              defaultValue="en"
              options={[
                { value: "en", label: "English (EN)" },
                { value: "sw", label: "Swahili (SW)" },
                { value: "fr", label: "French (FR)" }
              ]}
            />
            <SelectField
              label="Timezone"
              defaultValue="africa-nairobi"
              options={[
                { value: "africa-nairobi", label: "Africa/Nairobi (UTC+3)" },
                { value: "africa-cairo", label: "Africa/Cairo (UTC+2)" },
                { value: "europe-london", label: "Europe/London (UTC+0)" },
                { value: "america-new_york", label: "America/New_York (UTC-5)" }
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
