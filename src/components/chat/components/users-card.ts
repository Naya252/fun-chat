import BaseComponent from '@/components/shared/base-component';
import emitter from '@/utils/event-emitter';
import { type Member } from '@/types/api-types';
import type BaseInput from '@/components/shared/base-input/base-input';
import {
  createSide,
  createUsersWrapper,
  createUsers,
  createTextField,
  getMembers,
  selectMember,
} from '../service/chat-service';

export default class Users extends BaseComponent {
  private side: BaseComponent;
  private users: BaseComponent[];
  private userWrapper: BaseComponent;
  private searchField: BaseInput;

  constructor() {
    super('div', ['flex', 'w-1/3', 'min-w-40']);

    this.side = createSide();
    this.users = createUsers([]);
    this.userWrapper = createUsersWrapper();
    this.userWrapper.append(...this.users);
    this.userWrapper.addListener('click', (e: Event) => selectMember(e));

    this.searchField = createTextField('Search');
    this.searchField.inputListener('input', () => {
      this.search();
    });

    this.side.append(this.searchField, this.userWrapper);
    this.append(this.side);

    emitter.on('get-active-users', () => this.changeUsers(getMembers()));
    emitter.on('get-inactive-users', () => this.changeUsers(getMembers()));
    emitter.on('change-users', () => this.changeUsers(getMembers()));
    this.changeUsers(getMembers());
  }

  private changeUsers(users: Member[]): void {
    this.users = createUsers(users);
    this.userWrapper.replaceChildren(...this.users);
  }

  private search(): void {
    let users = getMembers();
    const value = this.searchField.getValue();
    users = users.filter((el) => el.login.toLowerCase().includes(value.toLowerCase()));
    this.changeUsers(users);
  }
}
