import { axiosClient } from "@/lib/axios";
import { UpdateInviteDto, Invite, HttpError } from "@internal-cms/shared";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export async function updateInvite(
  id: string,
  data: UpdateInviteDto
): Promise<Invite> {
  const response = await axiosClient.patch<Invite>(`/invites/${id}`, data);

  return response.data;
}

export function useUpdateInvite(
  mutationOptions?: UseMutationOptions<
    Invite,
    HttpError,
    { id: string; data: UpdateInviteDto }
  >
) {
  return useMutation({
    mutationFn: ({ id, data }) => updateInvite(id, data),
    ...mutationOptions,
  });
}
