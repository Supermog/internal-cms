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
import { Dashboard } from "../admin/pages/dashboard";
import { AuthGuard } from "@/features/auth/guards/auth-guard";
import { Clients } from "../admin/pages/clients";
import { ClientDetail } from "../admin/pages/client";
import { ClientDashboard } from "../client/pages/dashboard";
import { ClientUsersPage } from "../client/pages/users";
import { ClientSupportHoursPage } from "../client/pages/support-hours";
import { ClientTicketsPage } from "../client/pages/tickets";
import { AdminLayout } from "@/admin/layouts/admin-layout";
import { ClientLayout } from "@/client/layouts/client-layout";
import { AdminUserProvider } from "@/features/auth/admin-user.context";
import { ClientUserProvider } from "@/features/auth/client-user.context";

const commonRouter = createBrowserRouter(
  [
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
    { path: "*", element: <Navigate to={commonRoutePaths.signIn} replace /> },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

const adminRouter = createBrowserRouter(
  [
    {
      element: (
        <AdminUserProvider>
          <RouteWrapper guard={AuthGuard} layout={AdminLayout} />
        </AdminUserProvider>
      ),
      children: [
        { path: adminRoutePaths.home, element: <Dashboard /> },
        { path: adminRoutePaths.clients, element: <Clients /> },
        { path: adminRoutePaths.clientDetail, element: <ClientDetail /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

const clientRouter = createBrowserRouter(
  [
    {
      element: (
        <ClientUserProvider>
          <RouteWrapper guard={AuthGuard} layout={ClientLayout} />
        </ClientUserProvider>
      ),
      children: [
        { path: clientRoutePaths.home, element: <ClientDashboard /> },
        { path: clientRoutePaths.clientUsers, element: <ClientUsersPage /> },
        {
          path: clientRoutePaths.clientSupportHours,
          element: <ClientSupportHoursPage />,
        },
        {
          path: clientRoutePaths.clientTickets,
          element: <ClientTicketsPage />,
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

export { adminRouter, clientRouter, commonRouter };
