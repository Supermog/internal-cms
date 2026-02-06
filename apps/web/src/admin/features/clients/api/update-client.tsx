import { axiosClient } from "@/lib/axios";
import { Client, UpdateClientDto, HttpError } from "@internal-cms/shared";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export async function updateClient(
  id: string,
  data: UpdateClientDto
): Promise<Client> {
  const response = await axiosClient.patch<Client>(`/clients/${id}`, data);

  return response.data;
}

export function useUpdateClient(
  mutationOptions?: UseMutationOptions<
    Client,
    HttpError,
    { id: string; data: UpdateClientDto }
  >
) {
  return useMutation({
    mutationFn: ({ id, data }) => updateClient(id, data),
    ...mutationOptions,
  });
}
