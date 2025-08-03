
// utils/routeUtils.ts
export const PUBLIC_ROUTES = [
  "/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/api/webhook/register",
];


export const REDIRECTS = {
  UNAUTHENTICATED: "/sign-in",
  AUTHENTICATED: "/home",
  AUTH_FORBIDDEN: ["/sign-in", "/sign-up", "/forgot-password"],
  USER_HOME: "/home",
  ERROR: "/error",
};


// Route matcher function
export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.includes(pathname);
};