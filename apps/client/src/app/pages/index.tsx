import { RouterProvider } from "react-router-dom";
import { router } from "../router";
import { HelmetProvider } from "react-helmet-async";
import { AuthUserProvider } from "@/features/auth/auth-user.context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthUserProvider>
          <RouterProvider
            router={router}
            future={{ v7_startTransition: true }}
          />
        </AuthUserProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
