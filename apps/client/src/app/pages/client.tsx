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
import { ClientContactSection } from "@/features/clients/components/client-contact-section";
import { ClientSupportDetailsSection } from "@/features/clients/components/client-support-details-section";
import { ClientSupportFeaturesSection } from "@/features/clients/components/client-support-features-section";
import { ClientSupportMonthsSection } from "@/features/clients/components/client-support-months-section";
import { ClientUsersSection } from "@/features/clients/components/client-users-section";
import { useDeleteInvite } from "@/features/invites/api/delete-invite";
import { useDeleteUser } from "@/features/users/api/delete-user";
import { capitalize } from "lodash-es";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { getClientUsersQueryKey } from "@/features/clients/api/get-client-users";

function ClientDetail() {
  const { id = "" } = useParams<{ id: string }>();
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
        <ClientContactSection client={client} />
        <ClientSupportDetailsSection client={client} />
        <ClientSupportFeaturesSection client={client} />
      </div>

      <ClientSupportMonthsSection client={client} clientId={id!} />

      <ClientUsersSection
        clientId={id!}
        usersAndInvites={usersAndInvites}
        isLoading={isLoadingUsers}
        isError={isErrorUsers}
        onAddUser={() => setIsAddUserOpen(true)}
        onEditInvite={(inviteId) =>
          setEditingInvite({
            id: inviteId,
          })
        }
        onDeleteUser={(user) =>
          setDeleting({
            type: "user",
            id: user.id,
            name: user.name,
            email: user.email,
          })
        }
        onDeleteInvite={(invite) =>
          setDeleting({
            type: "invite",
            id: invite.id,
            name: invite.name,
            email: invite.email,
          })
        }
      />

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

export { ClientDetail };
