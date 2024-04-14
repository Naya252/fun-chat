import type { Response, Error, Auth } from '@/types/api-types';

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
