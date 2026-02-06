import { axiosClient } from "@/lib/axios";
import { DeleteInviteResponseDto, HttpError } from "@internal-cms/shared";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export async function deleteInvite(
  id: string
): Promise<DeleteInviteResponseDto> {
  const response = await axiosClient.delete<DeleteInviteResponseDto>(
    `/invites/${id}`
  );

  return response.data;
}

export function useDeleteInvite(
  mutationOptions?: UseMutationOptions<
    DeleteInviteResponseDto,
    HttpError,
    string
  >
) {
  return useMutation({
    mutationFn: deleteInvite,
    ...mutationOptions,
  });
}
