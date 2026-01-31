import { createBrowserRouter, Navigate } from "react-router-dom";
import { RouteWrapper } from "./route-wrapper";
import { routePaths } from "./config/route-paths.config";
import { SignIn } from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth/sign-up";
import { ForgotPassword } from "./pages/auth/forgot-password";
import { ResetPassword } from "./pages/auth/reset-password";
import { AuthLayout } from "./layouts/auth.layout";
import { GuestGuard } from "@/features/auth/guards/guest-guard";
import { Dashboard } from "./pages/admin/dashboard";
import { AuthGuard } from "@/features/auth/guards/auth-guard";
import { MainLayout } from "./layouts/main.layout";
import { Clients } from "./pages/admin/clients";
import { ClientDetail } from "./pages/admin/client";
import { ClientDashboard } from "./pages/client/dashboard";

const commonRoutes = [
  {
    element: <RouteWrapper guard={GuestGuard} layout={AuthLayout} />,
    children: [
      { path: routePaths.signIn, element: <SignIn /> },
      { path: routePaths.signUp, element: <SignUp /> },
      { path: routePaths.forgotPassword, element: <ForgotPassword /> },
    ],
  },
  {
    element: <RouteWrapper layout={AuthLayout} />,
    children: [{ path: routePaths.resetPassword, element: <ResetPassword /> }],
  },
  { path: "*", element: <Navigate to={routePaths.home} replace /> },
];

const adminRouter = createBrowserRouter(
  [
    {
      element: <RouteWrapper guard={AuthGuard} layout={MainLayout} />,
      children: [
        { path: routePaths.home, element: <Dashboard /> },
        { path: routePaths.clients, element: <Clients /> },
        { path: routePaths.clientDetail, element: <ClientDetail /> },
      ],
    },
    ...commonRoutes,
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

const clientRouter = createBrowserRouter(
  [
    {
      element: <RouteWrapper guard={AuthGuard} layout={MainLayout} />,
      children: [{ path: routePaths.home, element: <ClientDashboard /> }],
    },
    ...commonRoutes,
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

export { adminRouter, clientRouter };
