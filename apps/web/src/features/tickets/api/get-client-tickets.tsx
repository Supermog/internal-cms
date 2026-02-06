import { axiosClient } from "@/lib/axios";
import { Database, HttpError, PaginatedResponse } from "@internal-cms/shared";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export type TicketRow = Database["public"]["Tables"]["tickets"]["Row"];

export type GetClientTicketsParams = {
  page?: number;
  limit?: number;
};

export async function getClientTickets(
  clientId: string,
  params?: GetClientTicketsParams
): Promise<PaginatedResponse<TicketRow>> {
  const searchParams = new URLSearchParams();

  if (params?.page != null) {
    searchParams.set("page", String(params.page));
  }

  if (params?.limit != null) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  const url = `/tickets/client/${clientId}${query ? `?${query}` : ""}`;

  const response = await axiosClient.get<PaginatedResponse<TicketRow>>(url);

  return response.data;
}

export const getClientTicketsQueryKey = (
  clientId: string,
  params?: GetClientTicketsParams
) => ["tickets", "client", clientId, params?.page ?? 1, params?.limit ?? 10];

export function useGetClientTickets(
  clientId: string,
  params?: GetClientTicketsParams,
  queryOptions?: UseQueryOptions<PaginatedResponse<TicketRow>, HttpError>
) {
  return useQuery({
    queryKey: getClientTicketsQueryKey(clientId, params),
    queryFn: () => getClientTickets(clientId, params),
    enabled: !!clientId,
    ...queryOptions,
  });
}
