import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "./button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps<TData> {
  table: Table<TData>;
  enableRowSelection?: boolean;
  showRowCount?: boolean;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination<TData>({
  table,
  enableRowSelection = false,
  showRowCount = true,
  showPageSize = true,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className,
}: PaginationProps<TData>) {
  return (
    <div
      className={`flex items-center justify-between px-2 ${className || ""}`}
    >
      <div className="flex-1 text-sm text-muted-foreground">
        {enableRowSelection && (
          <span className="mr-4">
            {table.getSelectedRowModel().rows.length} of{" "}
            {table.getRowModel().rows.length} row(s) selected.
          </span>
        )}
        {showRowCount && (
          <>
            Showing{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getRowModel().rows.length
            )}{" "}
            of {table.getRowModel().rows.length} entries
          </>
        )}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        {showPageSize && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
            >
              {pageSizeOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
