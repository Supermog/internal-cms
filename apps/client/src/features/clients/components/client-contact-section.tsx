import { User, Mail } from "lucide-react";
import { Client } from "@internal-cms/shared";

type ClientContactSectionProps = {
  client: Client;
};

export function ClientContactSection({ client }: ClientContactSectionProps) {
  return (
    <div className="bg-white border rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <User className="w-5 h-5" />
        Key Contact
      </h2>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-gray-400" />
          <span>{client.key_contact_name}</span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-gray-400" />
          <a
            href={`mailto:${client.key_contact_email}`}
            className="text-blue-600 hover:underline"
          >
            {client.key_contact_email}
          </a>
        </div>
      </div>
    </div>
  );
}
