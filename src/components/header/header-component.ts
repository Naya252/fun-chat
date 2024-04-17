import BaseComponent from '@/components/shared/base-component';
import type AppRouter from '@/router/router';
import emitter from '@/utils/event-emitter';
import { ROUTES } from '@/router/pathes';
import store from '@/store/store';
import * as repository from '@/repositories/front-requests';
import logoutIcon from '@/assets/icons/logout';
import logoIcon from '@/assets/icons/logo';

const createTitle = (): BaseComponent => {
  const title = new BaseComponent('h1', ['fun-chat', 'text-sky-400'], {}, 'Fun chat');
  const container = new BaseComponent('div', ['flex', 'flex-shrink-0', 'items-center']);
  container.setHTML(logoIcon);
  container.append(title);
  return container;
};

export default class Header extends BaseComponent {
  private router: AppRouter;
  private links: BaseComponent[];
  private linksWrapper: BaseComponent;
  private userLogin: BaseComponent;

  constructor(router: AppRouter) {
    super('nav', ['sticky', 'top-0', 'z-40', 'w-full', 'backdrop-blur', 'shadow-md']);
    this.router = router;
    const container = new BaseComponent('div', ['mx-auto', 'max-w-7xl', 'px-2', 'sm:px-6', 'lg:px-8']);
    const subcontainer = new BaseComponent('div', ['relative', 'flex', 'h-12', 'items-center', 'justify-between']);

    const title = createTitle();
    this.userLogin = new BaseComponent('li', ['user-login']);
    this.links = this.createLinks();
    this.linksWrapper = this.createNav();

    container.append(subcontainer);
    subcontainer.append(title, this.linksWrapper);
    this.append(container);
    emitter.on('login', () => this.changeLinks(ROUTES.Chat));
    emitter.on('logout', () => this.goToLogin(ROUTES.Login));
  }

  private createNav(): BaseComponent {
    const container = new BaseComponent('nav', ['text-sm', 'leading-6', 'font-semibold', 'text-slate-200']);
    const ul = new BaseComponent('ul', ['flex', 'space-x-4']);
    ul.append(...this.links, this.userLogin);
    container.append(ul);

    return container;
  }

  private goToLogin(route: string): void {
    this.changeActiveLink(route);
    this.changeLoginLink();
    const isAuth = store.user.isAuth();
    this.router.push(route, isAuth);
  }

  private createLinks(): BaseComponent[] {
    const links = Object.entries(ROUTES).map(([name, route]) => {
      const linkWrapper = new BaseComponent<HTMLUListElement>('li');
      const link = new BaseComponent<HTMLAnchorElement>(
        'a',
        ['nav-link', 'hover:text-sky-400'],
        { id: route, href: route },
        name,
      );

      if (route === ROUTES.Chat) {
        link.setClasses(['mr-4']);
      }

      link.addListener('click', (event) => {
        event.preventDefault();
        const active = this.router.getActiveRoute();

        if (active !== route) {
          const isAuth = store.user.isAuth();

          if (isAuth && route === ROUTES.Login) {
            const user = store.user.getUser();

            repository.logoutUser(user.login, user.password);
            return;
          }

          this.router.push(route, isAuth);
          this.changeActiveLink(this.router.getActiveRoute());
        }
      });

      linkWrapper.append(link);

      return linkWrapper;
    });
    return links;
  }

  private changeLinks(route: string): void {
    this.changeActiveLink(route);
    this.changeLoginLink();
  }

  private changeLoginLink(): void {
    const isAuth = store.user.isAuth();
    const login = this.links[2]?.getFirstChild();
    const chat = this.links[1];

    const userLogin = store.user.getLogin();

    if (login instanceof HTMLAnchorElement && chat !== undefined) {
      if (isAuth) {
        login.innerHTML = logoutIcon;
        chat.removeClasses(['hide']);
      } else {
        login.innerText = 'Login';
        chat.setClasses(['hide']);
      }

      this.userLogin.setTextContent(userLogin);
    }
  }

  public changeActiveLink(title: string): void {
    this.changeLoginLink();
    this.links.forEach((el) => {
      const child = el.getFirstChild();
      const childTitle = child.textContent;
      if (child instanceof HTMLElement) {
        child.classList.remove('text-sky-400');

        if (childTitle?.toLowerCase() === title) {
          child.classList.add('text-sky-400');
        }
      }
    });
  }
}
