import { type Table } from "@tanstack/react-table";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react";

import { Button } from "@workspace/ui/components/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

interface DataTablePaginationProps {
  meta: PaginationMeta;
  limit: number;
  page: number;
  setLimit: (limit: number) => void;
  setPage: (page: number) => void;
  table: Table<any>;
}

export function DataTablePagination({
  meta,
  table,
  setLimit,
  setPage,
  page,
  limit
}: Readonly<DataTablePaginationProps>) {
  return (
    <div className="flex items-center justify-between px-2 flex-col gap-2 md:flex-row ">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        (Total: {meta.totalItems})
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8 flex-col gap-3 md:flex-row  ">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${limit}`}
            onValueChange={(v) => {
              setLimit(Number(v));
              setPage(1);
            }}>
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <div className="flex w-25 items-center justify-center text-sm font-medium">
            Page {page} of {meta.totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className=" size-8 lg:flex"
              onClick={() => setPage(1)}
              disabled={!meta.hasPrevPage}>
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPage(page - 1)}
              disabled={!meta.hasPrevPage}>
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPage(page + 1)}
              disabled={!meta.hasNextPage}>
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className=" size-8 lg:flex"
              onClick={() => setPage(meta.totalPages)}
              disabled={!meta.hasNextPage}>
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
