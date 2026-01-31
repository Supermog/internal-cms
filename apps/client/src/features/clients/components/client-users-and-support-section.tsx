import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Client } from "@internal-cms/shared";
import { ClientSupportMonthsSection } from "@/features/clients/support_hours/components/client-support-months-section";
import { ClientUsersSection } from "@/features/clients/users/components/client-users-section";
import { Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type View = "users" | "support-hours";

type ClientUsersAndSupportSectionProps = {
  client: Client;
  clientId: string;
};

export function ClientUsersAndSupportSection({
  client,
  clientId,
}: ClientUsersAndSupportSectionProps) {
  const [activeView, setActiveView] = useState<View>("users");

  return (
    <div className="space-y-0">
      <div className="flex rounded-t-lg border border-b-0 bg-gray-50/80 p-2 gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2",
            activeView === "users"
              ? "bg-white shadow-sm border text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveView("users")}
        >
          <Users className="w-4 h-4" />
          Users
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2",
            activeView === "support-hours"
              ? "bg-white shadow-sm border text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveView("support-hours")}
        >
          <Clock className="w-4 h-4" />
          Support Hours
        </Button>
      </div>
      <div className="rounded-b-lg border border-t-0 bg-white p-6">
        {activeView === "users" && (
          <ClientUsersSection client={client} clientId={clientId} embedded />
        )}
        {activeView === "support-hours" && (
          <ClientSupportMonthsSection
            client={client}
            clientId={clientId}
            embedded
          />
        )}
      </div>
    </div>
  );
}
