import { CheckCircle2, XCircle } from "lucide-react";
import { Client } from "@internal-cms/shared";

type ClientSupportFeaturesSectionProps = {
  client: Client;
};

function SupportFeature({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {enabled ? (
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      ) : (
        <XCircle className="w-5 h-5 text-gray-300" />
      )}
      <span className={enabled ? "text-gray-900" : "text-gray-400"}>
        {label}
      </span>
    </div>
  );
}

export function ClientSupportFeaturesSection({
  client,
}: ClientSupportFeaturesSectionProps) {
  return (
    <div className="bg-white border rounded-lg p-6 space-y-4 md:col-span-2">
      <h2 className="text-lg font-semibold">Support Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SupportFeature
          label="Covered by Support"
          enabled={client.is_covered_by_support}
        />
        <SupportFeature
          label="Monthly Checked"
          enabled={client.is_monthly_checked ?? false}
        />
        <SupportFeature
          label="Proactive Support"
          enabled={client.is_proactive_support ?? false}
        />
      </div>
    </div>
  );
}
