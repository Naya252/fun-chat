import { type UserType } from '@/types/types';

export default class User {
  private user: UserType;

  constructor(userData: UserType = { name: '', surname: '' }) {
    this.user = userData;
  }

  public getUser(): UserType {
    return this.user;
  }

  public hasUser(): boolean {
    return this.user.name !== '' && this.user.surname !== '';
  }

  public setUser(userData: UserType): void {
    this.user = { ...userData };
  }
}
