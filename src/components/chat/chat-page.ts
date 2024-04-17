import BaseComponent from '@/components/shared/base-component';
import store from '@/store/store';
import emitter from '@/utils/event-emitter';
import { type Member } from '@/types/api-types';
import BaseInput from '@/components/shared/base-input/base-input';

const createSearchFiled = (): BaseInput => {
  const search = new BaseInput(
    'search',
    '',
    'text',
    '',
    {
      value: '',
      autocomplete: 'off',
      placeholder: 'Search',
    },
    'text',
    ['bg-gray-800', 'ring-gray-800', 'inner-box-shadow'],
  );

  return search;
};

const createSide = (): BaseComponent => {
  const sideCard = new BaseComponent('div', [
    'flex',
    'flex-col',
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
      ['hover:text-sky-400', 'w-full', 'flex', 'justify-items-start'],
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
  private searchField: BaseInput;

  constructor() {
    super('div', ['mx-auto', 'container', 'flex', 'max-w-7xl', 'px-2', 'sm:px-6', 'lg:px-8']);

    const sideWrapper = new BaseComponent('div', ['flex', 'w-1/3', 'min-w-40']);
    this.side = createSide();
    this.userWrapper = createUsersWrapper();
    this.users = createUsers([]);
    this.userWrapper.append(...this.users);
    this.searchField = createSearchFiled();
    this.searchField.inputListener('input', (e) => {
      console.log(e);
      this.search();
    });
    this.side.append(this.searchField, this.userWrapper);
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
      ['text-base', 'font-semibold', 'leading-6', 'text-gray-200'],
      {},
      'Users',
    );
    chatCard.append(chatTitle);
    this.chat.append(chatCard);

    this.append(sideWrapper, this.chat);
    emitter.on('get-active-users', () => this.changeUsers(this.getMembers()));
    emitter.on('get-inactive-users', () => this.changeUsers(this.getMembers()));
    emitter.on('change-users', () => this.changeUsers(this.getMembers()));
    this.changeUsers(this.getMembers());
  }

  private getMembers(): Member[] {
    const users = store.users.getUsers();
    const currentUser = store.user.getLogin();
    return users.filter((el) => el.login !== currentUser);
  }

  private changeUsers(users: Member[]): void {
    this.users = createUsers(users);
    this.userWrapper.replaceChildren(...this.users);
  }

  private search(): void {
    let users = this.getMembers();
    const value = this.searchField.getValue();
    users = users.filter((el) => el.login.toLowerCase().includes(value.toLowerCase()));
    this.changeUsers(users);
  }
}

const createPage = (): BaseComponent => {
  const page = new ChatPage();
  return page;
};

export default createPage;
