import BaseComponent from '@/components/shared/base-component';
import BaseInput from '@/components/shared/base-input/base-input';
import type { Member } from '@/types/api-types';
import store from '@/store/store';
import emitter from '@/utils/event-emitter';

export const createTextField = (
  placeholder: string,
  classes: string[] = [],
  mainClasses: string[] = [],
  attrs: Record<string, string> = {},
): BaseInput => {
  const search = new BaseInput(
    'Search',
    '',
    'text',
    '',
    {
      value: '',
      autocomplete: 'off',
      placeholder,
      ...attrs,
    },
    'text',
    ['bg-white/[.02]', 'ring-gray-800', ...classes],
    mainClasses,
  );

  return search;
};

export const createSide = (): BaseComponent => {
  const sideCard = new BaseComponent('div', [
    'flex',
    'flex-col',
    'w-full',
    'mr-6',
    'my-6',

    'rounded-xl',
    'bg-white/[.04]',
    'shadow-md',
    'overflow-auto',
  ]);
  return sideCard;
};

export const createUsersWrapper = (): BaseComponent => {
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

export const createUsers = (usrs: Member[]): BaseComponent[] => {
  const users: BaseComponent[] = [];
  if (usrs.length === 0) {
    return users;
  }
  usrs.forEach((el) => {
    const user = new BaseComponent<HTMLUListElement>('li', ['member', 'flex'], { id: `user-${el.login}` });
    const link = new BaseComponent<HTMLAnchorElement>(
      'button',
      ['hover:text-sky-400', 'w-full', 'flex', 'justify-items-start', 'member-login'],
      { id: el.login },
    );
    const login = new BaseComponent('span', ['member-login']);
    login.setTextContent(el.login);
    link.append(login);

    if (el.isLogined) {
      user.setClasses(['active', 'flex']);
    }

    user.append(link);
    if (el.newMessages !== undefined) {
      const counter = new BaseComponent<HTMLUListElement>(
        'div',
        ['counter', 'bg-sky-700', 'px-3', 'py-1', 'rounded-full', 'text-white', 'font-semibold', 'text-xs'],
        {},
        el.newMessages?.length.toString(),
      );

      if (el.newMessages?.length === 0) {
        counter.setClasses(['hide']);
      }

      user.append(link, counter);
    }
    users.push(user);
  });
  return users;
};

export const createChat = (): BaseComponent => {
  const chat = new BaseComponent('div', [
    'flex',
    'flex-col',
    'w-full',
    'ml-6',
    'my-6',
    'rounded-xl',
    'bg-white/[.04]',
    'shadow-md',
  ]);

  return chat;
};

export const createMessagesCard = (): BaseComponent => {
  const card = new BaseComponent('div', ['overflow-auto', 'h-full', 'px-6', 'py-2', 'flex', 'flex-col', 'chat-field']);

  return card;
};

export const getMembers = (): Member[] => {
  const users = store.users.getUsers();
  const currentUser = store.user.getLogin();
  return users.filter((el) => el.login !== currentUser);
};

export const selectMember = (e: Event): void => {
  const { target } = e;
  if (target === null || !(target instanceof HTMLElement)) {
    throw new Error('not member');
  }
  const wrapper = target.closest('.member');
  const member = target.closest('.member button');
  if (wrapper !== null) {
    emitter.emit('remove-selected-class');
    wrapper.classList.add('selected-user');
  }
  if (member) {
    const login = member.getAttribute('id');
    const isActive = member.parentElement?.classList.contains('active');
    store.users.setSelectedMember({ login: login || '', isLogined: isActive || false });
    emitter.emit('select-member');
  }
};
