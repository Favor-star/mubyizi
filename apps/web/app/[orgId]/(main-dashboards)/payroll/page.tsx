"use client";

import React from "react";
import { PageHeader } from "../_components/page-header";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@workspace/ui/components/input-group";
import { StatCard } from "@/shared/components/stat-card";
import { DataTable } from "@/shared/components/data-table";
import { DataTablePagination, type PaginationMeta } from "@/shared/components/data-table-pagination";
import { useGeneralTable } from "@/hooks/use-general-table";
import {
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCash,
  IconClockHour4,
  IconArrowUpCircle,
  IconUsers,
  IconDownload,
  IconSearch,
  IconAdjustments
} from "@tabler/icons-react";
import { MOCK_PAYSLIPS, MOCK_ADVANCES, PAYROLL_HISTORY } from "./_components/mock";
import { payslipColumns } from "./_components/payslip-columns";
import { advancesColumns } from "./_components/advances-columns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";

export default function PayrollPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredPayslips = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_PAYSLIPS;
    return MOCK_PAYSLIPS.filter((p) => p.workerName.toLowerCase().includes(q) || p.site.toLowerCase().includes(q));
  }, [searchQuery]);

  const { table: payslipTable, page, limit, setPage, setLimit } = useGeneralTable(filteredPayslips, payslipColumns);
  const { table: advancesTable } = useGeneralTable(MOCK_ADVANCES, advancesColumns);

  const totalNet = filteredPayslips.reduce((s, r) => s + r.netPay, 0);
  const totalPages = Math.ceil(filteredPayslips.length / limit);
  const meta: PaginationMeta = {
    page,
    limit,
    totalItems: filteredPayslips.length,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };

  const advancesMeta: PaginationMeta = {
    page: 1,
    limit: 10,
    totalItems: MOCK_ADVANCES.length,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  };

  return (
    <section className="space-y-3 w-full">
      <PageHeader title="Payroll" description="Manage wages, advances, and payslips across all sites">
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
          All sites <IconChevronDown />
        </Button>
        <Button size="lg" variant="outline">
          Export <IconDownload />
        </Button>
      </PageHeader>

      <section className="pt-3 px-4 space-y-4">
        {/* 1. Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Payroll (March)" value="$124,000" icon={IconCash} color="var(--primary)" />
          <StatCard title="Total Overtime" value="$8,200" icon={IconClockHour4} color="var(--chart-4)" />
          <StatCard title="Advances Issued" value="$1,400" icon={IconArrowUpCircle} color="var(--warning)" />
          <StatCard title="Workers Paid" value="286 / 320" icon={IconUsers} color="var(--chart-2)" />
        </div>

        {/* 2. Run Payroll + Payroll History */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Run Payroll */}
          <div className="rounded-lg border border-border bg-sidebar p-5 space-y-4">
            <div>
              <h2 className="font-semibold text-base">Run Payroll</h2>
              <p className="text-sm text-muted-foreground">Process wages for the current cycle</p>
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="march 2026">March 2026 (Monthly)</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select Site" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all sites">All Sites</SelectItem>
                  <SelectItem value="site a">Site A</SelectItem>
                  <SelectItem value="site b">Site B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded border border-border p-3 text-center">
                <p className="text-xl font-bold">320</p>
                <p className="text-xs text-muted-foreground">Workers</p>
              </div>
              <div className="rounded border border-border p-3 text-center">
                <p className="text-xl font-bold">$124,000</p>
                <p className="text-xs text-muted-foreground">Estimated</p>
              </div>
              <div className="rounded border border-border p-3 text-center">
                <p className="text-xl font-bold">Mar 31</p>
                <p className="text-xs text-muted-foreground">Due Date</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Process Payroll</Button>
              <Button variant="outline" className="flex-1">
                Schedule Payment
              </Button>
            </div>
          </div>

          {/* Payroll History */}
          <div className="rounded-lg border border-border bg-sidebar p-5 space-y-4">
            <h2 className="font-semibold text-base">Payroll History</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left pb-2 font-medium">Period</th>
                  <th className="text-left pb-2 font-medium">Total</th>
                  <th className="text-left pb-2 font-medium">Workers</th>
                  <th className="text-left pb-2 font-medium">Status</th>
                  <th className="text-left pb-2 font-medium">View</th>
                </tr>
              </thead>
              <tbody>
                {PAYROLL_HISTORY.map((row) => (
                  <tr key={row.period} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium">{row.period}</td>
                    <td className="py-3">${row.total.toLocaleString()}</td>
                    <td className="py-3">{row.workers}</td>
                    <td className="py-3">
                      <Badge className="bg-emerald-500/10 text-emerald-600">Paid</Badge>
                    </td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-blue-600 dark:text-blue-400">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Worker Payslips */}
        <div className="rounded-lg border border-border bg-sidebar">
          <div className="p-4 border-b border-border space-y-0.5">
            <h2 className="font-semibold text-base">Worker Payslips</h2>
            <p className="text-xs text-muted-foreground">March 2026 — All Sites</p>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-3">
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <IconSearch />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search worker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon align="inline-end">{filteredPayslips.length} results</InputGroupAddon>
            </InputGroup>
            <div className="flex gap-2 shrink-0">
              <Select>
                <SelectTrigger className="w-30">
                  <SelectValue placeholder="Filter by Site" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all sites">All Sites</SelectItem>
                  <SelectItem value="site a">Site A</SelectItem>
                  <SelectItem value="site b">Site B</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-30">
                  <SelectValue placeholder=" Status" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Button variant={"outline"} size="icon">
                <IconAdjustments />
              </Button>
            </div>
          </div>
          <DataTable
            table={payslipTable}
            columns={payslipColumns}
            pagination={
              <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground border-t border-border">
                <span>
                  Showing {filteredPayslips.length} of {MOCK_PAYSLIPS.length} workers &nbsp;|&nbsp; Total net: $
                  {totalNet.toLocaleString()}
                </span>
                <DataTablePagination
                  meta={meta}
                  table={payslipTable}
                  page={page}
                  limit={limit}
                  setPage={setPage}
                  setLimit={setLimit}
                />
              </div>
            }
          />
        </div>

        {/* 4. Salary Advances */}
        <div className="rounded-lg  bg-sidebar mb-3">
          <div className="p-3 border border-b-0 border-border flex justify-between items-center">
            <h2 className="font-semibold text-base">Salary Advances — March 2026</h2>
            <Button variant={"outline"} size="icon">
              <IconAdjustments />
            </Button>
          </div>
          <DataTable
            table={advancesTable}
            columns={advancesColumns}
            pagination={
              <DataTablePagination
                meta={advancesMeta}
                table={advancesTable}
                page={1}
                limit={10}
                setPage={() => {}}
                setLimit={() => {}}
              />
            }
          />
        </div>
      </section>
    </section>
  );
}
