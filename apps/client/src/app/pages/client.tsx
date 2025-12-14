import { PageTitle } from "@/components/page-title";
import { Badge, BadgeType } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetClient } from "@/features/clients/api/get-client";
import { useGetClientUsers } from "@/features/clients/api/get-client-users";
import { EditClientSheet } from "@/features/clients/components/edit-client.sheet";
import { capitalize } from "lodash-es";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  Pencil,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading, isError } = useGetClient(id!);
  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useGetClientUsers(id!);
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
      <div className="flex items-start justify-between">
        <PageTitle
          title={client.name}
          description={`Short name: ${client.short_name}`}
        />
        <div className="flex items-center gap-3">
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
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

        {/* Support Details */}
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

        {/* Support Features */}
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
      </div>

      {/* Users Section */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Users
        </h2>
        {isLoadingUsers ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : isErrorUsers ? (
          <p className="text-gray-500 text-sm">Failed to load users.</p>
        ) : users && users.length > 0 ? (
          <div className="divide-y">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Badge variant="outline" type="blue">
                  {capitalize(user.role ?? "User")}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No users found for this client.
          </p>
        )}
      </div>

      <EditClientSheet
        client={client}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </div>
  );
}

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

export { ClientDetail };
