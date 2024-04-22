import Router, { type Route } from '@/lib/router';
import type BaseComponent from '@/components/shared/base-component';
import store from '@/store/store';
import emitter from '@/utils/event-emitter';
import { ROUTES } from './pathes';

export default class AppRouter extends Router {
  public routerOutlet: BaseComponent;
  private activeRoute: string;

  constructor(routerOutlet: BaseComponent) {
    super(
      [
        { name: ROUTES.Login, module: import('@/components/auth/login-page') },
        { name: ROUTES.Chat, module: import('@/components/chat/chat-page') },
        { name: ROUTES.Info, module: import('@/components/info/info-page') },
      ].map(({ name, module }) => ({
        name,
        component: async (): Promise<BaseComponent> => {
          const { default: createPage } = await module;
          return createPage((route: string, isAuth: boolean) => {
            this.push(route, isAuth);
          });
        },
      })),

      async (route: Route) => {
        const component = await route.component();
        routerOutlet.replaceChildren(component);
      },
      async () => {
        const { default: createPage } = await import('@/components/404/404-page');
        return createPage();
      },
    );

    this.routerOutlet = routerOutlet;
    this.activeRoute = '';
  }

  public push(route = '', isAuth = false): void {
    let newRoute = route;

    if (newRoute === '') {
      newRoute = window.location.pathname.slice(1);
    }

    if (newRoute === '') {
      newRoute = ROUTES.Chat;
    }

    if (!isAuth && newRoute === ROUTES.Chat) {
      newRoute = ROUTES.Login;
    }

    if (isAuth && newRoute === ROUTES.Login) {
      newRoute = ROUTES.Chat;
    }

    super.navigateTo(newRoute);
    this.activeRoute = newRoute;
    emitter.emit('change-route');
  }

  public logout(): void {
    this.push(ROUTES.Login, store.user.isAuth());
  }

  public getActiveRoute(): string {
    return this.activeRoute;
  }
}
