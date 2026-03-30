"use client";

import React from "react";
import {
  IconCalendarStats,
  IconChevronDown,
  IconDownload,
  IconFilter,
  IconSearch,
  IconUserCheck,
  IconUserMinus,
  IconUserOff,
  IconUsers
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { Badge } from "@workspace/ui/components/badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@workspace/ui/components/input-group";
import { PageHeader } from "../_components/page-header";
import { StatCard } from "@/shared/components/stat-card";
import { DataTable } from "@/shared/components/data-table";
import { DataTablePagination } from "@/shared/components/data-table-pagination";
import { useGeneralTable } from "@/hooks/use-general-table";
import { MonthlyCalendarView } from "./_components/monthly-calendar";
import { TodayBySite } from "./_components/today-by-site";
import { attendanceLogColumns } from "./_components/attendance-log-columns";
import { mockAttendanceLog, mockAttendancePagination, mockAttendanceStats } from "./_components/_mock/attendance";

export default function AttendancePage() {
  const stats = mockAttendanceStats;

  const { table } = useGeneralTable(mockAttendanceLog, attendanceLogColumns);

  const paginationMeta = {
    page: mockAttendancePagination.page,
    limit: mockAttendancePagination.pageSize,
    totalItems: mockAttendancePagination.total,
    totalPages: mockAttendancePagination.totalPages,
    hasNextPage: mockAttendancePagination.hasNextPage,
    hasPrevPage: mockAttendancePagination.hasPrevPage
  };

  return (
    <section className="space-y-4 w-full">
      {/* ── Page header ── */}
      <PageHeader title="Attendance" description="Track and review attendance across all sites">
        <ButtonGroup>
          <Button variant="outline" size="lg" >
            Mar 1 – Mar 17, 2026
          </Button>
          <Button variant="outline" size="icon-lg" >
            <IconChevronDown />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button variant="outline" size="lg" >
            All Sites
          </Button>
          <Button variant="outline" size="icon-lg" >
            <IconChevronDown />
          </Button>
        </ButtonGroup>

        <Button variant="outline" size="lg" >
          <IconDownload size={16} />
          Export CSV
        </Button>

        <Button size="lg" >
          Mark Now
        </Button>
      </PageHeader>

      <div className="px-4 space-y-4">
        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={IconCalendarStats}
            title="Avg Attendance Rate"
            value={`${stats.avgAttendanceRate}%`}
            color="var(--success)"
          />
          <StatCard
            icon={IconUserCheck}
            title="Present Today"
            value={String(stats.presentToday)}
            color="var(--primary)"
          />
          <StatCard
            icon={IconUserOff}
            title="Absent Today"
            value={String(stats.absentToday)}
            color="var(--destructive)"
          />
          <StatCard
            icon={IconUserMinus}
            title="On Leave Today"
            value={String(stats.onLeaveToday)}
            color="var(--warning)"
          />
        </div>

        {/* ── Calendar + Today by Site ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 items-start">
          <MonthlyCalendarView />
          <TodayBySite />
        </div>

        {/* ── Attendance Log ── */}
        <div className="bg-sidebar border rounded-lg mb-4">
          {/* Log header */}
          <div className="flex items-center justify-between gap-3 p-4 border-b border-border">
            <hgroup>
              <h3 className="text-sm font-semibold">Attendance Log</h3>
              <p className="text-xs text-muted-foreground">Detailed records — all sites</p>
            </hgroup>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              {/* Search */}
              <InputGroup className="w-48">
                <InputGroupAddon align="inline-start">
                  <IconSearch size={14} />
                </InputGroupAddon>
                <InputGroupInput placeholder="Search worker…"  />
              </InputGroup>

              {/* Method filter */}
              <ButtonGroup>
                <Button variant="outline" size="sm" disabled>
                  All Methods
                </Button>
                <Button variant="outline" size="icon-sm" disabled>
                  <IconChevronDown size={14} />
                </Button>
              </ButtonGroup>

              {/* Status filter */}
              <ButtonGroup>
                <Button variant="outline" size="sm" disabled>
                  All
                </Button>
                <Button variant="outline" size="icon-sm" disabled>
                  <IconChevronDown size={14} />
                </Button>
              </ButtonGroup>
            </div>
          </div>

          {/* Table */}
          <DataTable
            table={table}
            columns={attendanceLogColumns}
            pagination={
              <DataTablePagination
                meta={paginationMeta}
                limit={mockAttendancePagination.pageSize}
                page={mockAttendancePagination.page}
                setLimit={() => {}}
                setPage={() => {}}
                table={table}
              />
            }
          />
        </div>
      </div>
    </section>
  );
}
