import { axiosClient } from "@/lib/axios";
import { Invite, HttpError } from "@internal-cms/shared";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export async function getInviteByCode(code: string): Promise<Invite> {
  const response = await axiosClient.get<Invite>(`/invites/by-code/${code}`);

  return response.data;
}

export const getInviteByCodeQueryKey = (code: string) => [
  "invites",
  "by-code",
  code,
];

export function useGetInviteByCode(
  code: string | null,
  queryOptions?: UseQueryOptions<Invite, HttpError>
) {
  return useQuery({
    queryKey: getInviteByCodeQueryKey(code || ""),
    queryFn: () => getInviteByCode(code!),
    enabled: !!code,
    ...queryOptions,
  });
}
