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

const createMenuBtn = (): BaseComponent => {
  const button = new BaseComponent('button', [
    'relative',
    'rounded-md',
    'text-gray-300',
    'hover:text-white',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-white',
    'burger-btn',
    'hide',
  ]);
  const content = `<span class="absolute -inset-2.5"></span>
  <span class="sr-only">Close panel</span>
  <svg viewBox="0 0 24 24" class="w-6 h-6"><path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"></path></svg>`;
  button.setHTML(content);
  return button;
};

export default class Header extends BaseComponent {
  private router: AppRouter;
  private links: BaseComponent[];
  private linksWrapper: BaseComponent;
  private userLogin: BaseComponent;
  private menuBtn: BaseComponent;
  private destroyFns: VoidFunction[] = [];

  constructor(router: AppRouter) {
    super('nav', ['sticky', 'top-0', 'z-40', 'w-full', 'backdrop-blur', 'shadow-md']);
    this.router = router;
    const container = new BaseComponent('div', [
      'mx-auto',
      'max-w-7xl',
      'px-2',
      'sm:px-6',
      'lg:px-8',
      'header-container',
    ]);
    const subcontainer = new BaseComponent('div', ['relative', 'flex', 'h-12', 'items-center', 'justify-between']);

    const title = createTitle();
    this.userLogin = new BaseComponent('li', ['user-login']);
    this.links = this.createLinks();
    this.linksWrapper = this.createNav();

    this.menuBtn = createMenuBtn();
    this.menuBtn.addListener('click', () => {
      emitter.emit('toggle-menu');
    });

    title.append(this.menuBtn);

    container.append(subcontainer);
    subcontainer.append(title, this.linksWrapper);
    this.append(container);

    this.destroyFns = [
      emitter.on('login', () => this.changeLinks()),
      emitter.on('logout', () => this.goToLogin(ROUTES.Login)),
      emitter.on('change-route', () => this.changedPath()),
    ];
  }

  public remove(): void {
    this.destroyFns.forEach((fn) => fn());
    super.remove();
  }

  private changedPath(): void {
    const currentPath = this.router.getActiveRoute();
    this.changeBurgerBtn(currentPath);
    this.changeActiveLink(currentPath);
  }

  private changeBurgerBtn(currentPath: string): void {
    if (currentPath === ROUTES.Chat) {
      this.menuBtn.removeClasses(['hide']);
    } else {
      this.menuBtn.setClasses(['hide']);
      emitter.emit('hide-menu');
    }
  }

  private createNav(): BaseComponent {
    const container = new BaseComponent('nav', ['text-sm', 'leading-6', 'font-semibold', 'text-slate-200']);
    const ul = new BaseComponent('ul', ['flex', 'space-x-4']);
    ul.append(...this.links, this.userLogin);
    container.append(ul);

    return container;
  }

  private goToLogin(route: string): void {
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
        }
      });

      linkWrapper.append(link);

      return linkWrapper;
    });
    return links;
  }

  private changeLinks(): void {
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
