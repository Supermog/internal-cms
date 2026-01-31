import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import type { BadgeType } from "@/components/ui/badge";
import { useGetClientTickets } from "@/features/tickets/api/get-client-tickets";
import type { TicketRow } from "@/features/tickets/api/get-client-tickets";
import { Ticket } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { TicketPriority, TicketStatus } from "@internal-cms/shared";
import { startCase } from "lodash-es";
import { format } from "date-fns";

type ClientTicketsSectionProps = {
  clientId: string;
  /** When true, omit outer card styling (for use inside a parent card). */
  embedded?: boolean;
};

function statusToBadgeType(status: TicketStatus): BadgeType {
  switch (status) {
    case "TODO":
      return "blue";
    case "IN_PROGRESS":
      return "orange";
    case "DONE":
      return "green";
    default:
      return "orange";
  }
}

function priorityToBadgeType(priority: TicketPriority): BadgeType {
  switch (priority) {
    case "LOW":
      return "blue";
    case "MID":
      return "orange";
    case "HIGH":
      return "red";
    default:
      return "orange";
  }
}

const columns: ColumnDef<TicketRow, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<TicketStatus>();
      return (
        <Badge variant="outline" type={statusToBadgeType(status)}>
          {startCase(status.toLowerCase())}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ getValue }) => {
      const priority = getValue<TicketPriority>();
      return (
        <Badge variant="outline" type={priorityToBadgeType(priority)}>
          {startCase(priority.toLowerCase())}
        </Badge>
      );
    },
  },
  {
    accessorKey: "estimated_hours",
    header: () => <span className="text-right block w-full">Est. hours</span>,
    cell: ({ getValue }) => {
      const value = getValue<number | null>();
      return (
        <span className="block text-right">{value != null ? value : "—"}</span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground text-sm">
        {format(new Date(getValue<string>()), "dd-MM-yyyy")}
      </span>
    ),
  },
];

export function ClientTicketsSection({
  clientId,
  embedded = false,
}: ClientTicketsSectionProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [clientId]);

  const { data, isLoading, isError, refetch } = useGetClientTickets(clientId, {
    page,
    limit,
  });

  const tickets = data?.data ?? [];
  const totalCount = data?.meta?.total;

  const handlePaginationChange = (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => {
    setPage(pagination.pageIndex + 1);
    setLimit(pagination.pageSize);
  };

  return (
    <div
      className={cn(
        embedded ? "space-y-4" : "bg-white border rounded-lg p-6 space-y-4"
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Ticket className="w-5 h-5" />
          Tickets
        </h2>
      </div>

      <DataTable
        key={clientId}
        columns={columns}
        data={tickets}
        isLoading={isLoading}
        isError={isError}
        onErrorRetry={() => refetch()}
        enablePagination={true}
        enableSorting={true}
        pageSize={limit}
        totalCount={totalCount}
        onPaginationChange={handlePaginationChange}
        emptyMessage="No tickets found"
        emptyDescription="There are no tickets for this client yet."
      />
    </div>
  );
}
