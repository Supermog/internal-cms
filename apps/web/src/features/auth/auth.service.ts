import { axiosClient } from "@/lib/axios";
import { AuthenticatedUserResponseDto } from "@internal-cms/shared";

// Function to fetch user from database via API
const fetchDatabaseUser = async (userId: string) => {
  const response = await axiosClient.get<AuthenticatedUserResponseDto>(
    `/auth/user/${userId}`
  );

  return response.data;
};

// Function to request password reset email
const forgotPassword = async (email: string) => {
  const response = await axiosClient.post<{ message: string }>(
    `/auth/forgot-password`,
    { email },
    { disableToast: true }
  );

  return response.data;
};

// Function to reset password with token
const resetPassword = async (password: string, token: string) => {
  const response = await axiosClient.post<{ message: string }>(
    `/auth/reset-password`,
    { password, token },
    { disableToast: true }
  );

  return response.data;
};

export const authService = Object.freeze({
  fetchDatabaseUser,
  forgotPassword,
  resetPassword,
});
