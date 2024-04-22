import BaseComponent from '@/components/shared/base-component';

class InfoPage extends BaseComponent {
  constructor() {
    super('div', ['mx-auto', 'container', 'max-w-7xl', 'px-2', 'sm:px-6', 'lg:px-8', 'select-none']);

    const card = new BaseComponent('div', ['text-center', 'max-w-80', 'mx-auto', 'py-24', 'sm:py-32', 'lg:px-4']);
    const info = new BaseComponent('p', ['text-base', 'font-semibold', 'text-sky-500'], {}, 'author: Naya252');
    const title = new BaseComponent(
      'h1',
      ['mt-4', 'text-3xl', 'font-bold', 'tracking-tight', 'text-gray-300', 'sm:text-5xl'],
      {},
      'Fun chat',
    );
    const text = new BaseComponent(
      'p',
      ['mt-6', 'text-base', 'leading-7', 'text-gray-400'],
      {},
      'The application is designed to demonstrate the Fun Chat task as part of the RSSchool JS/FE 2023Q4 course.',
    );

    card.append(info, title, text);
    this.append(card);
  }
}

const createPage = (): BaseComponent => {
  const page = new InfoPage();
  return page;
};

export default createPage;
