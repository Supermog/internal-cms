import { createBrowserRouter } from "react-router-dom";
import { RouteWrapper } from "./route-wrapper";
import { routePaths } from "./config/route-paths.config";
import { SignIn } from "./pages/auth/sign-in";
import { AuthLayout } from "./layouts/auth.layout";

const router = createBrowserRouter([
  {
    element: <RouteWrapper guard={null} layout={AuthLayout} />,
    children: [{ path: routePaths.signIn, element: <SignIn /> }],
  },
]);

export { router };
