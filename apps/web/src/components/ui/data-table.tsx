import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  PaginationState,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Pagination } from "./pagination";
import { AlertCircle, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  onErrorRetry?: () => void;
  // Pagination
  enablePagination?: boolean;
  pageSize?: number;
  totalCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  // Row selection
  enableRowSelection?: boolean;
  enableMultiRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  // Sorting
  enableSorting?: boolean;
  // Loading and error states
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  // Empty state
  emptyMessage?: string;
  emptyDescription?: string;
  // Styling
  className?: string;
  tableClassName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  isError = false,
  onErrorRetry,
  enablePagination = true,
  pageSize = 10,
  totalCount,
  onPaginationChange,
  enableRowSelection = false,
  enableMultiRowSelection = true,
  onRowSelectionChange,
  enableSorting = true,
  errorTitle = "Failed to load data",
  errorMessage = "Unable to fetch data. Please try again.",
  emptyMessage = "No data available",
  emptyDescription = "There are no records to display.",
  className,
  tableClassName,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  // Enhanced columns with selection
  const enhancedColumns = React.useMemo(() => {
    if (!enableRowSelection) return columns;

    const selectionColumn: ColumnDef<TData, TValue> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };

    return [selectionColumn, ...columns];
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel:
      enablePagination && !totalCount ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      setPagination(newPagination);
      onPaginationChange?.(newPagination);
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination,
    },
    enableRowSelection,
    enableMultiRowSelection,
    manualPagination: !!totalCount,
    pageCount: totalCount ? Math.ceil(totalCount / pageSize) : undefined,
  });

  // Handle row selection changes
  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedData = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onRowSelectionChange(selectedData);
    }
  }, [rowSelection, onRowSelectionChange, table]);

  // Determine which state to show
  const getTableState = () => {
    if (isLoading) return "loading";
    if (isError) return "error";
    if (!data || data.length === 0) return "empty";
    return "normal";
  };

  const renderTableBody = () => {
    const state = getTableState();

    switch (state) {
      case "loading":
        return (
          <TableRow>
            <TableCell
              colSpan={enhancedColumns.length}
              className="h-40 text-center"
            ></TableCell>
          </TableRow>
        );

      case "error":
        return (
          <TableRow>
            <TableCell
              colSpan={enhancedColumns.length}
              className="h-32 text-center"
            >
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-destructive mb-3">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {errorTitle}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mb-3">
                  {errorMessage}
                </p>
                {onErrorRetry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onErrorRetry}
                    className="text-xs"
                  >
                    Try Again
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        );

      case "empty":
        return (
          <TableRow>
            <TableCell
              colSpan={enhancedColumns.length}
              className="h-32 text-center"
            >
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-muted-foreground mb-3">
                  <Database className="w-8 h-8 mx-auto mb-2" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {emptyMessage}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  {emptyDescription}
                </p>
              </div>
            </TableCell>
          </TableRow>
        );

      case "normal":
      default:
        return table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ));
    }
  };

  const renderLoadingOverlay = () => {
    if (getTableState() !== "loading") return null;

    return (
      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
        <div className="flex flex-col items-center space-y-2">
          <Spinner size="md" />
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Table */}
      <div className="rounded-md border relative">
        <Table className={tableClassName}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{renderTableBody()}</TableBody>
        </Table>
        {renderLoadingOverlay()}
      </div>

      {/* Pagination */}
      {enablePagination && (
        <Pagination table={table} enableRowSelection={enableRowSelection} />
      )}
    </div>
  );
}
