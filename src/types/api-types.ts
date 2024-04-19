type WsType =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_EXTERNAL_LOGIN'
  | 'USER_EXTERNAL_LOGOUT'
  | 'USER_ACTIVE'
  | 'USER_INACTIVE'
  | 'MSG_SEND'
  | 'MSG_FROM_USER'
  | 'MSG_DELIVER'
  | 'MSG_READ'
  | 'MSG_DELETE'
  | 'MSG_EDIT'
  | 'ERROR';

export const USER_DICTIONARY = {
  login: 'USER_LOGIN',
  logout: 'USER_LOGOUT',
  externalLogin: 'USER_EXTERNAL_LOGIN',
  externalLogout: 'USER_EXTERNAL_LOGOUT',
  active: 'USER_ACTIVE',
  inactive: 'USER_INACTIVE',
};

export const MESSAGE_DICTIONARY = {
  send: 'MSG_SEND',
  fromUser: 'MSG_FROM_USER',
  deliver: 'MSG_DELIVER',
  read: 'MSG_READ',
  delete: 'MSG_DELETE',
  edit: 'MSG_EDIT',
};

export const ERROR_TYPE = 'ERROR';

export type Response = {
  id: string | null;
  payload: Record<string, Record<string, string>> | Record<string, string>;
  type: WsType;
};

export type Error = {
  error: string;
};

export type StatusMsg = {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
};

export type Message = {
  id: string;
  datetime: number;
  from: string;
  to: string;
  text: string;
  status: StatusMsg;
};

export type Member = {
  isLogined: boolean;
  login: string;
  messages?: Message[];
  newMessages?: Message[];
};

export type Auth = {
  user: Member;
};
