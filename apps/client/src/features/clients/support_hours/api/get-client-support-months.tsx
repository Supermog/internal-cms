import { axiosClient } from "@/lib/axios";
import { Database } from "@internal-cms/shared";
import { HttpError } from "@internal-cms/shared";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type SupportMonth =
  Database["public"]["Tables"]["client_support_months"]["Row"];

export async function getClientSupportMonths(
  clientId: string,
  year?: number
): Promise<SupportMonth[]> {
  const params = year ? { year } : {};
  const response = await axiosClient.get<SupportMonth[]>(
    `/clients/${clientId}/support-months`,
    { params }
  );

  return response.data;
}

export const getClientSupportMonthsQueryKey = (
  clientId: string,
  year?: number
) => ["client", clientId, "support-months", year || new Date().getFullYear()];

export function useGetClientSupportMonths(
  clientId: string,
  year?: number,
  queryOptions?: UseQueryOptions<SupportMonth[], HttpError>
) {
  return useQuery({
    queryKey: getClientSupportMonthsQueryKey(clientId, year),
    queryFn: () => getClientSupportMonths(clientId, year),
    enabled: !!clientId,
    ...queryOptions,
  });
}
