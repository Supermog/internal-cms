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
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateClient } from "@/features/clients/api/create-client";
import { CreateClientDto } from "@internal-cms/shared";
import { useQueryClient } from "@tanstack/react-query";

const createClientSchema = z.object({
  name: z.string().min(1, "Required"),
  short_name: z.string().min(1, "Required"),
  support_level: z.string().min(1, "Required"),
  key_contact_email: z.string().email("Invalid email"),
  key_contact_name: z.string().min(1, "Required"),
  is_covered_by_support: z.boolean().optional(),
  is_monthly_checked: z.boolean().optional(),
  is_proactive_support: z.boolean().optional(),
  hours_per_month: z.coerce.number().optional(),
  support_renewal_date: z.string().optional(),
});

type CreateClientFormValues = z.infer<typeof createClientSchema>;

type CreateClientSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateClientSheet({
  open,
  onOpenChange,
}: CreateClientSheetProps) {
  const queryClient = useQueryClient();
  const form = useForm<CreateClientFormValues>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      short_name: "",
      support_level: "",
      key_contact_email: "",
      key_contact_name: "",
      is_covered_by_support: true,
      is_monthly_checked: false,
      is_proactive_support: false,
      hours_per_month: undefined,
      support_renewal_date: "",
    },
  });

  const createClientMutation = useCreateClient({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
      onOpenChange(false);
      form.reset();
    },
  });

  async function onSubmit(values: CreateClientFormValues) {
    const payload: CreateClientDto = {
      ...values,
      hours_per_month:
        typeof values.hours_per_month === "number" &&
        !Number.isNaN(values.hours_per_month)
          ? values.hours_per_month
          : undefined,
      support_renewal_date:
        values.support_renewal_date && values.support_renewal_date.length > 0
          ? values.support_renewal_date
          : undefined,
    };
    await createClientMutation.mutateAsync(payload);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Add Client</SheetTitle>
          <SheetDescription>
            Enter details to create a new client.
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
                      <Input placeholder="Acme Corporation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="short_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Name</FormLabel>
                    <FormControl>
                      <Input placeholder="acme" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="support_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Level</FormLabel>
                    <FormControl>
                      <Input placeholder="standard | premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="key_contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="key_contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jane@acme.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="is_covered_by_support"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={!!field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(Boolean(checked))
                          }
                        />
                      </FormControl>
                      <FormLabel className="!m-0">Covered by support</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_monthly_checked"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={!!field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(Boolean(checked))
                          }
                        />
                      </FormControl>
                      <FormLabel className="!m-0">Monthly checked</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_proactive_support"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={!!field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(Boolean(checked))
                          }
                        />
                      </FormControl>
                      <FormLabel className="!m-0">Proactive support</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hours_per_month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours per month</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="10"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="support_renewal_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support renewal date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                  Create Client
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
