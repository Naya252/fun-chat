import alerts from '@/components/alert/alert';
import store from '@/store/store';
import emitter from '@/utils/event-emitter';
import { setUser } from '@/repositories/user-repository';
import {
  isAuth,
  isError,
  isResponse,
  isUsers,
  isMember,
  isMessages,
  isMessage,
  isOneStatusMsg,
} from '@/repositories/validation';
import { USER_DICTIONARY, ERROR_TYPE, MESSAGE_DICTIONARY } from '../types/api-types';

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

const changeUsers = (data: Record<string, string> | Record<string, Record<string, string>>): void => {
  if (!isMember(data.user)) {
    throw new Error('payload is not member');
  }

  store.users.setUsers(data.user);
  emitter.emit('change-users', data.user);
};

const changeActiveUsers = (data: Record<string, string> | Record<string, Record<string, string>>): void => {
  if ('users' in data && data.users.length === 0) {
    store.users.setActiveUsers([], store.user.getLogin());
  }

  if (!isUsers(data.users)) {
    throw new Error('payload is not users');
  }

  store.users.setActiveUsers(data.users, store.user.getLogin());
};

const changeInactiveUsers = (data: Record<string, string> | Record<string, Record<string, string>>): void => {
  if ('users' in data && data.users.length === 0) {
    store.users.setInactiveUsers([], store.user.getLogin());
    return;
  }

  if (!isUsers(data.users)) {
    throw new Error('payload is not users');
  }

  store.users.setInactiveUsers(data.users, store.user.getLogin());
};

const getHistory = (data: Record<string, string> | Record<string, Record<string, string>>): void => {
  const { messages } = data;
  if (!isMessages(messages)) {
    throw new Error('payload is not messages');
  }
  store.users.changeHistory(messages);
};

const getMessage = (data: Record<string, string> | Record<string, Record<string, string>>): void => {
  const { message } = data;

  if (!isMessage(message)) {
    throw new Error('payload is not message');
  }

  store.users.setMessages(message);
};

const changeMsg = (data: Record<string, string> | Record<string, Record<string, string>>): void => {
  const { message } = data;

  if (
    typeof message !== 'object' ||
    !message.id ||
    typeof message.id !== 'string' ||
    !message.status ||
    typeof message.status !== 'object' ||
    !isOneStatusMsg(message.status)
  ) {
    throw new Error('payload is not message');
  }

  const { status } = message;
  const { isReaded, isDelivered, isEdited, isDeleted } = status;

  if (typeof isReaded === 'boolean') {
    store.users.setMessage(message.id, isReaded, isDelivered, isEdited, isDeleted);
  }
  if (typeof isDelivered === 'boolean') {
    store.users.setMessage(message.id, isReaded, isDelivered, isEdited, isDeleted);
  }
  if (typeof isEdited === 'boolean') {
    store.users.setMessage(message.id, isReaded, isDelivered, isEdited, isDeleted);
  }
  if (typeof isDeleted === 'boolean') {
    store.users.setMessage(message.id, isReaded, isDelivered, isEdited, isDeleted);
  }
};

const changeError = (data: Record<string, string> | Record<string, Record<string, string>>): void => {
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
    [MESSAGE_DICTIONARY.send]: getMessage,
    [MESSAGE_DICTIONARY.fromUser]: getHistory,
    [MESSAGE_DICTIONARY.deliver]: changeMsg,
    [MESSAGE_DICTIONARY.read]: changeMsg,
    [MESSAGE_DICTIONARY.delete]: changeMsg,
    [MESSAGE_DICTIONARY.edit]: changeMsg,
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
