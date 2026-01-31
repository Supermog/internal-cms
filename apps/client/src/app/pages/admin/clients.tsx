import { PageHeader } from "@/components/page-header";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useGetClients } from "@/features/clients/api/get-clients";
import { Client } from "@internal-cms/shared";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Plus } from "lucide-react";
import { capitalize } from "lodash-es";
import { Badge, BadgeType } from "@/components/ui/badge";
import { useState } from "react";
import { CreateClientSheet } from "@/features/clients/components/create-client.sheet";
import { generatePath, useNavigate } from "react-router-dom";
import { routePaths } from "../../config/route-paths.config";

function Clients() {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const {
    data: clients,
    isLoading,
    isError,
  } = useGetClients({
    page: 1,
    limit: 10,
  });

  const columns: ColumnDef<Client, unknown>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "key_contact_name",
      header: "Key Contact",
      cell: ({ row, getValue }) => {
        const keyContactName = getValue<string>();
        const keyContactEmail = row.original.key_contact_email;
        return (
          <div>
            <p className="">{keyContactName}</p>
            <p className="text-sm text-gray-600">{keyContactEmail}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "support_level",
      header: "Support Level",
      cell: ({ row }) => (
        <span>{capitalize(row.getValue<string>("support_level"))}</span>
      ),
    },
    {
      accessorKey: "support_status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<"HEALTHY" | "NEEDS_ATTENTION">();
        let type: BadgeType = "green";
        switch (status) {
          case "HEALTHY":
            type = "green";
            break;
          case "NEEDS_ATTENTION":
            type = "red";
            break;
        }
        return (
          <Badge variant="outline" type={type}>
            {capitalize(status)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            navigate(
              generatePath(routePaths.clientDetail, { id: row.original.id })
            )
          }
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title={
          <PageTitle title="Clients" description="Client overview and status" />
        }
        actions={
          <Button
            leadingIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateOpen(true)}
          >
            Add Client
          </Button>
        }
      />
      <div>
        <DataTable
          columns={columns}
          data={clients?.data || []}
          isLoading={isLoading}
          isError={isError}
          enablePagination={true}
          enableSorting={true}
        />
      </div>
      <CreateClientSheet open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}

export { Clients };
