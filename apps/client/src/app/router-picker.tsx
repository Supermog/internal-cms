import { RouterProvider } from "react-router-dom";
import { useAuth } from "@/features/auth/use-auth";
import { adminRouter, clientRouter } from "./router";

function RouterPicker() {
  const { isClientUser } = useAuth();

  const isUseClientRouter = isClientUser;

  return (
    <RouterProvider
      key={isUseClientRouter ? "client" : "admin"}
      router={isUseClientRouter ? clientRouter : adminRouter}
      future={{ v7_startTransition: true }}
    />
  );
}

export { RouterPicker };
