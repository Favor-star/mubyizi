"use client";

import React from "react";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconPlus
} from "@tabler/icons-react";
import { ATTENDANCE_ROWS, PERFORMANCE_ROWS } from "./_components/mock";
import { WorkplacePageHeader } from "../_components/workplace-page-header";
import { Field, FieldLabel } from "@workspace/ui/components/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@workspace/ui/components/select";

const REPORT_CARDS = [
  {
    label: "Attendance",
    description: "Daily and monthly summaries",
    border: "border-t-blue-500",
    btn: "bg-blue-500 hover:bg-blue-600"
  },
  {
    label: "Payroll",
    description: "Wages, overtime and advances",
    border: "border-t-purple-500",
    btn: "bg-purple-500 hover:bg-purple-600"
  },
  {
    label: "Worker Performance",
    description: "Attendance rates and flags",
    border: "border-t-emerald-500",
    btn: "bg-emerald-500 hover:bg-emerald-600"
  },
  {
    label: "Disciplinary",
    description: "Warnings, incidents and flags",
    border: "border-t-red-500",
    btn: "bg-red-500 hover:bg-red-600"
  }
];

function rateBadgeClass(rate: number) {
  if (rate >= 95) return "bg-emerald-500/10 text-emerald-600";
  if (rate >= 80) return "bg-amber-500/10 text-amber-600";
  return "bg-red-500/10 text-red-600";
}

function tierBadgeClass(tier: string) {
  if (tier === "Top" || tier === "Good") return "bg-emerald-500/10 text-emerald-600";
  if (tier === "Avg") return "bg-amber-500/10 text-amber-600";
  return "bg-red-500/10 text-red-600";
}

export default function ReportsPage() {
  const [reportType, setReportType] = React.useState("Attendance");
  const [groupBy, setGroupBy] = React.useState("Worker");

  return (
    <section className="space-y-3 w-full">
      <WorkplacePageHeader title="Reports">
        <section className="mt-8 mb-3 flex justify-between items-center ">
          <hgroup>
            <h1 className="text-2xl font-bold mt-2">Site name - Reports</h1>
            <p className="text-muted-foreground text-sm">
              Site A — Nairobi CBD | Generate and export site-level reports
            </p>
          </hgroup>
          <div className="flex gap-3 items-center">
            <ButtonGroup>
              <Button variant="outline" size="icon-lg">
                <IconChevronLeft />
              </Button>
              <Button size="lg" variant="outline">
                <IconCalendar />
                12 Aug - 12 Sep 2024
              </Button>
              <Button variant="outline" size="icon-lg">
                <IconChevronRight />
              </Button>
            </ButtonGroup>
            <Button size="lg" variant="outline">
              <IconDownload /> Export All
            </Button>
            <Button size="lg" variant="default">
              <IconPlus />
              Schedule a Report
            </Button>
          </div>
        </section>
      </WorkplacePageHeader>

      <section className="py-3 px-4 space-y-4">
        {/* 1. Report Type Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {REPORT_CARDS.map((card) => (
            <div
              key={card.label}
              className={`rounded-lg border border-border bg-sidebar border-t-4 ${card.border} p-4 space-y-3`}>
              <div>
                <h3 className="font-semibold text-sm">{card.label}</h3>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </div>
              <Button size="sm" className={`${card.btn} text-white`}>
                Generate
              </Button>
            </div>
          ))}
        </div>

        {/* 2. Two-column report sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            {/* Attendance Summary */}
            <div className="rounded-lg border border-border bg-sidebar p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-base">Attendance Summary</h2>
                  <p className="text-xs text-muted-foreground">Mar 1–17, 2026 — Site A</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    Export PDF
                  </Button>
                </div>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded border border-border p-3">
                  <p className="text-xs text-muted-foreground">Avg Rate</p>
                  <p className="text-lg font-bold text-emerald-600">94.2%</p>
                </div>
                <div className="rounded border border-border p-3">
                  <p className="text-xs text-muted-foreground">Present</p>
                  <p className="text-lg font-bold text-blue-600">638 days</p>
                </div>
                <div className="rounded border border-border p-3">
                  <p className="text-xs text-muted-foreground">Absent</p>
                  <p className="text-lg font-bold text-red-500">38 days</p>
                </div>
                <div className="rounded border border-border p-3">
                  <p className="text-xs text-muted-foreground">On Leave</p>
                  <p className="text-lg font-bold text-amber-600">18 days</p>
                </div>
              </div>

              {/* Attendance mini table */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left pb-2 font-medium">Worker</th>
                    <th className="text-left pb-2 font-medium">Present</th>
                    <th className="text-left pb-2 font-medium">Absent</th>
                    <th className="text-left pb-2 font-medium">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {ATTENDANCE_ROWS.map((row) => (
                    <tr key={row.name} className="border-b border-border last:border-0">
                      <td className="py-2 font-medium">{row.name}</td>
                      <td className="py-2 text-emerald-600">{row.present}</td>
                      <td className="py-2 text-red-500">{row.absent}</td>
                      <td className="py-2">
                        <Badge className={rateBadgeClass(row.rate)}>{row.rate}%</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Button variant="link" size="sm" className="p-0">
                View full report →
              </Button>
            </div>

            {/* Payroll Summary */}
            <div className="rounded-lg border border-border bg-sidebar p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-base">Payroll Summary</h2>
                  <p className="text-xs text-muted-foreground">Week of Mar 17 — Site A</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    Export PDF
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded border border-border p-3 text-center">
                  <p className="text-xl font-bold">$18,200</p>
                  <p className="text-xs text-muted-foreground">Base Wages</p>
                </div>
                <div className="rounded border border-border p-3 text-center">
                  <p className="text-xl font-bold">$1,100</p>
                  <p className="text-xs text-muted-foreground">Overtime</p>
                </div>
                <div className="rounded border border-border p-3 text-center">
                  <p className="text-xl font-bold">$300</p>
                  <p className="text-xs text-muted-foreground">Advances</p>
                </div>
              </div>

              <div className="bg-foreground text-background rounded p-3 text-center text-sm font-medium">
                Net Total: $19,000 | 42 Workers
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Worker Performance */}
            <div className="rounded-lg border border-border bg-sidebar p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-base">Worker Performance</h2>
                  <p className="text-xs text-muted-foreground">Mar 2026 — Site A</p>
                </div>
                <Button variant="outline" size="sm">
                  Export CSV
                </Button>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left pb-2 font-medium">Worker</th>
                    <th className="text-left pb-2 font-medium">Att.</th>
                    <th className="text-left pb-2 font-medium">OT Hrs</th>
                    <th className="text-left pb-2 font-medium">Flags</th>
                    <th className="text-left pb-2 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {PERFORMANCE_ROWS.map((row) => (
                    <tr key={row.name} className="border-b border-border last:border-0">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full ${row.avatarColor} text-white flex items-center justify-center text-xs font-semibold shrink-0`}>
                            {row.name[0]}
                          </div>
                          <span className="font-medium truncate">{row.name}</span>
                        </div>
                      </td>
                      <td className="py-2">{row.attendance}</td>
                      <td className="py-2">{row.otHours}</td>
                      <td className={`py-2 ${row.flags > 0 ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                        {row.flags}
                      </td>
                      <td className="py-2">
                        <Badge className={tierBadgeClass(row.tier)}>
                          {row.tier} ({row.score})
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Button variant="link" size="sm" className="p-0">
                View all 42 workers →
              </Button>
            </div>

            {/* Disciplinary Summary */}
            <div className="rounded-lg border border-border bg-sidebar p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-base">Disciplinary Summary</h2>
                  <p className="text-xs text-muted-foreground">YTD — Site A</p>
                </div>
                <Button variant="outline" size="sm">
                  Export CSV
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-amber-500/10 text-amber-700 p-4 text-center">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs font-medium">Warnings</p>
                </div>
                <div className="rounded-lg bg-red-500/10 text-red-700 p-4 text-center">
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-xs font-medium">Incidents</p>
                </div>
                <div className="rounded-lg bg-purple-500/10 text-purple-700 p-4 text-center">
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-xs font-medium">Perf. Flag</p>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-200 rounded p-3 text-sm text-red-700">
                2 workers at risk — Brian Njoroge, Peter Kamau
              </div>
            </div>
          </div>
        </div>

        {/* 3. Custom Report Builder */}
        <div className="rounded-lg border border-border bg-sidebar p-5 space-y-4">
          <div>
            <h2 className="font-semibold text-base">Custom Report Builder</h2>
            <p className="text-sm text-muted-foreground">Build a tailored report for any date range and data type</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
            <Field>
              <FieldLabel className="text-xs text-muted-foreground" htmlFor="reportType">
                Report Type
              </FieldLabel>
              <Select defaultValue="">
                <SelectTrigger id="reportType" className="w-full">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {REPORT_CARDS.map((card) => (
                      <SelectItem key={card.label} value={card.label}>
                        {card.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel className="text-xs text-muted-foreground" htmlFor="fromDate">
                From
              </FieldLabel>
              <Select defaultValue="">
                <SelectTrigger id="fromDate" className="w-full">
                  <SelectValue placeholder="Mar 1, 2026" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value="Mar 1, 2026">Mar 1, 2026</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel className="text-xs text-muted-foreground" htmlFor="toDate">
                To
              </FieldLabel>
              <Select defaultValue="">
                <SelectTrigger id="toDate" className="w-full">
                  <SelectValue placeholder="Mar 17, 2026" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value="Mar 17, 2026">Mar 17, 2026</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field className="">
              <FieldLabel className="text-xs text-muted-foreground" htmlFor="groupByField">
                Group By
              </FieldLabel>
              <Select defaultValue="">
                <SelectTrigger id="groupByField">
                  <SelectValue placeholder="Group by" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value={groupBy}>{groupBy}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <div className="flex gap-2 pb-0">
              <Button>Generate</Button>
              <Button variant="outline">Export</Button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
