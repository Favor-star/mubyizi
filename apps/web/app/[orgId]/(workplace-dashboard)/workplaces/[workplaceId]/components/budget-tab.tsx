"use client";

import React from "react";
import { IconBuildingBank, IconPigMoney, IconTrendingDown } from "@tabler/icons-react";
import { DataTable } from "@/shared/components/data-table";
import { DataTablePagination } from "@/shared/components/data-table-pagination";
import { useGeneralTable } from "@/hooks/use-general-table";
import { mockBudgetStats, mockCostBreakdown, mockPaginatedTransactions } from "./_mock/budget";
import { budgetTransactionColumns } from "./budget-columns";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function BudgetTab() {
  const stats = mockBudgetStats;
  const { data: transactions, total, page, pageSize } = mockPaginatedTransactions;

  const table = useGeneralTable(transactions, budgetTransactionColumns);

  const totalPages = Math.ceil(total / pageSize);
  const paginationMeta = {
    page,
    limit: pageSize,
    totalItems: total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - stats.remainingPct / 100);

  return (
    <div className="p-6 space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Budget */}
        <div className="bg-sidebar border rounded-lg p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <IconBuildingBank className="text-primary" strokeWidth={1.5} size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Budget</p>
            <p className="text-lg font-semibold">{formatCurrency(stats.totalBudget)}</p>
          </div>
        </div>

        {/* Amount Spent */}
        <div className="bg-sidebar border rounded-lg p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
            <IconTrendingDown className="text-destructive" strokeWidth={1.5} size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Amount Spent</p>
            <p className="text-lg font-semibold">{formatCurrency(stats.amountSpent)}</p>
          </div>
        </div>

        {/* Remaining Balance with ring */}
        <div className="bg-sidebar border rounded-lg p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
            <IconPigMoney className="text-success" strokeWidth={1.5} size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Remaining Balance</p>
            <p className="text-lg font-semibold">{formatCurrency(stats.remaining)}</p>
          </div>
          {/* Circular progress ring */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg width={72} height={72} viewBox="0 0 72 72">
              <circle
                cx={36}
                cy={36}
                r={r}
                fill="none"
                stroke="var(--muted)"
                strokeWidth={8}
              />
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
            <span className="absolute text-xs font-semibold text-success">
              {stats.remainingPct}%
            </span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-sidebar border rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-semibold">Cost Breakdown</h3>
        {mockCostBreakdown.map((item) => {
          const pct = Math.round((item.spent / item.total) * 100);
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">
                  {formatCurrency(item.spent)} / {formatCurrency(item.total)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.colorClass}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Recent Transactions</h3>
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
    </div>
  );
}
