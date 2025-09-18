import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";

// Example data type
interface Client {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
}

// Example data
const clients: Client[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "inactive",
    createdAt: "2024-01-20",
  },
];

// Example columns
const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          row.getValue("status") === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.getValue("status")}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];

// Example usage
export function ClientsTable() {
  return (
    <DataTable
      columns={columns}
      data={clients}
      enablePagination={true}
      enableSorting={true}
    />
  );
}

// Example with loading state
export function LoadingClientsTable() {
  return (
    <DataTable
      columns={columns}
      data={[]}
      isLoading={true}
      loadingMessage="Loading clients..."
    />
  );
}

// Example with error state
export function ErrorClientsTable() {
  return (
    <DataTable
      columns={columns}
      data={[]}
      error={new Error("Network error")}
      errorTitle="Failed to load clients"
      errorMessage="Unable to fetch client data. Please check your connection."
      onErrorRetry={() => window.location.reload()}
    />
  );
}

// Example with empty state
export function EmptyClientsTable() {
  return (
    <DataTable
      columns={columns}
      data={[]}
      emptyMessage="No clients found"
      emptyDescription="Get started by adding your first client."
    />
  );
}
