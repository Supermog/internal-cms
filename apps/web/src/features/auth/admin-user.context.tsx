import { createContext, useContext } from "react";
import { useAuth } from "./use-auth";
import { Session } from "@supabase/supabase-js";
import type { AdminUser } from "@internal-cms/shared";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorFallback } from "@/components/ui/error-fallback";

type AdminUserContextType = {
  session: Session;
  databaseUser: AdminUser;
};

const AdminUserContext = createContext<AdminUserContextType | undefined>(
  undefined,
);

export type AdminUserProviderProps = {
  children?: React.ReactNode;
};

function AdminUserProvider({ children }: AdminUserProviderProps) {
  const { session, databaseUser, isLoading, isError, isClient, isSuccess } =
    useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !isSuccess) {
    return <ErrorFallback variant="fullscreen" />;
  }

  if (isClient(databaseUser!)) {
    throw new Error("User is not an admin");
  }

  const contextValue: AdminUserContextType = {
    /**
     * After isLoading and isError checks we can safely assume that databaseUser is not null
     */
    session: session!,
    databaseUser: databaseUser! as AdminUser,
  };

  return (
    <AdminUserContext.Provider value={contextValue}>
      {children}
    </AdminUserContext.Provider>
  );
}

function useAdminUser() {
  const context = useContext(AdminUserContext);

  if (context === undefined) {
    throw new Error("useAdminUser must be used within an AdminUserProvider");
  }

  return context;
}

export { AdminUserProvider, useAdminUser };
