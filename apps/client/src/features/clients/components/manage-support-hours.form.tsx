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
import { useManageSupportHours } from "@/features/clients/api/manage-support-hours";
import { ManageSupportHoursAction } from "@internal-cms/shared";
import { useQueryClient } from "@tanstack/react-query";
import { getClientSupportMonthsQueryKey } from "@/features/clients/api/get-client-support-months";

const manageSupportHoursSchema = z.object({
  action: z.enum(["add", "remove"]),
  hours: z.coerce.number().min(0.01, "Hours must be greater than 0"),
});

type ManageSupportHoursFormValues = z.infer<typeof manageSupportHoursSchema>;

type ManageSupportHoursFormProps = {
  clientId: string;
  supportMonthId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function ManageSupportHoursForm({
  clientId,
  supportMonthId,
  onSuccess,
  onCancel,
}: ManageSupportHoursFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<ManageSupportHoursFormValues>({
    resolver: zodResolver(manageSupportHoursSchema),
    defaultValues: {
      action: "add",
      hours: 0,
    },
  });

  const manageSupportHoursMutation = useManageSupportHours({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getClientSupportMonthsQueryKey(clientId, undefined),
      });
      form.reset();
      onSuccess?.();
    },
  });

  const onSubmit = (values: ManageSupportHoursFormValues) => {
    manageSupportHoursMutation.mutate({
      clientId,
      id: supportMonthId,
      action: values.action as ManageSupportHoursAction,
      hours: values.hours,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="add">Add Hours</option>
                  <option value="remove">Remove Hours</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hours</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter hours"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={manageSupportHoursMutation.isPending}
          >
            {form.watch("action") === "add" ? "Add Hours" : "Remove Hours"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
