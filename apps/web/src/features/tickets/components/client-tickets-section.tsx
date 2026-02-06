import { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import type { BadgeType } from "@/components/ui/badge";
import { useGetClientTickets } from "@/features/tickets/api/get-client-tickets";
import type { TicketRow } from "@/features/tickets/api/get-client-tickets";
import {
  ActionsDropdown,
  ActionsDropdownItem,
} from "@/components/actions-dropdown";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { TicketPriority, TicketStatus } from "@internal-cms/shared";
import { startCase } from "lodash-es";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";

type ClientTicketsSectionProps = {
  clientId: string;
  /** When true, omit outer card styling (for use inside a parent card). */
  embedded?: boolean;
  /** Items for the actions dropdown. */
  actionItems: ActionsDropdownItem[];
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

function buildColumns(
  actionItems: ActionsDropdownItem[]
): ColumnDef<TicketRow, unknown>[] {
  return [
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
          <span className="block text-right">
            {value != null ? value : "—"}
          </span>
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
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const ticket = row.original;
        return (
          <ActionsDropdown
            trigger={<MoreVertical className="h-4 w-4" />}
            items={actionItems.map((item) => ({
              label: item.label,
              onClick: () => item.onClick(ticket),
            }))}
          />
        );
      },
    },
  ];
}

export function ClientTicketsSection({
  clientId,
  embedded = false,
  actionItems,
}: ClientTicketsSectionProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const columns = useMemo(() => buildColumns(actionItems), [actionItems]);

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
