import BaseComponent from '@/components/shared/base-component';
import emitter from '@/utils/event-emitter';
import { type Member } from '@/types/api-types';
import type BaseInput from '@/components/shared/base-input/base-input';
import store from '@/store/store';
import { getSelectedMember } from '@/repositories/user-repository';
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
  private destroyFns: VoidFunction[] = [];

  constructor() {
    super('div', ['flex', 'w-1/3', 'min-w-40', 'side-card']);

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

    this.destroyFns = [
      emitter.on('change-users', () => this.changeUsers(getMembers())),
      emitter.on('change-counter', (login) => this.changeCounter(login)),
      emitter.on('remove-selected-class', () => this.removeSelectedClass()),
      emitter.on('show-menu', () => this.setClasses(['show-menu'])),
      emitter.on('hide-menu', () => this.removeClasses(['show-menu'])),
      emitter.on('toggle-menu', () => this.changeMenu()),
    ];
    this.changeUsers(getMembers());

    setTimeout(() => {
      const selectedMember = getSelectedMember();
      const selectedUserComponent = this.users.find((el) => el.getId().includes(selectedMember));
      selectedUserComponent?.getElement().click();
    }, 0);
  }

  public remove(): void {
    this.destroyFns.forEach((fn) => fn());
    super.remove();
  }

  private changeMenu(): void {
    const el = this.getElement();

    if (el.classList.contains('show-menu')) {
      emitter.emit('hide-menu');
    } else {
      emitter.emit('show-menu');
    }
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

  private removeSelectedClass(): void {
    this.users.forEach((el) => el.removeClasses(['selected-user']));
  }
}
