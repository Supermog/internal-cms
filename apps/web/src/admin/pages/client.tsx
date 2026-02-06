import { PageHeader } from "@/components/page-header";
import { PageTitle } from "@/components/page-title";
import { Badge, BadgeType } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetClient } from "@/admin/features/clients/api/get-client";
import { EditClientSheet } from "@/admin/features/clients/components/edit-client.sheet";
import { ClientContactSection } from "@/admin/features/clients/components/client-contact-section";
import { ClientSupportDetailsSection } from "@/admin/features/clients/components/client-support-details-section";
import { ClientSupportFeaturesSection } from "@/admin/features/clients/components/client-support-features-section";
import { ClientTabbedSection } from "@/admin/features/clients/components/client-tabbed-section";
import { capitalize } from "lodash-es";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

function ClientDetail() {
  const { id = "" } = useParams<{ id: string }>();
  const { data: client, isLoading, isError } = useGetClient(id!);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (isError || !client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load client details.</p>
      </div>
    );
  }

  const statusType: BadgeType =
    client.support_status === "HEALTHY" ? "green" : "red";

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          <PageTitle
            title={client.name}
            description={`Short name: ${client.short_name}`}
          />
        }
        actions={
          <>
            <Button
              variant="outline"
              leadingIcon={<Pencil className="w-4 h-4" />}
              onClick={() => setIsEditOpen(true)}
            >
              Edit
            </Button>
            <Badge variant="outline" type={statusType}>
              {capitalize(client.support_status)}
            </Badge>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClientContactSection client={client} />
        <ClientSupportDetailsSection client={client} />
        <ClientSupportFeaturesSection client={client} />
      </div>

      <ClientTabbedSection client={client} clientId={id!} />

      <EditClientSheet
        client={client}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </div>
  );
}

export { ClientDetail };
