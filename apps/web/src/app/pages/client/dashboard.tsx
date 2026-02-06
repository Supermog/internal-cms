import { PageHeader } from "@/components/page-header";
import { PageTitle } from "@/components/page-title";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthUser } from "@/features/auth/auth-user.context";
import { useGetClient } from "@/features/clients/api/get-client";
import { ClientContactSection } from "@/features/clients/components/client-contact-section";
import { ClientSupportDetailsSection } from "@/features/clients/components/client-support-details-section";
import { ClientSupportFeaturesSection } from "@/features/clients/components/client-support-features-section";
import type { ClientUser } from "@internal-cms/shared";

function ClientDashboard() {
  const { databaseUser } = useAuthUser();
  const clientId =
    databaseUser && "client_uid" in databaseUser
      ? (databaseUser as ClientUser).client_uid
      : null;
  const { data: client, isLoading, isError } = useGetClient(clientId ?? "");

  if (!clientId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          You don’t have access to this page.
        </p>
      </div>
    );
  }

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
        <p className="text-muted-foreground">Failed to load organization.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          <PageTitle
            title={client.name}
            description={`Short name: ${client.short_name}`}
          />
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClientContactSection client={client} />
        <ClientSupportDetailsSection client={client} />
        <ClientSupportFeaturesSection client={client} />
      </div>
    </div>
  );
}

export { ClientDashboard };
