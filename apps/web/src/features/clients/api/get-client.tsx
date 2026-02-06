import { axiosClient } from "@/lib/axios";
import { Client, HttpError } from "@internal-cms/shared";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export async function getClient(id: string): Promise<Client> {
  const response = await axiosClient.get<Client>(`/clients/${id}`);

  return response.data;
}

export const getClientQueryKey = (id: string) => ["client", id];

export function useGetClient(
  id: string,
  queryOptions?: UseQueryOptions<Client, HttpError>
) {
  return useQuery({
    queryKey: getClientQueryKey(id),
    queryFn: () => getClient(id),
    enabled: !!id,
    ...queryOptions,
  });
}
