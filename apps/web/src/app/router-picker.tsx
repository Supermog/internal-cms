import { RouterProvider } from "react-router-dom";
import { adminRouter, clientRouter, commonRouter } from "./router";
import { useAuth } from "@/features/auth/use-auth";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorFallback } from "@/components/ui/error-fallback";

function RouterPicker() {
  const { session, isError, isIdle, isLoading, isClient, databaseUser } =
    useAuth();

  let router = commonRouter;

  if (isIdle || isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <ErrorFallback variant="fullscreen" />;
  }

  if (session && databaseUser) {
    router = isClient(databaseUser) ? clientRouter : adminRouter;
  }

  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  );
}

export { RouterPicker };
