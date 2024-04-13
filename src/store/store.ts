import User from './user-store';

class Store {
  public user: User;

  constructor() {
    this.user = new User();
  }
}

const store = new Store();

export default store;
