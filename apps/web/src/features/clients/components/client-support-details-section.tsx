import { Building2, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Client } from "@internal-cms/shared";
import { capitalize } from "lodash-es";

type ClientSupportDetailsSectionProps = {
  client: Client;
};

export function ClientSupportDetailsSection({
  client,
}: ClientSupportDetailsSectionProps) {
  return (
    <div className="bg-white border rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        Support Details
      </h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Support Level</span>
          <Badge variant="outline" type="blue">
            {capitalize(client.support_level)}
          </Badge>
        </div>
        {client.hours_per_month !== null && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Hours per Month
            </span>
            <span className="font-medium">{client.hours_per_month}</span>
          </div>
        )}
        {client.support_renewal_date && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Renewal Date
            </span>
            <span className="font-medium">
              {new Date(client.support_renewal_date).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
