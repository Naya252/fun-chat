import BaseComponent from '@/components/shared/base-component';

class ErrorPage extends BaseComponent {
  constructor() {
    super('div', ['mx-auto', 'container', 'max-w-7xl', 'px-2', 'sm:px-6', 'lg:px-8', 'select-none']);

    const card = new BaseComponent('div', ['text-center', 'py-24', 'sm:py-32', 'lg:px-8']);
    const info = new BaseComponent('p', ['text-base', 'font-semibold', 'text-sky-500'], {}, '404');
    const title = new BaseComponent(
      'h1',
      ['mt-4', 'text-3xl', 'font-bold', 'tracking-tight', 'text-gray-300', 'sm:text-5xl'],
      {},
      'Page not found',
    );
    const text = new BaseComponent(
      'p',
      ['mt-6', 'text-base', 'leading-7', 'text-gray-400'],
      {},
      'Sorry, we couldn’t find the page you’re looking for.',
    );

    card.append(info, title, text);
    this.append(card);
  }
}

const createPage = (): BaseComponent => {
  const page = new ErrorPage();
  return page;
};

export default createPage;
