import BaseComponent from '@/components/shared/base-component';
import type BaseInput from '@/components/shared/base-input/base-input';
import emitter from '@/utils/event-emitter';
import { isMember } from '@/repositories/validation';
import { createTextField } from '../service/chat-service';

export default class Chat extends BaseComponent {
  private chat: BaseComponent;
  private textField: BaseInput;
  private memberLogin: BaseComponent;
  private memberStatus: BaseComponent;
  private memberInfo: BaseComponent;
  private messagesCard: BaseComponent;

  constructor() {
    super('div', ['flex', 'w-2/3']);

    this.chat = new BaseComponent('div', [
      'flex',
      'flex-col',
      'w-full',
      'ml-6',
      'my-6',
      'rounded-xl',
      'bg-gray-900/[.08]',
      'shadow-md',
    ]);

    this.memberLogin = new BaseComponent('h2', ['font-semibold', 'text-gray-300'], {}, 'Users');
    this.memberStatus = new BaseComponent('p', ['font-semibold', 'text-gray-300'], {}, 'status');
    this.memberInfo = new BaseComponent('div', ['flex', 'w-full', 'justify-between', 'px-6', 'mt-6']);
    this.memberInfo.append(this.memberLogin, this.memberStatus);

    this.messagesCard = new BaseComponent('div', ['overflow-auto', 'h-full']);

    this.textField = createTextField('Type text...', ['py-3', 'px-6'], ['chat-field']);
    this.textField.inputListener('input', (e) => {
      console.log(e);
    });

    this.chat.append(this.memberInfo, this.messagesCard, this.textField);
    this.append(this.chat);

    emitter.on('select-member', (member) => this.redrawChat(member));
  }

  private redrawChat(member: unknown): void {
    if (isMember(member)) {
      const { login, isLogined } = member;

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
}
