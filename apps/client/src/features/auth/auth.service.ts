import { axiosClient } from "@/lib/axios";
import { DatabaseUser } from "@internal-cms/shared";

// Function to fetch user from database via API
const fetchDatabaseUser = async (userId: string) => {
  const response = await axiosClient.get(`/auth/user/${userId}`);

  return response.data.database_user as DatabaseUser;
};

export const authService = Object.freeze({ fetchDatabaseUser });
