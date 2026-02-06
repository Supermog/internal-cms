export const commonRoutePaths = Object.freeze({
  home: "/",
  signIn: "/auth/sign-in",
  signUp: "/sign-up",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/reset-password",
});

export const adminRoutePaths = Object.freeze({
  ...commonRoutePaths,
  clients: "/clients",
  clientDetail: "/clients/:id",
});

export const clientRoutePaths = Object.freeze({
  ...commonRoutePaths,
  clientUsers: "/users",
  clientSupportHours: "/support-hours",
  clientTickets: "/tickets",
});
