import supabase from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { AdminUser, ClientUser, DatabaseUser } from "@internal-cms/shared";
import { axiosClient } from "@/lib/axios";
import { authService } from "./auth.service";

export enum QueryStatus {
  Idle = "IDLE",
  Loading = "LOADING",
  Success = "SUCCESS",
  Error = "ERROR",
}

async function setAxiosHeader(accessToken?: string) {
  if (accessToken) {
    axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    delete axiosClient.defaults.headers.common.Authorization;
  }
}

function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [databaseUser, setDatabaseUser] = useState<DatabaseUser | null>(null);
  const [status, setStatus] = useState<QueryStatus>(QueryStatus.Idle);

  useEffect(() => {
    setStatus(QueryStatus.Loading);

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setSession(session);
        setAxiosHeader(session?.access_token);

        if (session?.user?.id) {
          const { database_user } = await authService.fetchDatabaseUser(
            session.user.id
          );
          setDatabaseUser(database_user);
          setStatus(database_user ? QueryStatus.Success : QueryStatus.Error);
        } else {
          // No session, clear user data
          setDatabaseUser(null);
          setStatus(QueryStatus.Success);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const isIdle = status === QueryStatus.Idle;
  const isLoading = status === QueryStatus.Loading;
  const isSuccess = status === QueryStatus.Success;
  const isError = status === QueryStatus.Error;

  // Utility properties
  const isAuthenticated = !!session?.user;

  const isAdmin = (databaseUser: DatabaseUser): databaseUser is AdminUser =>
    databaseUser?.role === "admin";

  const isClientUser = (
    databaseUser: DatabaseUser
  ): databaseUser is ClientUser => databaseUser?.role === "client";

  return {
    session,
    databaseUser,
    status,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    isAuthenticated,
    isAdmin,
    isClientUser,
  };
}

export { useAuth };
