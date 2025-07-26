import { RouterProvider } from "react-router-dom";
import { router } from "../router";
import { HelmetProvider } from "react-helmet-async";
import { AuthUserProvider } from "@/features/auth/auth-user.context";

function App() {
  return (
    <HelmetProvider>
      <AuthUserProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </AuthUserProvider>
    </HelmetProvider>
  );
}

export default App;
