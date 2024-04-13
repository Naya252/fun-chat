import type BaseComponent from '../components/shared/base-component';

export type Route = {
  name: string;
  component: () => Promise<BaseComponent>;
};

export default class Router {
  constructor(
    private readonly routes: Route[],
    private readonly onHistoryChange: (route: Route) => Promise<void>,
    private readonly notFoundComponent: () => Promise<BaseComponent>,
  ) {
    window.addEventListener('popstate', this.onHistoryChangeHandler);
  }

  public destroy(): void {
    window.removeEventListener('popstate', this.onHistoryChangeHandler);
  }

  public navigateTo(pathName: string): void {
    const { name: routeName } = this.changePage(pathName);

    if (routeName === '404') {
      window.history.replaceState(routeName, '', routeName);
    } else {
      window.history.pushState(routeName, '', routeName);
    }
  }

  private changePage(pathName: string): Route {
    const route = this.routes.find((path) => path.name === pathName) ?? {
      name: '404',
      component: this.notFoundComponent,
    };

    this.onHistoryChange(route).catch(() => {});

    return route;
  }

  private isAppRoute(routeName: unknown): boolean {
    const isRoute = Object.values(this.routes).some((route) => route.name === routeName);
    return isRoute;
  }

  private readonly onHistoryChangeHandler = (event: PopStateEvent): void => {
    const routeName: unknown = event.state;

    if (!this.isAppRoute(routeName)) {
      return;
    }

    if (typeof routeName === 'string') {
      this.changePage(routeName);
    }
  };
}
