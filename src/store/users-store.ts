import type { Member, Message } from '@/types/api-types';
import emitter from '@/utils/event-emitter';

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

    emitter.emit('change-users');
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

        console.log(memberObj);

        emitter.emit('change-users');
        console.log('FIX ME', memberObj);
      }
    }

    emitter.emit('get-message', message);
  }

  public changeHistory(messages: Message[]): void {
    messages.forEach((message) => {
      this.setMessages(message);
    });
  }

  public getChatData(member: string): Member | undefined {
    const data = this.getUsers().find((user) => user.login === member);

    return data;
  }
}
