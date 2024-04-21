import ws from './ws';
import { USER_DICTIONARY, MESSAGE_DICTIONARY } from '../types/api-types';

export const loginUser = (login: string, password: string): void => {
  ws.send(
    JSON.stringify({
      id: 'string',
      type: USER_DICTIONARY.login,
      payload: {
        user: {
          login,
          password,
        },
      },
    }),
  );
};

export const logoutUser = (login: string, password: string): void => {
  ws.send(
    JSON.stringify({
      id: 'string',
      type: USER_DICTIONARY.logout,
      payload: {
        user: {
          login,
          password,
        },
      },
    }),
  );
};

export const getActiveUsers = (): void => {
  ws.send(
    JSON.stringify({
      id: 'string',
      type: USER_DICTIONARY.active,
      payload: null,
    }),
  );
};

export const getInactiveUsers = (): void => {
  ws.send(
    JSON.stringify({
      id: 'string',
      type: USER_DICTIONARY.inactive,
      payload: null,
    }),
  );
};

export const sendMessage = (to: string, text: string): void => {
  ws.send(
    JSON.stringify({
      id: 'string',
      type: MESSAGE_DICTIONARY.send,
      payload: {
        message: {
          to,
          text,
        },
      },
    }),
  );
};

export const getHistory = (login: unknown): void => {
  if (typeof login !== 'string') {
    return;
  }
  ws.send(
    JSON.stringify({
      id: 'string',
      type: MESSAGE_DICTIONARY.fromUser,
      payload: {
        user: {
          login,
        },
      },
    }),
  );
};

export const readMessage = (id: string): void => {
  ws.send(
    JSON.stringify({
      id: 'string',
      type: MESSAGE_DICTIONARY.read,
      payload: {
        message: {
          id,
        },
      },
    }),
  );
};

export const deleteMessage = (id: string): void => {
  ws.send(
    JSON.stringify({
      id: 'string',
      type: MESSAGE_DICTIONARY.delete,
      payload: {
        message: {
          id,
        },
      },
    }),
  );
};

export const editMessage = (id: string, text: string): void => {
  ws.send(
    JSON.stringify({
      id: 'string',
      type: MESSAGE_DICTIONARY.edit,
      payload: {
        message: {
          id,
          text,
        },
      },
    }),
  );
};
