import { createContext, useContext } from "react";
import { useAuth } from "./use-auth";
import { Session } from "@supabase/supabase-js";
import type { DatabaseUser } from "@internal-cms/shared";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorFallback } from "@/components/ui/error-fallback";

type AuthUserContextType = {
  session: Session | null;
  databaseUser: DatabaseUser | null;
};

const AuthUserContext = createContext<AuthUserContextType | undefined>(
  undefined
);

export type AuthUserProviderProps = {
  children?: React.ReactNode;
};

/**
 * Provides dependency injection for the auth user state.
 *
 * If the user is signed in, it renders children - children can use the
 * state of the context with auth user being type-safe & knowing that user
 * is authenticated.
 *
 * If the user is not signed in, it will redirect to the sign in page.
 *
 * Don't confuse the `useAuthUser` (useContext) hook with the (regular) `useAuthUserQuery`
 * hook. `useAuth` is for data querying, while `useAuthUser` is for dependency injection.
 */
function AuthUserProvider({ children }: AuthUserProviderProps) {
  const { session, databaseUser, isLoading, isError } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <ErrorFallback variant="fullscreen" />;
  }

  const contextValue = {
    session,
    databaseUser,
  };

  return (
    <AuthUserContext.Provider value={contextValue}>
      {children}
    </AuthUserContext.Provider>
  );
}

function useAuthUser() {
  const context = useContext(AuthUserContext);

  if (context === undefined) {
    throw new Error("useAuthUser must be used within an AuthUserProvider");
  }

  return context;
}

export { AuthUserProvider, useAuthUser };
