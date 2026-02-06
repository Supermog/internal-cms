import { axiosClient } from "@/lib/axios";
import { ValidateInviteResponseDto, HttpError } from "@internal-cms/shared";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export async function validateInvite(
  code: string
): Promise<ValidateInviteResponseDto> {
  const response = await axiosClient.post<ValidateInviteResponseDto>(
    `/invites/validate/${code}`
  );

  return response.data;
}

export const validateInviteQueryKey = (code: string) => [
  "invites",
  "validate",
  code,
];

export function useValidateInvite(
  code: string | null,
  queryOptions?: UseQueryOptions<ValidateInviteResponseDto, HttpError>
) {
  return useQuery({
    queryKey: validateInviteQueryKey(code || ""),
    queryFn: () => validateInvite(code!),
    enabled: !!code,
    ...queryOptions,
  });
}
