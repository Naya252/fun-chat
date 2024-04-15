import ws from './ws';
import { USER_DICTIONARY } from '../types/api-types';

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
      type: 'USER_LOGOUT',
      payload: {
        user: {
          login,
          password,
        },
      },
    }),
  );
};

export const loginExternalUser = (login: string, isLogined: boolean): void => {
  ws.send(
    JSON.stringify({
      id: null,
      type: 'USER_EXTERNAL_LOGIN',
      payload: {
        user: {
          login,
          isLogined,
        },
      },
    }),
  );
};

export const logoutExternalUser = (login: string, isLogined: boolean): void => {
  ws.send(
    JSON.stringify({
      id: null,
      type: 'USER_EXTERNAL_LOGOUT',
      payload: {
        user: {
          login,
          isLogined,
        },
      },
    }),
  );
};

// export const active = () => {};

// export const inactive = () => {};

// export const sendMessage = () => {};

// export const deliverMessage = () => {};

// export const readMessage = () => {};

// export const deleteMessage = () => {};

// export const editMessage = () => {};
