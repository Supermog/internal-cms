import { axiosClient } from "@/lib/axios";
import { CreateInviteDto, Invite, HttpError } from "@internal-cms/shared";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export async function createInvite(data: CreateInviteDto): Promise<Invite> {
  const response = await axiosClient.post<Invite>("/invites", data);

  return response.data;
}

export function useCreateInvite(
  mutationOptions?: UseMutationOptions<Invite, HttpError, CreateInviteDto>
) {
  return useMutation({
    mutationFn: createInvite,
    ...mutationOptions,
  });
}
