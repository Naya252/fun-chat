import { type UserType } from '@/types/types';
import store from '@/store/store';
import { isUser } from './validation';

export const getUser = (): UserType => {
  const data: unknown = sessionStorage.getItem('user');
  let user: unknown;

  if (data === null) {
    user = store.user.getUser();
  }

  if (data !== null && typeof data === 'string') {
    user = JSON.parse(data);
  }

  if (!isUser(user)) {
    throw new Error('user is not correct');
  }

  return user;
};

export const setUser = (userData: string): void => {
  sessionStorage.setItem('user', userData);
};

export const removeUser = (): void => {
  sessionStorage.removeItem('user');
};
