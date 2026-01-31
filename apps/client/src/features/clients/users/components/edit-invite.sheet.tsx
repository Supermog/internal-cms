import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUpdateInvite } from "@/features/invites/api/update-invite";
import { Invite, Client } from "@internal-cms/shared";
import { useQueryClient } from "@tanstack/react-query";
import { getClientUsersQueryKey } from "@/features/clients/users/api/get-client-users";

const editInviteSchema = z.object({
  name: z.string().min(1, "Required"),
});

type EditInviteFormValues = z.infer<typeof editInviteSchema>;

type EditInviteSheetProps = {
  client: Client;
  invite?: Invite;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditInviteSheet({
  client,
  invite,
  open,
  onOpenChange,
}: EditInviteSheetProps) {
  const queryClient = useQueryClient();
  const initialName = invite?.name ?? "";

  const form = useForm<EditInviteFormValues>({
    resolver: zodResolver(editInviteSchema),
    defaultValues: {
      name: initialName,
    },
  });

  // Reset form when invite changes
  useEffect(() => {
    form.reset({
      name: initialName,
    });
  }, [initialName, form]);

  const updateInviteMutation = useUpdateInvite({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getClientUsersQueryKey(client.id),
      });
      onOpenChange(false);
      form.reset();
    },
  });

  async function onSubmit(values: EditInviteFormValues) {
    if (invite) {
      await updateInviteMutation.mutateAsync({
        id: invite.id,
        data: { name: values.name },
      });
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Edit Invitation</SheetTitle>
          <SheetDescription>
            Update the name for this invitation.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    value={invite?.email ?? ""}
                    disabled
                    className="bg-gray-50"
                  />
                </FormControl>
                <p className="text-sm text-gray-500 mt-1">
                  Email cannot be changed.
                </p>
              </FormItem>

              <div className="pt-2 flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                  className="w-1/3"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={
                    form.formState.isSubmitting ||
                    updateInviteMutation.isPending
                  }
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
