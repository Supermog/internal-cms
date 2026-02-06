import { axiosClient } from "@/lib/axios";
import {
  Database,
  ManageSupportHoursDto,
  ManageSupportHoursAction,
  HttpError,
} from "@internal-cms/shared";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export type SupportMonth =
  Database["public"]["Tables"]["client_support_months"]["Row"];

export async function manageSupportHours(
  clientId: string,
  id: string,
  action: ManageSupportHoursAction,
  hours: number,
): Promise<SupportMonth> {
  const response = await axiosClient.patch<SupportMonth>(
    `/clients/${clientId}/support-months/${id}/${action}`,
    { hours } as ManageSupportHoursDto,
  );

  return response.data;
}

export function useManageSupportHours(
  mutationOptions?: UseMutationOptions<
    SupportMonth,
    HttpError,
    {
      clientId: string;
      id: string;
      action: ManageSupportHoursAction;
      hours: number;
    }
  >,
) {
  return useMutation({
    mutationFn: ({ clientId, id, action, hours }) =>
      manageSupportHours(clientId, id, action, hours),
    ...mutationOptions,
  });
}
