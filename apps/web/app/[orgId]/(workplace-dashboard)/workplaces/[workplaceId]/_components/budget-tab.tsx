"use client";

import React from "react";
import { IconBuildingBank, IconCash, IconDownload, IconPigMoney, IconTrendingDown } from "@tabler/icons-react";
import { DataTable } from "@/shared/components/data-table";
import { DataTablePagination } from "@/shared/components/data-table-pagination";
import { useGeneralTable } from "@/hooks/use-general-table";
import { mockBudgetStats, mockCostBreakdown, mockPaginatedTransactions } from "./_mock/budget";
import { budgetTransactionColumns } from "./budget-columns";
import { StatCard } from "@/shared/components/stat-card";
import { Button } from "@workspace/ui/components/button";
import { RecordExpenseDialog } from "./record-expense-dialog";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(cents / 100);
}

export function BudgetTab() {
  const stats = mockBudgetStats;
  const { data: transactions, total, page, pageSize } = mockPaginatedTransactions;

  const { table } = useGeneralTable(transactions, budgetTransactionColumns);

  const totalPages = Math.ceil(total / pageSize);
  const paginationMeta = {
    page,
    limit: pageSize,
    totalItems: total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };

  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - stats.remainingPct / 100);

  return (
    <section className="p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Budget"
          value={formatCurrency(stats.totalBudget)}
          color="var(--primary)"
          icon={IconBuildingBank}
        />

        <StatCard
          title="Amount Spent"
          value={formatCurrency(stats.amountSpent)}
          color="var(--destructive)"
          icon={IconTrendingDown}
        />
        <StatCard
          title="Remaining Balance"
          value={formatCurrency(stats.remaining)}
          color="var(--success)"
          icon={IconPigMoney}>
          <div className="relative flex items-center justify-center shrink-0">
            <svg width={72} height={72} viewBox="0 0 72 72">
              <circle cx={36} cy={36} r={r} fill="none" stroke="var(--muted)" strokeWidth={8} />
              <circle
                cx={36}
                cy={36}
                r={r}
                fill="none"
                stroke="var(--success)"
                strokeWidth={8}
                strokeDasharray={circ}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
              />
            </svg>
            <span className="absolute text-xs font-semibold text-success">{stats.remainingPct}%</span>
          </div>
        </StatCard>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-sidebar border rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-semibold">Cost Breakdown</h3>
        {mockCostBreakdown.map((item) => {
          const pct = Math.round((item.spent / item.total) * 100);
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="text-muted-foreground">
                  {formatCurrency(item.spent)} / {formatCurrency(item.total)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${item.colorClass}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex gap-2 mb-3 items-center justify-between">
          <h3 className="text-sm font-semibold ">Recent Transactions</h3>
          <div className="flex gap-2">
            <Button variant={"outline"}>
              <IconDownload />
              Export
            </Button>
            <RecordExpenseDialog
              trigger={
                <Button variant="default">
                  <IconCash size={16} />
                  Record Expense
                </Button>
              }
            />
          </div>
        </div>

        <DataTable
          table={table}
          columns={budgetTransactionColumns}
          pagination={
            <DataTablePagination
              meta={paginationMeta}
              limit={pageSize}
              page={page}
              setLimit={() => {}}
              setPage={() => {}}
              table={table}
            />
          }
        />
      </div>
    </section>
  );
}
