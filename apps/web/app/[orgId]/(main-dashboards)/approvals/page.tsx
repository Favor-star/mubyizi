"use client";
import React from "react";
import { IconCalendarEvent, IconCash, IconClock, IconClockHour4 } from "@tabler/icons-react";
import { PageHeader } from "../_components/page-header";
import { StatCard } from "@/shared/components/stat-card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeaveRequest {
  id: string;
  name: string;
  initials: string;
  color: `var(--${string})`;
  leaveType: string;
  dateRange: string;
  duration: string;
  reason: string;
  balance: string;
  tags: string[];
  submittedAt: string;
}

interface OvertimeRequest {
  id: string;
  name: string;
  initials: string;
  color: `var(--${string})`;
  date: string;
  hours: number;
  task: string;
  tags: string[];
  estPay: string;
  submittedAt: string;
}

interface SalaryAdvanceRequest {
  id: string;
  name: string;
  initials: string;
  color: `var(--${string})`;
  amount: number;
  date: string;
  monthlySalary: number;
  currentBalance: number;
  warning?: string;
  tags: string[];
  submittedAt: string;
}

interface Decision {
  name: string;
  type: string;
  dotColor: `var(--${string})`;
  summary: string;
  status: "approved" | "denied";
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_LEAVE: LeaveRequest[] = [
  {
    id: "1",
    name: "Peter Kamau",
    initials: "PK",
    color: "var(--warning)",
    leaveType: "Annual Leave",
    dateRange: "Mar 18 – Mar 20, 2026",
    duration: "3 days",
    reason: "Family event.",
    balance: "9 days",
    tags: ["Annual Leave"],
    submittedAt: "2h ago"
  }
];

const MOCK_OVERTIME: OvertimeRequest[] = [
  {
    id: "2",
    name: "Grace Wanjiru",
    initials: "GW",
    color: "var(--success)",
    date: "Mar 15, 2026",
    hours: 4,
    task: "Wiring Block C completion. Verified on site.",
    tags: ["Overtime"],
    estPay: "+$60 OT",
    submittedAt: "1d ago"
  },
  {
    id: "4",
    name: "Michael Onyango",
    initials: "MO",
    color: "var(--success)",
    date: "Mar 15, 2026",
    hours: 2,
    task: "Assisted with concrete pour for foundation. Verified on site.",
    tags: ["Overtime"],
    estPay: "+$30 OT",
    submittedAt: "1d ago"
  }
];

const MOCK_ADVANCE: SalaryAdvanceRequest[] = [
  {
    id: "3",
    name: "Samuel Otieno",
    initials: "SO",
    color: "var(--primary)",
    amount: 150,
    date: "Mar 14, 2026",
    monthlySalary: 1100,
    currentBalance: 0,
    warning: "Note: existing $150 advance pending",
    tags: ["Salary Advance"],
    submittedAt: "6h ago"
  }
];

const MOCK_DECISIONS: Decision[] = [
  {
    name: "James Mwangi",
    type: "Leave Request",
    dotColor: "var(--primary)",
    summary: "Annual leave Mar 10–12 | Approved by you | Mar 9",
    status: "approved"
  },
  {
    name: "Aisha Ochieng",
    type: "Overtime Request",
    dotColor: "var(--chart-4)",
    summary: "3.5 hrs overtime Mar 8 | Approved by you | Mar 8",
    status: "approved"
  },
  {
    name: "Brian Njoroge",
    type: "Salary Advance",
    dotColor: "var(--destructive)",
    summary: "$200 advance request | Denied — existing advance unpaid | Mar 5",
    status: "denied"
  }
];

const FILTER_TABS = ["Pending (3)", "Approved (18)", "Denied (4)", "All (25)"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function GroupedSection({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-sidebar overflow-hidden">
      <hgroup className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 border-b border-border">
        <h1 className="text-sm font-medium">{label}</h1>
        <Badge variant="outline">{count}</Badge>
      </hgroup>
      {children}
    </div>
  );
}
function ApprovalActions({ submittedAt }: { submittedAt: string }) {
  return (
    <div className="shrink-0 flex flex-col items-end gap-2">
      <span className="text-xs text-muted-foreground whitespace-nowrap">Submitted {submittedAt}</span>
      <div className="flex gap-1.5">
        <Button size="sm" variant="link" className="h-8 px-1">
          Details
        </Button>
        <Button size="sm" className="h-8">
          Approve
        </Button>
        <Button size="sm" variant="destructive" className="h-8">
          Deny
        </Button>
      </div>
    </div>
  );
}

function LeaveCard({ item }: { item: LeaveRequest }) {
  return (
    <div className="flex items-start gap-4 px-4 py-4">
      <Avatar>
        <AvatarFallback>{item.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{item.name}</p>
        <p className="text-sm text-muted-foreground">
          {item.leaveType} &nbsp;|&nbsp; {item.dateRange} &nbsp;|&nbsp; {item.duration}
        </p>
        <p className="text-sm text-muted-foreground">
          Reason: {item.reason} Leave balance remaining: {item.balance}.
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <ApprovalActions submittedAt={item.submittedAt} />
    </div>
  );
}

function OvertimeCard({ item }: { item: OvertimeRequest }) {
  return (
    <div className="flex items-start gap-4 px-4 py-4">
      <Avatar>
        <AvatarFallback>{item.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{item.name}</p>
        <p className="text-sm text-muted-foreground">
          Overtime &nbsp;|&nbsp; {item.date} &nbsp;|&nbsp; {item.hours} extra hours
        </p>
        <p className="text-sm text-muted-foreground">Task overrun: {item.task}</p>
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          <Badge variant="outline" className="text-xs">
            Est. {item.estPay}
          </Badge>
        </div>
      </div>
      <ApprovalActions submittedAt={item.submittedAt} />
    </div>
  );
}

function SalaryAdvanceCard({ item }: { item: SalaryAdvanceRequest }) {
  return (
    <div className="flex items-start gap-4 px-4 py-4">
      <Avatar>
        <AvatarFallback>{item.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{item.name}</p>
        <p className="text-sm text-muted-foreground">
          Salary Advance &nbsp;|&nbsp; ${item.amount} requested &nbsp;|&nbsp; {item.date}
        </p>
        <p className="text-sm text-muted-foreground">
          Monthly salary: ${item.monthlySalary.toLocaleString()} &nbsp;|&nbsp; Current advance balance: $
          {item.currentBalance} this month
        </p>
        {item.warning && (
          <div className="mt-2 inline-flex items-center rounded border border-destructive/40 bg-destructive/10 text-destructive px-2 py-1 text-xs font-medium">
            {item.warning}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <ApprovalActions submittedAt={item.submittedAt} />
    </div>
  );
}

function DecisionRow({ item }: { item: Decision }) {
  const isApproved = item.status === "approved";
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.dotColor }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {item.name} — {item.type}
        </p>
        <p className="text-xs text-muted-foreground truncate">{item.summary}</p>
      </div>
      <Badge variant={"outline"} className={cn(isApproved ? "border-success text-success" : "")}>
        {isApproved ? "Approved" : "Denied"}
      </Badge>
      <Button variant="link" size="sm" className="shrink-0 h-fit px-0 text-xs">
        View
      </Button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = React.useState("Pending (3)");

  return (
    <section className="w-full space-y-4">
      <PageHeader title="Approvals" description="Site A — Nairobi CBD  |  Review and action pending requests">
        <Button variant="outline">View History</Button>
        <Button>Approve All</Button>
      </PageHeader>

      {/* Stat cards */}
      <section className="px-4 grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={IconClock} color="var(--warning)" title="Total Pending" value="3" />
        <StatCard icon={IconCalendarEvent} color="var(--primary)" title="Leave Requests" value="1" />
        <StatCard icon={IconClockHour4} color="var(--chart-4)" title="Overtime Requests" value="1" />
        <StatCard icon={IconCash} color="var(--destructive)" title="Salary Advances" value="1" />
      </section>

      {/* Filter tabs */}
      <section className="px-4">
        <div className="flex gap-2 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}>
              {tab}
            </Button>
          ))}
        </div>
      </section>

      {/* Pending groups */}
      <section className="px-4 space-y-3">
        <GroupedSection label="Leave Request" count={MOCK_LEAVE.length}>
          {MOCK_LEAVE.map((item) => (
            <LeaveCard key={item.id} item={item} />
          ))}
        </GroupedSection>

        <GroupedSection label="Overtime Request" count={MOCK_OVERTIME.length}>
          {MOCK_OVERTIME.map((item) => (
            <OvertimeCard key={item.id} item={item} />
          ))}
        </GroupedSection>

        <GroupedSection label="Salary Advance Request" count={MOCK_ADVANCE.length}>
          {MOCK_ADVANCE.map((item) => (
            <SalaryAdvanceCard key={item.id} item={item} />
          ))}
        </GroupedSection>
      </section>

      {/* Recent decisions */}
      <section className="px-4 pb-8">
        <div className="rounded-lg border border-border bg-sidebar overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="font-semibold text-sm">Recent Decisions</h2>
          </div>
          <div className="divide-y divide-border">
            {MOCK_DECISIONS.map((item, i) => (
              <DecisionRow key={i} item={item} />
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border text-center">
            <Button variant="link" size="sm">
              View full approval history (25 decisions) →
            </Button>
          </div>
        </div>
      </section>
    </section>
  );
}
