import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { Mail, Pencil, Plus, Trash2, User } from "lucide-react";
import { Client, Invite, DatabaseUser } from "@internal-cms/shared";
import { capitalize } from "lodash-es";
import { useGetClientUsers } from "@/admin/features/clients/users/api/get-client-users";
import { useDeleteUser } from "@/admin/features/users/api/delete-user";
import { useDeleteInvite } from "@/admin/features/invites/api/delete-invite";
import { useQueryClient } from "@tanstack/react-query";
import { getClientUsersQueryKey } from "@/admin/features/clients/users/api/get-client-users";
import { AddUserSheet } from "./add-user.sheet";
import { EditInviteSheet } from "./edit-invite.sheet";

type ClientUsersSectionProps = {
  client: Client;
  clientId: string;
  /** When true, omit outer card styling (for use inside a parent card). */
  embedded?: boolean;
};

export function ClientUsersSection({
  client,
  clientId,
  embedded = false,
}: ClientUsersSectionProps) {
  const {
    data: usersAndInvites,
    isLoading,
    isError,
  } = useGetClientUsers(clientId);
  const queryClient = useQueryClient();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingInviteId, setEditingInviteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<{
    type: "user" | "invite";
    id: string;
    name: string;
    email: string;
  } | null>(null);

  const deleteUserMutation = useDeleteUser({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getClientUsersQueryKey(clientId),
      });
      setDeleting(null);
    },
  });

  const deleteInviteMutation = useDeleteInvite({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getClientUsersQueryKey(clientId),
      });
      setDeleting(null);
    },
  });

  const editingInvite = editingInviteId
    ? usersAndInvites?.invites.find((i) => i.id === editingInviteId)
    : undefined;

  const pendingInvitations = usersAndInvites?.invites?.filter(
    (invite) => invite.status === "pending",
  );

  return (
    <>
      <div
        className={
          embedded ? "space-y-4" : "bg-white border rounded-lg p-6 space-y-4"
        }
      >
        <div className="flex items-center justify-start">
          <Button
            variant="outline"
            leadingIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddUserOpen(true)}
          >
            Add User
          </Button>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : isError ? (
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
                    <UserRow
                      key={user.id}
                      user={user}
                      onDelete={() =>
                        setDeleting({
                          type: "user",
                          id: user.id,
                          name: user.name,
                          email: user.email,
                        })
                      }
                    />
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
                    <InviteRow
                      key={invite.id}
                      invite={invite}
                      onEdit={() => setEditingInviteId(invite.id)}
                      onDelete={() =>
                        setDeleting({
                          type: "invite",
                          id: invite.id,
                          name: invite.name,
                          email: invite.email,
                        })
                      }
                    />
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

      <AddUserSheet
        client={client}
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
      />
      <EditInviteSheet
        client={client}
        invite={editingInvite}
        open={!!editingInviteId}
        onOpenChange={(open) => {
          if (!open) setEditingInviteId(null);
        }}
      />
      <DeleteConfirmationDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
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
    </>
  );
}

function UserRow({
  user,
  onDelete,
}: {
  user: DatabaseUser;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
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
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}

function InviteRow({
  invite,
  onEdit,
  onDelete,
}: {
  invite: Invite;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Mail className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <p className="font-medium">{invite.name}</p>
          <p className="text-sm text-gray-500">{invite.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline" type="orange">
          Pending
        </Badge>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}
