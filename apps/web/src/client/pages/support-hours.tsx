import { PageHeader } from "@/components/page-header";
import { PageTitle } from "@/components/page-title";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthUser } from "@/admin/features/auth/auth-user.context";
import { useGetClient } from "@/admin/features/clients/api/get-client";
import { ClientSupportMonthsSection } from "@/admin/features/clients/support_hours/components/client-support-months-section";
import type { ClientUser } from "@internal-cms/shared";

function ClientSupportHoursPage() {
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
        <Skeleton className="h-64 w-full" />
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
            title="Support Hours"
            description="View and manage support hours for your organization"
          />
        }
      />
      <ClientSupportMonthsSection
        isShowManageHoursButton={false}
        client={client}
        clientId={clientId}
      />
    </div>
  );
}

export { ClientSupportHoursPage };
