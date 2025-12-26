import { axiosClient } from "@/lib/axios";
import { DeleteUserResponseDto, HttpError } from "@internal-cms/shared";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export async function deleteUser(id: string): Promise<DeleteUserResponseDto> {
  const response = await axiosClient.delete<DeleteUserResponseDto>(
    `/auth/user/${id}`
  );

  return response.data;
}

export function useDeleteUser(
  mutationOptions?: UseMutationOptions<DeleteUserResponseDto, HttpError, string>
) {
  return useMutation({
    mutationFn: deleteUser,
    ...mutationOptions,
  });
}
