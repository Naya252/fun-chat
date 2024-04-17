import BaseComponent from '@/components/shared/base-component';
import BaseInput from '@/components/shared/base-input/base-input';
import { type Member } from '@/types/api-types';
import store from '@/store/store';
import emitter from '@/utils/event-emitter';

export const createTextField = (placeholder: string, classes: string[] = [], mainClasses: string[] = []): BaseInput => {
  const search = new BaseInput(
    'Search',
    '',
    'text',
    '',
    {
      value: '',
      autocomplete: 'off',
      placeholder,
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
    'bg-gray-900/[.08]',
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
