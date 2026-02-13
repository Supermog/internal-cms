import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { RouterPicker } from "../router-picker";

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterPicker />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
