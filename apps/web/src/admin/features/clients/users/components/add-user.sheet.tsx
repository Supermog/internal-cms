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
import { useCreateInvite } from "@/admin/features/invites/api/create-invite";
import { CreateInviteDto, UserRole, Client } from "@internal-cms/shared";
import { useQueryClient } from "@tanstack/react-query";
import { getClientUsersQueryKey } from "@/admin/features/clients/users/api/get-client-users";

const addUserSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

type AddUserSheetProps = {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddUserSheet({
  client,
  open,
  onOpenChange,
}: AddUserSheetProps) {
  const queryClient = useQueryClient();
  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const createInviteMutation = useCreateInvite({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getClientUsersQueryKey(client.id),
      });
      onOpenChange(false);
      form.reset();
    },
  });

  async function onSubmit(values: AddUserFormValues) {
    const payload: CreateInviteDto = {
      ...values,
      role: UserRole.CLIENT,
      client_uid: client.id,
    };
    await createInviteMutation.mutateAsync(payload);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Add User</SheetTitle>
          <SheetDescription>
            Send an invitation to add a new user to this client.
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jane@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  isLoading={form.formState.isSubmitting}
                >
                  Send Invitation
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
