import alerts from '@/components/alert/alert';
import store from '@/store/store';
import emitter from '@/utils/event-emitter';
import { setUser } from '@/repositories/user-repository';
import { isAuth, isError, isResponse, isUsers, isMember } from '@/repositories/validation';
import { USER_DICTIONARY, ERROR_TYPE } from '../types/api-types';

const changeAuth = (data: Record<string, string> | Record<string, Record<string, string>>): void => {
  if (!isAuth(data)) {
    throw new Error('payload is not auth');
  }

  store.user.setAuth(data.user.isLogined);
  const isAuthUser = store.user.isAuth();

  if (isAuthUser) {
    const user = store.user.getUser();
    setUser(JSON.stringify(user));
    emitter.emit('login');
  } else {
    store.user.setLogin('');
    store.user.setPassword('');
    const user = store.user.getUser();
    setUser(JSON.stringify(user));
    emitter.emit('logout');
  }
};

export const changeUsers = (data: Record<string, string> | Record<string, Record<string, string>>): void => {
  if (!isMember(data.user)) {
    throw new Error('payload is not member');
  }

  store.users.setUsers(data.user);
  emitter.emit('change-users');
};

export const changeActiveUsers = (data: Record<string, string> | Record<string, Record<string, string>>): void => {
  if ('users' in data && data.users.length === 0) {
    store.users.setActiveUsers([]);
    emitter.emit('get-active-users');
  }

  if (!isUsers(data.users)) {
    throw new Error('payload is not users');
  }

  store.users.setActiveUsers(data.users);
  emitter.emit('get-active-users');
};

export const changeInactiveUsers = (data: Record<string, string> | Record<string, Record<string, string>>): void => {
  if ('users' in data && data.users.length === 0) {
    store.users.setInactiveUsers([]);
    emitter.emit('get-inactive-users');
    return;
  }

  if (!isUsers(data.users)) {
    throw new Error('payload is not users');
  }

  store.users.setInactiveUsers(data.users);
  emitter.emit('get-inactive-users');
};

export const changeError = (data: Record<string, string> | Record<string, Record<string, string>>): void => {
  if (!isError(data)) {
    throw new Error('payload is not error');
  }
  emitter.emit('loginError');
  alerts.addAlert('warning', data.error);
};

export const callMessages = (data: string): void => {
  const result: unknown = JSON.parse(data);

  console.log(JSON.parse(data));

  if (!isResponse(result)) {
    throw new Error('result is not correct');
  }

  const { type, payload } = result;

  const dictionary = {
    [ERROR_TYPE]: changeError,
    [USER_DICTIONARY.login]: changeAuth,
    [USER_DICTIONARY.logout]: changeAuth,
    [USER_DICTIONARY.active]: changeActiveUsers,
    [USER_DICTIONARY.inactive]: changeInactiveUsers,
    [USER_DICTIONARY.externalLogin]: changeUsers,
    [USER_DICTIONARY.externalLogout]: changeUsers,
  };

  const fn = dictionary[type];
  if (typeof fn === 'function') {
    fn(payload);
  }
};

export const closedWs = (): void => {
  emitter.emit('disconect-ws');
};

export const openedWs = (): void => {
  console.log('WebSocket connected');
  emitter.emit('connect-ws');
};
