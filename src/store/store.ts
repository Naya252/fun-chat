import User from './user-store';
import Users from './users-store';

class Store {
  public user: User;
  public users: Users;

  constructor() {
    this.user = new User();
    this.users = new Users();
  }

  public cleanStore(): void {
    this.users = new Users();
    console.log(this.users);
  }
}

const store = new Store();

export default store;
