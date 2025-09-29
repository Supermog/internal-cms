import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useGetClients } from "@/features/clients/api/get-clients";
import { Client } from "@internal-cms/shared";
import { createColumnHelper } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { capitalize } from "lodash-es";
import { Badge, BadgeType } from "@/components/ui/badge";

function Clients() {
  const {
    data: clients,
    isLoading,
    isError,
  } = useGetClients({
    page: 1,
    limit: 10,
  });

  const columnHelper = createColumnHelper<Client>();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      id: "name",
    }),
    columnHelper.accessor("key_contact_name", {
      header: "Key Contact",
      id: "key_contact",
      cell: (info) => {
        const keyContactName = info.getValue();
        const keyContactEmail = info.row.original.key_contact_email;
        return (
          <div>
            <p className="">{keyContactName}</p>
            <p className="text-sm text-gray-600">{keyContactEmail}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("support_level", {
      header: "Support Level",
      id: "support_level",
      cell: ({ row }) => (
        <span>{capitalize(row.getValue("support_level"))}</span>
      ),
    }),
    columnHelper.accessor("support_status", {
      header: "Status",
      id: "support_status",
      cell: (info) => {
        const status = info.getValue();

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
    }),
  ];

  return (
    <div className="space-y-4">
      <PageTitle title="Clients" description="Client overview and status" />
      <div className="flex justify-end">
        <Button leadingIcon={<Plus className="w-4 h-4" />}>Add Client</Button>
      </div>
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
    </div>
  );
}

export { Clients };
