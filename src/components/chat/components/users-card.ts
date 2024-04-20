import BaseComponent from '@/components/shared/base-component';
import emitter from '@/utils/event-emitter';
import { type Member } from '@/types/api-types';
import type BaseInput from '@/components/shared/base-input/base-input';
import store from '@/store/store';
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

    emitter.on('change-users', () => this.changeUsers(getMembers()));
    emitter.on('change-counter', (login) => this.changeCounter(login));
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

  private changeCounter(login: unknown): void {
    if (typeof login !== 'string') {
      return;
    }

    const value = this.users.find((el) => el.getId() === `user-${login}`);
    const data = store.users.getChatData(login);
    const counter = value?.getLastChild();

    if (data !== undefined && data.newMessages !== undefined && counter !== undefined) {
      counter.textContent = data.newMessages.length.toString();

      if (!(counter instanceof HTMLElement)) {
        return;
      }

      if (data.newMessages.length === 0) {
        counter.classList.add('hide');
      } else {
        counter.classList.remove('hide');
      }
    }
  }
}
