import type { Response, Error, Auth } from '@/types/api-types';
import { type UserType } from '@/types/types';

export const isResponse = (value: unknown): value is Response => {
  if (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    typeof value.id === 'string' &&
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
