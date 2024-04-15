import './styles/global.css';
import BaseComponent from './components/shared/base-component';
import Header from './components/header/header-component';
import Footer from './components/footer/footer-component';
import alerts from './components/alert/alert';
import { getUser } from './repositories/user-repository';

import AppRouter from './router/router';
import store from './store/store';

export default class App {
  private readonly router: AppRouter;

  private readonly appContainer: BaseComponent;

  private readonly header: Header;

  private readonly main: BaseComponent;

  private readonly footer: Footer;

  constructor() {
    this.appContainer = new BaseComponent('div', [
      'app',
      'relative',
      'flex',
      'min-h-screen',
      'flex-col',
      'bg-gray-800',
    ]);

    this.main = new BaseComponent('div', ['w-full', 'flex', 'grow-[1]']);
    this.router = new AppRouter(this.main);
    this.header = new Header(this.router);
    this.footer = new Footer();

    this.appContainer.append(this.header, this.main, this.footer, alerts);
  }

  public init(): void {
    const { body } = document;

    body.className = 'antialiased text-slate-500 dark:text-slate-400';
    this.appContainer.appendToParent(body);

    const user = getUser();
    store.user.setUser(user);

    const isAuth = store.user.isAuth();
    this.router.push('', isAuth);
    const activeRoute = this.router.getActiveRoute();
    this.header.changeActiveLink(activeRoute);
  }
}
