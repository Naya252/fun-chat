import { type Member } from '@/types/api-types';

export default class Users {
  private activeUsers: Member[];
  private inactiveUsers: Member[];

  constructor() {
    this.activeUsers = [];
    this.inactiveUsers = [];
  }

  public getActiveUsers(): Member[] {
    return this.activeUsers;
  }

  public setActiveUsers(activeUsers: Member[]): void {
    this.activeUsers = [...activeUsers];
  }

  public getInactiveUsers(): Member[] {
    return this.activeUsers;
  }

  public setInactiveUsers(inactiveUsers: Member[]): void {
    this.inactiveUsers = [...inactiveUsers];
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
      this.activeUsers.push(user);
    }
  }
}
