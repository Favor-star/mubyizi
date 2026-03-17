import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import * as React from "react";

type GeneralTableOptions = {
  defaultPage?: number;
  defaultLimit?: number;
};

export function useGeneralTable<TData>(
  data: TData[],
  columns: ColumnDef<TData>[],
  options?: GeneralTableOptions
) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [page, setPage] = React.useState(options?.defaultPage ?? 1);
  const [limit, setLimit] = React.useState(options?.defaultLimit ?? 10);

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
      pagination: { pageIndex: page - 1, pageSize: limit }
    },
    onPaginationChange: (updater) => {
      const current: PaginationState = { pageIndex: page - 1, pageSize: limit };
      const next = typeof updater === "function" ? updater(current) : updater;
      setPage(next.pageIndex + 1);
      setLimit(next.pageSize);
    },
    manualPagination: false
  });

  return { table, page, limit, setPage, setLimit };
}
