import { axiosClient } from "@/lib/axios";
import {
  AcceptInviteDto,
  SignUpResponseDto,
  HttpError,
} from "@internal-cms/shared";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export async function acceptInvite(
  data: AcceptInviteDto
): Promise<SignUpResponseDto> {
  const response = await axiosClient.post<SignUpResponseDto>(
    "/auth/signup",
    data
  );

  return response.data;
}

export function useAcceptInvite(
  mutationOptions?: UseMutationOptions<
    SignUpResponseDto,
    HttpError,
    AcceptInviteDto
  >
) {
  return useMutation({
    mutationFn: acceptInvite,
    ...mutationOptions,
  });
}
