import { axiosClient } from "@/lib/axios";
import {
  HttpError,
  GetClientUsersAndInvitesResponseDto,
} from "@internal-cms/shared";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export async function getClientUsers(
  clientId: string
): Promise<GetClientUsersAndInvitesResponseDto> {
  const response = await axiosClient.get<GetClientUsersAndInvitesResponseDto>(
    `/clients/${clientId}/users`
  );

  return response.data;
}

export const getClientUsersQueryKey = (clientId: string) => [
  "client",
  clientId,
  "users",
];

export function useGetClientUsers(
  clientId: string,
  queryOptions?: UseQueryOptions<GetClientUsersAndInvitesResponseDto, HttpError>
) {
  return useQuery({
    queryKey: getClientUsersQueryKey(clientId),
    queryFn: () => getClientUsers(clientId),
    enabled: !!clientId,
    ...queryOptions,
  });
}
