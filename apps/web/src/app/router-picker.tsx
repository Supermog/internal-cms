import { RouterProvider } from "react-router-dom";
import { adminRouter, clientRouter } from "./router";
import { useAuthUser } from "@/features/auth/auth-user.context";

function RouterPicker() {
  const { isClientUser } = useAuthUser();

  return (
    <RouterProvider
      key={isClientUser ? "client" : "admin"}
      router={isClientUser ? clientRouter : adminRouter}
      future={{ v7_startTransition: true }}
    />
  );
}

export { RouterPicker };
