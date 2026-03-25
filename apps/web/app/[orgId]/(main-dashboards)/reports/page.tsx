"use client";

import React from "react";
import { PageHeader } from "../_components/page-header";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight
} from "@tabler/icons-react";
import {
  SITE_ATTENDANCE_ROWS,
  SITE_COMPARISON_ROWS,
  PERFORMANCE_ROWS
} from "./_components/mock";

const REPORT_CARDS = [
  { label: "Attendance",         description: "Daily, weekly & monthly summaries",   border: "border-t-blue-500",    btn: "bg-blue-500 hover:bg-blue-600"    },
  { label: "Payroll",            description: "Wages, overtime & advances by cycle",  border: "border-t-purple-500",  btn: "bg-purple-500 hover:bg-purple-600" },
  { label: "Worker Performance", description: "Attendance rates, flags & output",     border: "border-t-emerald-500", btn: "bg-emerald-500 hover:bg-emerald-600" },
  { label: "Site Comparison",    description: "Compare sites by KPIs side by side",   border: "border-t-amber-500",   btn: "bg-amber-500 hover:bg-amber-600"  }
];

function rateBadgeClass(rate: number) {
  if (rate >= 90) return "bg-emerald-500/10 text-emerald-600";
  if (rate >= 75) return "bg-amber-500/10 text-amber-600";
  return "bg-red-500/10 text-red-600";
}

function scoreBadgeClass(score: string) {
  if (score === "Excellent" || score === "Good") return "bg-emerald-500/10 text-emerald-600";
  if (score === "Average") return "bg-amber-500/10 text-amber-600";
  return "bg-red-500/10 text-red-600";
}

function tierBadgeClass(tier: string) {
  if (tier === "Top" || tier === "Good") return "bg-emerald-500/10 text-emerald-600";
  if (tier === "Avg") return "bg-amber-500/10 text-amber-600";
  return "bg-red-500/10 text-red-600";
}

export default function OrgReportsPage() {
  const [reportType, setReportType] = React.useState("Attendance");

  return (
    <section className="w-full space-y-3">
      <PageHeader title="Reports" description="Generate, view and export reports across your organization">
        <ButtonGroup>
          <Button variant="outline" size="icon-lg">
            <IconChevronLeft />
          </Button>
          <Button size="lg" variant="outline">
            <IconCalendar />
            Mar 1 – Mar 17, 2026
            <IconChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon-lg">
            <IconChevronRight />
          </Button>
        </ButtonGroup>
        <Button size="lg" variant="outline">
          All Sites <IconChevronDown className="h-4 w-4" />
        </Button>
        <Button size="lg">Export All</Button>
      </PageHeader>

      <section className="pt-3 px-4 space-y-4">
        {/* 1. Report Type Cards */}
        <div className="space-y-3">
          <h2 className="font-semibold text-base">Report Types</h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {REPORT_CARDS.map((card) => (
              <div
                key={card.label}
                className={`rounded-lg border border-border bg-sidebar border-t-4 ${card.border} p-4 space-y-3`}
              >
                <div>
                  <h3 className="font-semibold text-sm">{card.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{card.description}</p>
                </div>
                <Button size="sm" className={`${card.btn} text-white`}>
                  Generate
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Two-column sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            {/* Attendance Summary */}
            <div className="rounded-lg border border-border bg-sidebar p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-base">Attendance Summary</h2>
                  <p className="text-xs text-muted-foreground">March 2026 — All Sites</p>
                </div>
                <Button variant="outline" size="sm">Export CSV / PDF</Button>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left pb-2 font-medium">Site</th>
                    <th className="text-left pb-2 font-medium">Total Days</th>
                    <th className="text-left pb-2 font-medium">Present</th>
                    <th className="text-left pb-2 font-medium">Absent</th>
                    <th className="text-left pb-2 font-medium">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {SITE_ATTENDANCE_ROWS.map((row) => (
                    <tr key={row.site} className="border-b border-border last:border-0">
                      <td className="py-2 font-medium truncate max-w-[140px]">{row.site}</td>
                      <td className="py-2">{row.totalDays}</td>
                      <td className="py-2 text-emerald-600">{row.present.toLocaleString()}</td>
                      <td className="py-2 text-red-500">{row.absent.toLocaleString()}</td>
                      <td className="py-2">
                        <Badge className={rateBadgeClass(row.rate)}>{row.rate}%</Badge>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-foreground text-background">
                    <td className="py-2 px-1 font-semibold rounded-l">All Sites Total</td>
                    <td className="py-2 px-1 font-semibold">17</td>
                    <td className="py-2 px-1 font-semibold">4,820</td>
                    <td className="py-2 px-1 font-semibold">302</td>
                    <td className="py-2 px-1 font-semibold rounded-r">94%</td>
                  </tr>
                </tbody>
              </table>

              <Button variant="link" size="sm" className="p-0">
                View full breakdown →
              </Button>
            </div>

            {/* Worker Performance */}
            <div className="rounded-lg border border-border bg-sidebar p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-base">Worker Performance</h2>
                  <p className="text-xs text-muted-foreground">Top & bottom performers — March 2026</p>
                </div>
                <Button variant="outline" size="sm">Export CSV / PDF</Button>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left pb-2 font-medium">Worker</th>
                    <th className="text-left pb-2 font-medium">Att.</th>
                    <th className="text-left pb-2 font-medium">OT Hrs</th>
                    <th className="text-left pb-2 font-medium">Flags</th>
                    <th className="text-left pb-2 font-medium">Score</th>
                    <th className="text-left pb-2 font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {PERFORMANCE_ROWS.map((row) => (
                    <tr key={row.name} className="border-b border-border last:border-0">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full ${row.avatarColor} text-white flex items-center justify-center text-xs font-semibold shrink-0`}
                          >
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
                      <td className="py-2">{row.score}</td>
                      <td className="py-2">
                        <Badge className={tierBadgeClass(row.tier)}>
                          {row.tier === "Risk" ? "At Risk" : row.tier}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Button variant="link" size="sm" className="p-0">
                View all 320 workers →
              </Button>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Site Comparison */}
            <div className="rounded-lg border border-border bg-sidebar p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-base">Site Comparison</h2>
                  <p className="text-xs text-muted-foreground">Top metrics per site — March 2026</p>
                </div>
                <Button variant="outline" size="sm">Export CSV</Button>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left pb-2 font-medium">Site</th>
                    <th className="text-left pb-2 font-medium">Att.</th>
                    <th className="text-left pb-2 font-medium">Payroll</th>
                    <th className="text-left pb-2 font-medium">Workers</th>
                    <th className="text-left pb-2 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {SITE_COMPARISON_ROWS.map((row) => (
                    <tr key={row.site} className="border-b border-border last:border-0">
                      <td className="py-2 font-medium truncate max-w-[140px]">{row.site}</td>
                      <td className="py-2">{row.att}</td>
                      <td className="py-2">{row.payroll}</td>
                      <td className="py-2">{row.workers}</td>
                      <td className="py-2">
                        <Badge className={scoreBadgeClass(row.score)}>{row.score}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Button variant="link" size="sm" className="p-0">
                View full comparison →
              </Button>
            </div>

            {/* Custom Report Builder */}
            <div className="rounded-lg border border-border bg-sidebar p-5 space-y-4">
              <div>
                <h2 className="font-semibold text-base">Custom Report Builder</h2>
                <p className="text-sm text-muted-foreground">Build and export a tailored report</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Report Type</label>
                  <Button variant="outline" className="w-full justify-between">
                    {reportType} <IconChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-between">
                      From: Mar 1 <IconChevronDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="justify-between">
                      To: Mar 17 <IconChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Filter By</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-between">
                      All Sites <IconChevronDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="justify-between">
                      All Workers <IconChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button className="w-full">Generate Report</Button>
                  <Button variant="outline" className="w-full">Export PDF / CSV</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
