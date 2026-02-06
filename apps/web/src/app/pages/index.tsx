import { HelmetProvider } from "react-helmet-async";
import { AuthUserProvider } from "@/admin/features/auth/auth-user.context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { RouterPicker } from "../router-picker";

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthUserProvider>
          <RouterPicker />
        </AuthUserProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
