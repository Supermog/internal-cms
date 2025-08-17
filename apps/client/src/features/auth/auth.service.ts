import { axiosClient } from "@/lib/axios";
import { AuthenticatedUserResponseDto } from "@internal-cms/shared";

// Function to fetch user from database via API
const fetchDatabaseUser = async (userId: string) => {
  const response = await axiosClient.get<AuthenticatedUserResponseDto>(
    `/auth/user/${userId}`
  );

  return response.data;
};

export const authService = Object.freeze({ fetchDatabaseUser });
