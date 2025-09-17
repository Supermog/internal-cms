import { axiosClient } from "@/lib/axios";
import {
  Client,
  GetAllClientsQueryDto,
  HttpError,
  PaginatedResponse,
} from "@internal-cms/shared";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export async function getClients(
  data: GetAllClientsQueryDto
): Promise<PaginatedResponse<Client>> {
  const response = await axiosClient.get<PaginatedResponse<Client>>(
    "/clients",
    { params: data }
  );

  return response.data;
}

const queryKey = (params: GetAllClientsQueryDto) => ["clients", params];

export function useGetClients(
  params: GetAllClientsQueryDto,
  queryOptions?: UseQueryOptions<PaginatedResponse<Client>, HttpError>
) {
  return useQuery({
    queryKey: queryKey(params),
    queryFn: () => getClients(params),
    ...queryOptions,
  });
}
