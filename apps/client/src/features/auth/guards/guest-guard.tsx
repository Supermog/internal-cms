import { routePaths } from "@/app/config/route-paths.config";
import * as React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../use-auth";

type GuestGuardProps = {
  children?: React.ReactNode;
};

function GuestGuard({ children }: GuestGuardProps) {
  const { session, isIdle, isLoading } = useAuth();

  if (isIdle || isLoading) {
    return <div>Loading...</div>;
  }

  if (session) {
    return <Navigate to={routePaths.home} />;
  }

  return <>{children}</>;
}

export { GuestGuard };
