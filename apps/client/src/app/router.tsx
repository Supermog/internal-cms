import { createBrowserRouter, Navigate } from "react-router-dom";
import { RouteWrapper } from "./route-wrapper";
import {
  adminRoutePaths,
  clientRoutePaths,
  commonRoutePaths,
} from "./config/route-paths.config";
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
import { ClientUsersPage } from "./pages/client/users";
import { ClientSupportHoursPage } from "./pages/client/support-hours";

const commonRoutes = [
  {
    element: <RouteWrapper guard={GuestGuard} layout={AuthLayout} />,
    children: [
      { path: commonRoutePaths.signIn, element: <SignIn /> },
      { path: commonRoutePaths.signUp, element: <SignUp /> },
      { path: commonRoutePaths.forgotPassword, element: <ForgotPassword /> },
    ],
  },
  {
    element: <RouteWrapper layout={AuthLayout} />,
    children: [
      { path: commonRoutePaths.resetPassword, element: <ResetPassword /> },
    ],
  },
  { path: "*", element: <Navigate to={commonRoutePaths.home} replace /> },
];

const adminRouter = createBrowserRouter(
  [
    {
      element: <RouteWrapper guard={AuthGuard} layout={MainLayout} />,
      children: [
        { path: adminRoutePaths.home, element: <Dashboard /> },
        { path: adminRoutePaths.clients, element: <Clients /> },
        { path: adminRoutePaths.clientDetail, element: <ClientDetail /> },
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
      children: [
        { path: clientRoutePaths.home, element: <ClientDashboard /> },
        { path: clientRoutePaths.clientUsers, element: <ClientUsersPage /> },
        {
          path: clientRoutePaths.clientSupportHours,
          element: <ClientSupportHoursPage />,
        },
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

export { adminRouter, clientRouter };
