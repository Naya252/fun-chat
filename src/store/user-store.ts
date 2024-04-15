import { type UserType } from '@/types/types';

export default class User {
  private user: UserType;

  constructor(userData: UserType = { login: '', password: '', isLogined: false }) {
    this.user = userData;
  }

  public getUser(): UserType {
    return this.user;
  }

  public setUser(user: UserType): void {
    this.user = { ...user };
  }

  public isAuth(): boolean {
    return this.user.isLogined;
  }

  public getLogin(): string {
    return this.user.login;
  }

  public setLogin(login: string): void {
    this.user.login = login;
  }

  public setPassword(password: string): void {
    this.user.password = password;
  }

  public setAuth(isLogined: boolean): void {
    this.user.isLogined = isLogined;
  }
}
