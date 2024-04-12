import './styles/global.css';
import BaseComponent from './components/shared/base-component';
import Header from './components/header/header-component';
import Footer from './components/footer/footer-component';

export default class App {
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

    this.header = new Header();
    this.main = new BaseComponent('div', ['content', 'container', 'flex', 'grow-[1]'], {}, 'gtwergherg');

    this.footer = new Footer();

    this.appContainer.append(this.header, this.main, this.footer);
  }

  public async init(): Promise<void> {
    const { body } = document;

    body.className = 'antialiased text-slate-500 dark:text-slate-400';
    this.appContainer.appendToParent(body);
  }
}
