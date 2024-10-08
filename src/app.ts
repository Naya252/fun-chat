import './styles/global.css';
import * as repository from '@/repositories/front-requests';
import BaseComponent from './components/shared/base-component';
import Header from './components/header/header-component';
import Footer from './components/footer/footer-component';
import alerts from './components/alert/alert';
import { getUser, removeSelectedMember } from './repositories/user-repository';
import { getActiveUsers, getInactiveUsers, getHistory } from './repositories/front-requests';
import emitter from './utils/event-emitter';

import AppRouter from './router/router';
import store from './store/store';

const getUsers = (): void => {
  getActiveUsers();
  getInactiveUsers();
};

const cleanStore = (): void => {
  store.cleanStore();
};

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

    emitter.on('disconect-ws', () => this.disconnected());
    emitter.on('connect-ws', () => this.connected());
    emitter.on('login', () => getUsers());
    emitter.on('logout', () => cleanStore());
    emitter.on('get-user-history', (login) => getHistory(login));

    document.addEventListener('click', (event: Event) => emitter.emit('click-document', event));
  }

  public init(): void {
    const { body } = document;

    body.className = 'antialiased text-slate-400';
    this.appContainer.appendToParent(body);
  }

  private disconnected(): void {
    this.appContainer.setClasses(['show-connecting']);
    removeSelectedMember();
    cleanStore();
  }

  private connected(): void {
    this.appContainer.removeClasses(['show-connecting']);

    const user = getUser();
    store.user.setUser(user);

    const isAuth = store.user.isAuth();
    this.router.push('', isAuth);
    const activeRoute = this.router.getActiveRoute();
    this.header.changeActiveLink(activeRoute);

    if (isAuth) {
      repository.loginUser(user.login, user.password);
    }
  }
}
