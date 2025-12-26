import { axiosClient } from "@/lib/axios";
import { UpdateUserDto, DatabaseUser, HttpError } from "@internal-cms/shared";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export async function updateUser(
  id: string,
  data: UpdateUserDto
): Promise<DatabaseUser> {
  const response = await axiosClient.patch<DatabaseUser>(
    `/auth/user/${id}`,
    data
  );

  return response.data;
}

export function useUpdateUser(
  mutationOptions?: UseMutationOptions<
    DatabaseUser,
    HttpError,
    { id: string; data: UpdateUserDto }
  >
) {
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    ...mutationOptions,
  });
}
