import BaseComponent from '@/components/shared/base-component';
import emitter from '@/utils/event-emitter';
import store from '@/store/store';
import { isMember } from '@/repositories/validation';

const createMemberLogin = (): BaseComponent => {
  const el = new BaseComponent('h2', ['font-semibold', 'text-gray-300'], {}, 'Select a user to send a message...');
  return el;
};

export default class ChatMemberInfo extends BaseComponent {
  private memberLogin: BaseComponent;
  private memberStatus: BaseComponent;

  constructor() {
    super('div', ['flex', 'w-full', 'justify-between', 'px-6', 'mt-6']);

    this.memberLogin = createMemberLogin();
    this.memberStatus = new BaseComponent('p', ['font-semibold', 'text-gray-300']);
    this.append(this.memberLogin, this.memberStatus);
    emitter.on('change-member-info', () => this.redrawMemberInfo());
    emitter.on('change-users', (member) => this.checkMember(member));
  }

  private checkMember(member: unknown): void {
    if (isMember(member) && store.users.getSelectedMember().login === member.login) {
      this.redrawMemberInfo();
    }
  }

  private redrawMemberInfo(): void {
    const member = store.users.getSelectedMember();
    const data = store.users.getChatData(member.login);
    if (data === undefined) {
      return;
    }
    const { login, isLogined } = data;
    this.memberLogin.setTextContent(login);
    const status = new BaseComponent(
      'p',
      [isLogined ? 'text-sky-400' : 'text-slate-500'],
      {},
      isLogined ? 'online' : 'offline',
    );
    this.memberStatus.replaceChildren(status);
  }
}
