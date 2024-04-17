import type { Response, Error, Auth, Member, Message, StatusMsg } from '@/types/api-types';
import { type UserType } from '@/types/types';

export const isResponse = (value: unknown): value is Response => {
  if (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    (typeof value.id === 'string' || value.id === null) &&
    'payload' in value &&
    typeof value.payload === 'object' &&
    'type' in value &&
    typeof value.type === 'string'
  ) {
    return true;
  }

  return false;
};

export const isError = (value: unknown): value is Error => {
  if (value !== null && typeof value === 'object' && 'error' in value && typeof value.error === 'string') {
    return true;
  }

  return false;
};

export const isAuth = (value: unknown): value is Auth => {
  if (
    value !== null &&
    typeof value === 'object' &&
    'user' in value &&
    typeof value.user === 'object' &&
    value.user !== null &&
    'isLogined' in value.user &&
    typeof value.user.isLogined === 'boolean' &&
    'login' in value.user &&
    typeof value.user.login === 'string'
  ) {
    return true;
  }

  return false;
};

export const isMember = (value: unknown): value is Member => {
  if (
    value !== null &&
    typeof value === 'object' &&
    'isLogined' in value &&
    typeof value.isLogined === 'boolean' &&
    'login' in value &&
    typeof value.login === 'string'
  ) {
    return true;
  }

  return false;
};

export const isUsers = (value: unknown): value is Member[] => {
  if (value !== null && typeof value === 'object' && value instanceof Array && value.every((el) => isMember(el))) {
    return true;
  }

  return false;
};

export const isUser = (value: unknown): value is UserType => {
  if (
    value !== null &&
    typeof value === 'object' &&
    'login' in value &&
    typeof value.login === 'string' &&
    'password' in value &&
    typeof value.password === 'string' &&
    'isLogined' in value &&
    typeof value.isLogined === 'boolean'
  ) {
    return true;
  }

  return false;
};

export const isStatusMsg = (value: unknown): value is StatusMsg => {
  if (
    value !== null &&
    typeof value === 'object' &&
    'isDelivered' in value &&
    typeof value.isDelivered === 'boolean' &&
    'isReaded' in value &&
    typeof value.isReaded === 'boolean' &&
    'isEdited' in value &&
    typeof value.isEdited === 'boolean'
  ) {
    return true;
  }

  return false;
};

export const isMessage = (value: unknown): value is Message => {
  if (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    typeof value.id === 'string' &&
    'datetime' in value &&
    typeof value.datetime === 'number' &&
    'from' in value &&
    typeof value.from === 'string' &&
    'to' in value &&
    typeof value.to === 'string' &&
    'text' in value &&
    typeof value.text === 'string' &&
    'status' in value &&
    typeof value.status === 'object' &&
    isStatusMsg(value.status)
  ) {
    return true;
  }

  return false;
};

export const isMessages = (value: unknown): value is Message[] => {
  if (value !== null && value instanceof Array && value.every((el) => isMessage(el))) {
    return true;
  }

  return false;
};
