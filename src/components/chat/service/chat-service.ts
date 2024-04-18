import BaseComponent from '@/components/shared/base-component';
import BaseInput from '@/components/shared/base-input/base-input';
import BaseButton from '@/components/shared/base-button/base-button';
import type { Member, Message } from '@/types/api-types';
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
    ['bg-gray-800', 'ring-gray-800', 'inner-box-shadow', ...classes],
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
    'px-6',
    'py-6',
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
  const card = new BaseComponent('div', ['overflow-auto', 'h-full', 'px-6', 'flex', 'flex-col', 'chat-field']);

  return card;
};

export const createSendButton = (): BaseButton => {
  const button = new BaseButton(
    'button',
    'Send',
    [
      'py-3',
      'max-w-16',
      'bg-gray-700',
      'hover:bg-gray-600',
      'focus-visible:outline-bg-gray-600',
      'disabled:text-gray-600',
      'disabled:bg-gray-700/[.02]',
      'disabled:hover:bg-gray-700/[.02]',
      'disabled:focus:bg-gray-700/[.02]',
    ],
    { disabled: '' },
  );

  return button;
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
  const member = target.closest('.member button');
  if (member) {
    const login = member.getAttribute('id');
    const isActive = member.parentElement?.classList.contains('active');
    emitter.emit('select-member', { login, isLogined: isActive });
  }
};

export const createMessage = (msg: Message): BaseComponent => {
  const message = new BaseComponent(
    'div',
    ['px-2', 'py-2', 'my-2', 'bg-white/[.04]', 'rounded-md', 'w-3/5'],
    {},
    msg.text,
  );

  if (msg.from === store.user.getLogin()) {
    message.setClasses(['ml-auto']);
  }

  return message;
};
