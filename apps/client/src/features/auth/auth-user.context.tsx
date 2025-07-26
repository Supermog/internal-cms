import { createContext, useContext } from "react";
import { useAuth } from "./use-auth";
import { Session } from "@supabase/supabase-js";

type AuthUserContextType = {
  session: Session | null;
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
  const { session, isLoading, isError } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    // TODO: handle error
    return <div>Error</div>;
  }

  const contextValue = {
    session,
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
