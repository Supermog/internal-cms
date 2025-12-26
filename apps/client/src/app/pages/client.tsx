import { PageTitle } from "@/components/page-title";
import { Badge, BadgeType } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { useGetClient } from "@/features/clients/api/get-client";
import { useGetClientUsers } from "@/features/clients/api/get-client-users";
import { EditClientSheet } from "@/features/clients/components/edit-client.sheet";
import { AddUserSheet } from "@/features/clients/components/add-user.sheet";
import { EditInviteSheet } from "@/features/clients/components/edit-invite.sheet";
import { useDeleteInvite } from "@/features/invites/api/delete-invite";
import { useDeleteUser } from "@/features/users/api/delete-user";
import { capitalize } from "lodash-es";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  Pencil,
  Plus,
  Trash2,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { getClientUsersQueryKey } from "@/features/clients/api/get-client-users";

function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading, isError } = useGetClient(id!);
  const {
    data: usersAndInvites,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useGetClientUsers(id!);
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingInvite, setEditingInvite] = useState<{
    id: string;
  } | null>(null);
  const [deleting, setDeleting] = useState<{
    type: "user" | "invite";
    id: string;
    name: string;
    email: string;
  } | null>(null);

  const deleteUserMutation = useDeleteUser({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getClientUsersQueryKey(id!),
      });
      setDeleting(null);
    },
  });

  const deleteInviteMutation = useDeleteInvite({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getClientUsersQueryKey(id!),
      });
      setDeleting(null);
    },
  });

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

  const pendingInvitations = usersAndInvites?.invites?.filter(
    (invite) => invite.status === "pending"
  );

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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Users
          </h2>
          <Button
            variant="outline"
            leadingIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddUserOpen(true)}
          >
            Add User
          </Button>
        </div>
        {isLoadingUsers ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : isErrorUsers ? (
          <p className="text-gray-500 text-sm">Failed to load users.</p>
        ) : usersAndInvites ? (
          <>
            {usersAndInvites.users && usersAndInvites.users.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">
                  Active Users
                </h3>
                <div className="divide-y">
                  {usersAndInvites.users.map((user) => (
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
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" type="blue">
                          {capitalize(user.role ?? "User")}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDeleting({
                              type: "user",
                              id: user.id,
                              name: user.name,
                              email: user.email,
                            })
                          }
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {pendingInvitations && pendingInvitations.length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="text-sm font-medium text-gray-700">
                  Pending Invitations
                </h3>
                <div className="divide-y">
                  {pendingInvitations.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{invite.name}</p>
                          <p className="text-sm text-gray-500">
                            {invite.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" type="orange">
                          Pending
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setEditingInvite({
                              id: invite.id,
                            })
                          }
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDeleting({
                              type: "invite",
                              id: invite.id,
                              name: invite.name,
                              email: invite.email,
                            })
                          }
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(!usersAndInvites.users || usersAndInvites.users.length === 0) &&
              (!usersAndInvites.invites ||
                usersAndInvites.invites.filter((i) => i.status === "pending")
                  .length === 0) && (
                <p className="text-gray-500 text-sm">
                  No users or pending invitations found for this client.
                </p>
              )}
          </>
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
      <AddUserSheet
        client={client}
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
      />
      {editingInvite && (
        <EditInviteSheet
          client={client}
          invite={
            editingInvite
              ? usersAndInvites?.invites.find((i) => i.id === editingInvite.id)
              : undefined
          }
          open={!!editingInvite}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setEditingInvite(null);
            }
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null);
          }
        }}
        title={`Delete ${deleting?.type === "user" ? "User" : "Invitation"}`}
        description={`Are you sure you want to delete ${deleting?.name} (${deleting?.email})? This action cannot be undone.`}
        onConfirm={() => {
          if (deleting) {
            if (deleting.type === "user") {
              deleteUserMutation.mutate(deleting.id);
            } else {
              deleteInviteMutation.mutate(deleting.id);
            }
          }
        }}
        isLoading={
          deleteUserMutation.isPending || deleteInviteMutation.isPending
        }
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
