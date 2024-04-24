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

export const getSelectedMember = (): string => {
  const data: unknown = sessionStorage.getItem('selectedMember');
  let selectedMember;

  if (data === null || data === undefined) {
    selectedMember = '';
  }

  if (data !== null && data !== undefined && typeof data === 'string') {
    selectedMember = data;
  }

  if (typeof selectedMember !== 'string') {
    throw new Error('Selected member not correct type');
  }

  return selectedMember;
};

export const setSelectedMember = (selectedMember: string): void => {
  sessionStorage.setItem('selectedMember', selectedMember);
};

export const removeSelectedMember = (): void => {
  sessionStorage.removeItem('selectedMember');
};
