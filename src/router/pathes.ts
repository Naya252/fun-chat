export const ROUTES = {
  Info: 'info',
  Chat: 'chat',
  Login: 'login',
} as const;

type AppRoute = (typeof ROUTES)[keyof typeof ROUTES] | '404';

export type { AppRoute };
