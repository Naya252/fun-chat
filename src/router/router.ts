import Router, { type Route } from '@/lib/router';
import type BaseComponent from '@/components/shared/base-component';
import store from '@/store/store';
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
          return createPage();
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

    if (!isAuth) {
      newRoute = 'login';
    } else if (newRoute === '') {
      newRoute = window.location.pathname.slice(1);

      if (newRoute === '') {
        newRoute = 'chat';
      }
    }

    super.navigateTo(newRoute);
    this.activeRoute = newRoute;
  }

  public logout(): void {
    console.log('logout');
    this.push('login', store.user.hasUser());
  }

  public getActiveRoute(): string {
    return this.activeRoute;
  }
}
