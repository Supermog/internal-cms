import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Client } from "@internal-cms/shared";
import { ClientSupportMonthsSection } from "@/features/clients/support_hours/components/client-support-months-section";
import { ClientUsersSection } from "@/features/clients/users/components/client-users-section";
import { ClientTicketsSection } from "@/features/tickets/components/client-tickets-section";
import { Users, Clock, Ticket, Eye, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionsDropdownItem } from "@/components/actions-dropdown";

type TabId = "users" | "support-hours" | "tickets";

type ClientTabbedSectionProps = {
  client: Client;
  clientId: string;
};

const actionItems: ActionsDropdownItem[] = [
  {
    label: (
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4" />
        <span>View</span>
      </div>
    ),
    onClick: () => {},
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <Pencil className="w-4 h-4" />
        <span>Edit</span>
      </div>
    ),
    onClick: () => {},
  },
];

export function ClientTabbedSection({
  client,
  clientId,
}: ClientTabbedSectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>("users");

  return (
    <div className="space-y-0">
      <div className="flex rounded-t-lg border border-b-0 bg-gray-50/80 p-2 gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2",
            activeTab === "users"
              ? "bg-white shadow-sm border text-foreground hover:bg-white hover:shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab("users")}
        >
          <Users className="w-4 h-4" />
          Users
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2",
            activeTab === "support-hours"
              ? "bg-white shadow-sm border text-foreground hover:bg-white hover:shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab("support-hours")}
        >
          <Clock className="w-4 h-4" />
          Support Hours
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2",
            activeTab === "tickets"
              ? "bg-white shadow-sm border text-foreground hover:bg-white hover:shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab("tickets")}
        >
          <Ticket className="w-4 h-4" />
          Tickets
        </Button>
      </div>
      <div className="rounded-b-lg border border-t-0 bg-white p-6">
        {activeTab === "users" && (
          <ClientUsersSection client={client} clientId={clientId} embedded />
        )}
        {activeTab === "support-hours" && (
          <ClientSupportMonthsSection
            client={client}
            clientId={clientId}
            embedded
          />
        )}
        {activeTab === "tickets" && (
          <ClientTicketsSection
            clientId={clientId}
            embedded
            actionItems={actionItems}
          />
        )}
      </div>
    </div>
  );
}
