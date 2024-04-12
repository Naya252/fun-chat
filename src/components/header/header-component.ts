import BaseComponent from '@/components/shared/base-component';

const createTitle = (): BaseComponent => {
  const title = new BaseComponent('h1', [], {}, 'Fun chat');
  const container = new BaseComponent('div', ['flex', 'flex-shrink-0', 'items-center']);
  container.append(title);
  return container;
};

export default class Header extends BaseComponent {
  constructor() {
    super('nav', ['sticky', 'top-0', 'z-40', 'w-full', 'backdrop-blur', 'border-b', 'border-slate-700']);

    const container = new BaseComponent('div', ['mx-auto', 'max-w-7xl', 'px-2', 'sm:px-6', 'lg:px-8']);
    const subcontainer = new BaseComponent('div', ['relative', 'flex', 'h-12', 'items-center', 'justify-between']);

    const title = createTitle();

    container.append(subcontainer);
    subcontainer.append(title);
    this.append(container);
  }
}
