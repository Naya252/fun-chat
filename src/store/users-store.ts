import type { Member, Message } from '@/types/api-types';
import emitter from '@/utils/event-emitter';

const setReadSatus = (msg: Message, isReaded: boolean | null): void => {
  if (isReaded === null) {
    return;
  }
  const copyMsg = msg;
  copyMsg.status.isReaded = isReaded;
};

const setDeliveredSatus = (msg: Message, isDelivered: boolean | null): void => {
  if (isDelivered === null) {
    return;
  }
  const copyMsg = msg;
  copyMsg.status.isDelivered = isDelivered;
};

const setEditedSatus = (msg: Message, isEdited: boolean | null, text: string | null): void => {
  if (isEdited === null || text === null) {
    return;
  }

  const copyMsg = msg;
  copyMsg.status.isEdited = isEdited;
  copyMsg.text = text;
};

const deleteMessage = (msg: Message, isDeleted: boolean | null): void => {
  if (isDeleted === null) {
    return;
  }
  const copyMsg = msg;
  copyMsg.status.isDeleted = isDeleted;
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
  private selectedMember: Member;
  private selectedMessage: string;

  constructor() {
    this.activeUsers = [];
    this.inactiveUsers = [];
    this.isGetActive = false;
    this.isGetInactive = false;
    this.currentUser = '';
    this.selectedMember = { login: '', isLogined: false };
    this.selectedMessage = '';
  }

  public getSelectedMessage(): string {
    return this.selectedMessage;
  }

  public setSelectedMessage(selectedMessage: string): void {
    this.selectedMessage = selectedMessage;
  }

  public getSelectedMember(): Member {
    return this.selectedMember;
  }

  public setSelectedMember(selectedMember: Member): void {
    this.selectedMember = { ...selectedMember };
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

  public setMessage(
    id: string,
    isReaded: boolean | null = null,
    isDelivered: boolean | null = null,
    isEdited: boolean | null = null,
    isDeleted: boolean | null = null,
    text: string | null = null,
  ): void {
    const allUsers = this.getUsers();
    allUsers.forEach((user) => {
      if (user.messages?.some((message) => message.id === id)) {
        const msg = user.messages.find((el) => el.id === id);

        if (msg !== undefined) {
          setDeliveredSatus(msg, isDelivered);
          setReadSatus(msg, isReaded);
          setEditedSatus(msg, isEdited, text);
          deleteMessage(msg, isDeleted);

          emitter.emit('change-status', { member: user.login, msg });
        }
      }

      if (user.newMessages?.some((message) => message.id === id) && (isReaded || isDeleted)) {
        cleanFirstNewMessage(id, user);
        const msg = user.newMessages.find((el) => el.id === id);

        if (msg !== undefined) {
          setNewMessages(user, msg.id);
        }
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

  public removeMessages(login: string, id: string): void {
    const data = this.getChatData(login);
    if (
      data !== undefined &&
      data.messages instanceof Array &&
      data.newMessages instanceof Array &&
      typeof data.firstNewMessage === 'string'
    ) {
      data.messages = data.messages.filter((el) => el.id !== id);
      data.newMessages = data.newMessages.filter((el) => el.id !== id);
      if (data.firstNewMessage === id && data.newMessages[0]) {
        data.firstNewMessage = data.newMessages[0].id;
      }
    }
  }
}
