import { axiosClient } from "@/lib/axios";
import { DatabaseUser, HttpError } from "@internal-cms/shared";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export async function getClientUsers(
  clientId: string
): Promise<DatabaseUser[]> {
  const response = await axiosClient.get<DatabaseUser[]>(
    `/clients/${clientId}/users`
  );

  return response.data;
}

const queryKey = (clientId: string) => ["client", clientId, "users"];

export function useGetClientUsers(
  clientId: string,
  queryOptions?: UseQueryOptions<DatabaseUser[], HttpError>
) {
  return useQuery({
    queryKey: queryKey(clientId),
    queryFn: () => getClientUsers(clientId),
    enabled: !!clientId,
    ...queryOptions,
  });
}
