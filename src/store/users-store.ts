import type { Member, Message } from '@/types/api-types';
import emitter from '@/utils/event-emitter';

const setReadSatus = (msg: Message, isReaded: boolean | null): void => {
  if (isReaded === null) {
    return;
  }

  const copyMsg = msg;
  copyMsg.status.isReaded = isReaded;
};

const setDelideredSatus = (msg: Message, isDelivered: boolean | null): void => {
  if (isDelivered === null) {
    return;
  }

  const copyMsg = msg;
  copyMsg.status.isDelivered = isDelivered;
};

const setEditedSatus = (msg: Message, isEdited: boolean | null): void => {
  if (isEdited === null) {
    return;
  }

  const copyMsg = msg;
  copyMsg.status.isEdited = isEdited;
};

const setNewMessages = (user: Member, id: string): void => {
  const copyUser = user;
  if (copyUser.newMessages instanceof Array) {
    copyUser.newMessages = copyUser.newMessages.filter((el) => el.id !== id);
    emitter.emit('change-counter', user.login);
  }
};

const cleanFirstNewMessage = (id: string, user: Member): void => {
  const copy = user;
  if (copy.firstNewMessage === id) {
    emitter.emit('clean-divider', { member: user.login, idMsg: id });

    copy.firstNewMessage = '';
  }
};

export default class Users {
  private activeUsers: Member[];
  private inactiveUsers: Member[];
  private isGetActive: boolean;
  private isGetInactive: boolean;
  private currentUser: string;

  constructor() {
    this.activeUsers = [];
    this.inactiveUsers = [];
    this.isGetActive = false;
    this.isGetInactive = false;
    this.currentUser = '';
  }

  private setCurrentUser(currentUser: string): void {
    this.currentUser = currentUser;
  }

  public getActiveUsers(): Member[] {
    return this.activeUsers;
  }

  public setActiveUsers(activeUsers: Member[], currentUser: string): void {
    this.activeUsers = [
      ...activeUsers.map((user) => ({ ...user, messages: [], newMessages: [], firstNewMessage: '' })),
    ];
    this.isGetActive = true;
    this.setCurrentUser(currentUser);
    this.checkUsers();
  }

  public getInactiveUsers(): Member[] {
    return this.activeUsers;
  }

  public setInactiveUsers(inactiveUsers: Member[], currentUser: string): void {
    this.inactiveUsers = [
      ...inactiveUsers.map((user) => ({ ...user, messages: [], newMessages: [], firstNewMessage: '' })),
    ];
    this.isGetInactive = true;
    this.setCurrentUser(currentUser);
    this.checkUsers();
  }

  private checkUsers(): void {
    if (this.isGetActive && this.isGetInactive) {
      this.getHistory();
    }
  }

  public getUsers(): Member[] {
    const users = [...this.activeUsers, ...this.inactiveUsers];
    return users.sort((a, b) => a.login.localeCompare(b.login));
  }

  public setUsers(user: Member): void {
    const item = this.getUsers().find((el) => el.login === user.login);
    if (item !== undefined) {
      item.isLogined = user.isLogined;
    } else {
      this.activeUsers.push({ ...user, messages: [], newMessages: [], firstNewMessage: '' });
    }
  }

  private getHistory(): void {
    const allUsers = this.getUsers();

    allUsers.forEach((user) => {
      if (user.login !== this.currentUser) {
        emitter.emit('get-user-history', user.login);
      }
    });
  }

  public setMessages(message: Message): void {
    const { from, to } = message;
    const member = [from, to].filter((login) => login !== this.currentUser);

    const memberObj = this.getUsers().find((user) => user.login === member[0]);

    if (
      memberObj !== undefined &&
      'messages' in memberObj &&
      memberObj.messages instanceof Array &&
      'newMessages' in memberObj &&
      memberObj.newMessages instanceof Array
    ) {
      memberObj.messages.push(message);

      if (message.from === member[0] && !message.status.isReaded) {
        if (memberObj.newMessages.length === 0) {
          memberObj.firstNewMessage = message.id;
        }
        memberObj.newMessages.push(message);

        emitter.emit('change-counter', message.from);
      }
    }

    emitter.emit('get-message', message);
  }

  public setStatus(
    id: string,
    isReaded: boolean | null = null,
    isDelivered: boolean | null = null,
    isEdited: boolean | null = null,
  ): void {
    const allUsers = this.getUsers();
    allUsers.forEach((user) => {
      if (user.newMessages?.some((message) => message.id === id)) {
        cleanFirstNewMessage(id, user);
        const msg = user.newMessages.find((el) => el.id === id);

        if (msg !== undefined) {
          setReadSatus(msg, isReaded);
          setDelideredSatus(msg, isDelivered);
          setEditedSatus(msg, isEdited);
          setNewMessages(user, msg.id);
        }

        console.log('CHANGE MSG - msg');

        console.log(user);
      }
    });
  }

  public changeHistory(messages: Message[]): void {
    messages.forEach((message) => {
      this.setMessages(message);
    });
    emitter.emit('change-users');
  }

  public getChatData(member: string): Member | undefined {
    const data = this.getUsers().find((user) => user.login === member);

    return data;
  }
}
