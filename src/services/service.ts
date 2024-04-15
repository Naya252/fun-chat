import alerts from '@/components/alert/alert';
import store from '@/store/store';
import emitter from '@/utils/event-emitter';
import { setUser } from '@/repositories/user-repository';
import { isAuth, isError, isResponse } from '@/repositories/validation';
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

export const changeError = (data: Record<string, string> | Record<string, Record<string, string>>): void => {
  if (!isError(data)) {
    throw new Error('payload is not error');
  }
  emitter.emit('loginError');
  alerts.addAlert('warning', data.error);
};

export const callMessages = (data: string): void => {
  const result: unknown = JSON.parse(data);

  if (!isResponse(result)) {
    throw new Error('result is not correct');
  }

  console.log(JSON.parse(data));

  const { type, payload } = result;

  const dictionary = {
    [ERROR_TYPE]: changeError,
    [USER_DICTIONARY.login]: changeAuth,
    [USER_DICTIONARY.logout]: changeAuth,
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
