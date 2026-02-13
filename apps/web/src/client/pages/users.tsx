import { PageHeader } from "@/components/page-header";
import { PageTitle } from "@/components/page-title";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetClient } from "@/admin/features/clients/api/get-client";
import { ClientUsersSection } from "@/admin/features/clients/users/components/client-users-section";
import { useClientUser } from "@/features/auth/client-user.context";

function ClientUsersPage() {
  const { databaseUser } = useClientUser();

  const clientId = databaseUser.client_uid;

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
        <Skeleton className="h-48 w-full" />
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
            title="Users"
            description="Manage users in your organization"
          />
        }
      />
      <ClientUsersSection client={client} clientId={clientId} />
    </div>
  );
}

export { ClientUsersPage };
