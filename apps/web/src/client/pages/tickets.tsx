import { PageHeader } from "@/components/page-header";
import { PageTitle } from "@/components/page-title";
import { useClientUser } from "@/features/auth/client-user.context";
import { ClientTicketsSection } from "@/admin/features/tickets/components/client-tickets-section";

function ClientTicketsPage() {
  const { databaseUser } = useClientUser();

  const clientId = databaseUser.client_uid;

  if (!clientId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          You don’t have access to this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          <PageTitle
            title="Tickets"
            description="View tickets for your organization"
          />
        }
      />
      <ClientTicketsSection clientId={clientId} actionItems={[]} />
    </div>
  );
}

export { ClientTicketsPage };
