import { createContext, useContext } from "react";
import { useAuth } from "./use-auth";
import { Session } from "@supabase/supabase-js";
import type { ClientUser } from "@internal-cms/shared";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorFallback } from "@/components/ui/error-fallback";

type ClientUserContextType = {
  session: Session;
  databaseUser: ClientUser;
};

const ClientUserContext = createContext<ClientUserContextType | undefined>(
  undefined,
);

export type ClientUserProviderProps = {
  children?: React.ReactNode;
};

function ClientUserProvider({ children }: ClientUserProviderProps) {
  const { session, databaseUser, isLoading, isError, isClient, isSuccess } =
    useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !isSuccess) {
    return <ErrorFallback variant="fullscreen" />;
  }

  if (!isClient(databaseUser!)) {
    throw new Error("User is not a client");
  }

  const contextValue: ClientUserContextType = {
    /**
     * After isLoading and isError checks we can safely assume that databaseUser is not null
     */
    session: session!,
    databaseUser: databaseUser! as ClientUser,
  };

  return (
    <ClientUserContext.Provider value={contextValue}>
      {children}
    </ClientUserContext.Provider>
  );
}

function useClientUser() {
  const context = useContext(ClientUserContext);

  if (context === undefined) {
    throw new Error("useClientUser must be used within a ClientUserProvider");
  }

  return context;
}

export { ClientUserProvider, useClientUser };
