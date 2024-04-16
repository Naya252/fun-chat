import BaseComponent from '@/components/shared/base-component';
import store from '@/store/store';
import emitter from '@/utils/event-emitter';
import { type Member } from '@/types/api-types';

const createSide = (): BaseComponent => {
  const sideCard = new BaseComponent('div', [
    'flex',
    'w-full',
    'mr-6',
    'my-6',
    'px-6',
    'py-6',
    'rounded-xl',
    'bg-gray-900/[.08]',
    'shadow-md',
    'overflow-auto',
  ]);
  return sideCard;
};

const createUsersWrapper = (): BaseComponent => {
  const users = new BaseComponent('ul', [
    'flex',
    'flex-col',
    'w-full',
    'h-full',
    'space-x-4',
    'members',
    'overflow-auto',
  ]);
  return users;
};

const createUsers = (usrs: Member[]): BaseComponent[] => {
  const users: BaseComponent[] = [];
  if (usrs.length === 0) {
    return users;
  }
  usrs.forEach((el) => {
    const user = new BaseComponent<HTMLUListElement>('li', ['member']);
    const link = new BaseComponent<HTMLAnchorElement>(
      'button',
      ['hover:text-sky-500', 'dark:hover:text-sky-400', 'w-full', 'flex', 'justify-items-start'],
      { id: el.login },
      el.login,
    );
    if (el.isLogined) {
      user.setClasses(['active']);
    }
    user.append(link);
    users.push(user);
  });
  return users;
};

class ChatPage extends BaseComponent {
  private side: BaseComponent;
  private users: BaseComponent[];
  private userWrapper: BaseComponent;
  private chat: BaseComponent;

  constructor() {
    super('div', ['mx-auto', 'container', 'flex', 'max-w-7xl', 'px-2', 'sm:px-6', 'lg:px-8']);

    const sideWrapper = new BaseComponent('div', ['flex', 'w-1/3', 'min-w-40']);
    this.side = createSide();
    this.userWrapper = createUsersWrapper();
    this.users = createUsers([]);
    this.userWrapper.append(...this.users);
    this.side.append(this.userWrapper);
    sideWrapper.append(this.side);

    this.chat = new BaseComponent('div', ['flex', 'w-2/3']);
    const chatCard = new BaseComponent('div', [
      'flex',

      'w-full',
      'ml-6',
      'my-6',
      'px-6',
      'py-6',
      'rounded-xl',
      'bg-gray-900/[.08]',
      'shadow-md',
    ]);
    const chatTitle = new BaseComponent(
      'h2',
      ['text-base', 'font-semibold', 'leading-6', 'text-gray-200', 'id="slide-over-title'],
      {},
      'Users',
    );
    chatCard.append(chatTitle);
    this.chat.append(chatCard);

    this.append(sideWrapper, this.chat);
    emitter.on('get-active-users', () => this.changeUsers());
    emitter.on('get-inactive-users', () => this.changeUsers());
    emitter.on('change-users', () => this.changeUsers());
    this.changeUsers();
  }

  private changeUsers(): void {
    const users = store.users.getUsers();
    const currentUser = store.user.getLogin();

    this.users = createUsers(users.filter((el) => el.login !== currentUser));
    this.userWrapper.replaceChildren(...this.users);
  }
}

const createPage = (): BaseComponent => {
  const page = new ChatPage();
  return page;
};

export default createPage;
