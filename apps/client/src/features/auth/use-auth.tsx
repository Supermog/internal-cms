import supabase from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export enum QueryStatus {
  Idle = "IDLE",
  Loading = "LOADING",
  Success = "SUCCESS",
  Error = "ERROR",
}

function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<QueryStatus>(QueryStatus.Idle);

  useEffect(() => {
    setStatus(QueryStatus.Loading);
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);

      setStatus(QueryStatus.Success);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const isIdle = status === QueryStatus.Idle;
  const isLoading = status === QueryStatus.Loading;
  const isSuccess = status === QueryStatus.Success;
  const isError = status === QueryStatus.Error;

  return { session, status, isIdle, isLoading, isSuccess, isError };
}

export { useAuth };
