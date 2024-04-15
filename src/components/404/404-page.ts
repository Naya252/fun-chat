import BaseComponent from '@/components/shared/base-component';

class ErrorPage extends BaseComponent {
  constructor() {
    super('div', ['mx-auto', 'container', 'max-w-7xl', 'px-2', 'sm:px-6', 'lg:px-8'], {}, '404');
  }
}

const createPage = (): BaseComponent => {
  const page = new ErrorPage();
  return page;
};

export default createPage;
