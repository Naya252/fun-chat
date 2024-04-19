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
    const user = new BaseComponent<HTMLUListElement>('li', ['member', 'flex']);
    const link = new BaseComponent<HTMLAnchorElement>(
      'button',
      ['hover:text-sky-400', 'w-full', 'flex', 'justify-items-start', 'truncate'],
      { id: el.login },
      el.login,
    );
    if (el.isLogined) {
      user.setClasses(['active', 'flex']);
    }

    user.append(link);
    if (el.newMessages !== undefined && el.newMessages?.length > 0) {
      const counter = new BaseComponent<HTMLUListElement>(
        'div',
        ['counter', 'bg-sky-700', 'px-3', 'py-1', 'rounded-full', 'text-white', 'font-semibold', 'text-xs'],
        {},
        el.newMessages?.length.toString(),
      );
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
  const card = new BaseComponent('div', ['overflow-auto', 'h-full', 'px-6', 'pb-2', 'flex', 'flex-col', 'chat-field']);

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

const formatDate = (datetime: number): string => {
  const currentDate = new Date(datetime);

  const formattedDate = currentDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formattedTime = currentDate.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDateTime = `${formattedDate}, ${formattedTime}`;

  return formattedDateTime;
};

export const createMessage = (msg: Message): BaseComponent => {
  const message = new BaseComponent(
    'div',
    ['px-3', 'py-2', 'my-2', 'rounded-md', 'message', 'flex', 'flex-col', 'gap-2'],
    {},
  );

  const header = new BaseComponent('div', ['flex', 'justify-between', 'gap-2', 'text-xs']);
  const author = new BaseComponent('div', [], {}, msg.from === store.user.getLogin() ? 'you' : msg.from);
  const msgDate = formatDate(msg.datetime);
  const date = new BaseComponent('div', [], {}, msgDate.toString());
  header.append(author, date);

  const content = new BaseComponent('div', ['text-clip', 'text-gray-300'], {}, msg.text);

  const footer = new BaseComponent('div', ['text-xs', 'flex', 'justify-between', 'gap-2']);

  if (msg.from === store.user.getLogin()) {
    message.setClasses(['ml-auto', 'bg-gray-700']);
    const deliveredStatus = msg.status.isDelivered ? 'delivered' : '';
    const readedStatus = msg.status.isReaded ? 'readed' : '';
    const editedStatus = msg.status.isEdited ? 'edited' : '';

    const status = new BaseComponent('p', [], {}, readedStatus || deliveredStatus);
    const edited = new BaseComponent('p', [], {}, editedStatus);

    footer.append(edited, status);
  } else {
    message.setClasses(['mr-auto', 'bg-gray-800']);
  }

  message.append(header, content, footer);
  return message;
};
