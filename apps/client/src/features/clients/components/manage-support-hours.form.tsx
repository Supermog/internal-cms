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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="add" id="add" />
                    <Label
                      htmlFor="add"
                      className="cursor-pointer font-normal text-sm"
                    >
                      Add Hours
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="remove" id="remove" />
                    <Label
                      htmlFor="remove"
                      className="cursor-pointer font-normal text-sm"
                    >
                      Remove Hours
                    </Label>
                  </div>
                </RadioGroup>
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
                  inputMode="numeric"
                  type="text"
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
