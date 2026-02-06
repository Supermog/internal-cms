import { axiosClient } from "@/lib/axios";
import { Client, CreateClientDto, HttpError } from "@internal-cms/shared";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export async function createClient(data: CreateClientDto): Promise<Client> {
  const response = await axiosClient.post<Client>("/clients", data);

  return response.data;
}

export function useCreateClient(
  mutationOptions?: UseMutationOptions<Client, HttpError, CreateClientDto>
) {
  return useMutation({
    mutationFn: createClient,
    ...mutationOptions,
  });
}
