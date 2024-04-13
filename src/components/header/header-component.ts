import BaseComponent from '@/components/shared/base-component';
import AppRouter from '@/router/router';
import { ROUTES } from '@/router/pathes';

const createTitle = (): BaseComponent => {
  const title = new BaseComponent('h1', [], {}, 'Fun chat');
  const container = new BaseComponent('div', ['flex', 'flex-shrink-0', 'items-center']);
  container.append(title);
  return container;
};

export default class Header extends BaseComponent {
  router: AppRouter;
  links: BaseComponent[];

  constructor(router: AppRouter) {
    super('nav', ['sticky', 'top-0', 'z-40', 'w-full', 'backdrop-blur', 'border-b', 'border-slate-700']);
    this.router = router;
    const container = new BaseComponent('div', ['mx-auto', 'max-w-7xl', 'px-2', 'sm:px-6', 'lg:px-8']);
    const subcontainer = new BaseComponent('div', ['relative', 'flex', 'h-12', 'items-center', 'justify-between']);

    const title = createTitle();
    this.links = this.createLinks();
    const linksWrapper = this.createNav();

    container.append(subcontainer);
    subcontainer.append(title, linksWrapper);
    this.append(container);
  }

  private createNav(): BaseComponent {
    const container = new BaseComponent('nav', [
      'text-sm',
      'leading-6',
      'font-semibold',
      'text-slate-700',
      'dark:text-slate-200',
    ]);
    const ul = new BaseComponent('ul', ['flex', 'space-x-8']);
    ul.append(...this.links);
    container.append(ul);

    return container;
  }

  private createLinks(): BaseComponent[] {
    const links = Object.entries(ROUTES).map(([name, route]) => {
      const linkWrapper = new BaseComponent<HTMLUListElement>('li');
      const link = new BaseComponent<HTMLAnchorElement>(
        'a',
        ['nav-link', 'hover:text-sky-500', 'dark:hover:text-sky-400'],
        { id: route, href: route },
        name,
      );

      link.addListener('click', (event) => {
        event.preventDefault();
        const active = this.router.getActiveRoute();

        if (active !== route) {
          this.router.push(route);
          this.changeActiveLink(this.router.getActiveRoute());
        }
      });

      linkWrapper.append(link);

      return linkWrapper;
    });
    return links;
  }

  public changeActiveLink(title: string): void {
    this.links.forEach((el) => {
      const child = el.getFirstChild();
      const childTitle = child.textContent;
      if (child instanceof HTMLElement) {
        child.classList.remove('text-sky-500');
        child.classList.remove('dark:text-sky-400');

        if (childTitle?.toLowerCase() === title) {
          child.classList.add('text-sky-500');
          child.classList.add('dark:text-sky-400');
        }
      }
    });
  }
}
