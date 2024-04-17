import BaseComponent from '@/components/shared/base-component';
import type BaseInput from '@/components/shared/base-input/base-input';
import * as repository from '@/repositories/front-requests';
import emitter from '@/utils/event-emitter';
import { isMember, isMessages, isMessage } from '@/repositories/validation';
import { type Message } from '@/types/api-types';
import { createTextField, createMessage } from '../service/chat-service';

export default class Chat extends BaseComponent {
  private chat: BaseComponent;
  private textField: BaseInput;
  private memberLogin: BaseComponent;
  private memberStatus: BaseComponent;
  private memberInfo: BaseComponent;
  private messagesCard: BaseComponent;
  private member: string;
  private messages: Message[];

  constructor() {
    super('div', ['flex', 'w-2/3']);

    this.chat = new BaseComponent('div', [
      'flex',
      'flex-col',
      'w-full',
      'ml-6',
      'my-6',
      'rounded-xl',
      'bg-white/[.04]',
      'shadow-md',
    ]);

    this.memberLogin = new BaseComponent('h2', ['font-semibold', 'text-gray-300']);
    this.memberStatus = new BaseComponent('p', ['font-semibold', 'text-gray-300']);
    this.memberInfo = new BaseComponent('div', ['flex', 'w-full', 'justify-between', 'px-6', 'mt-6']);
    this.memberInfo.append(this.memberLogin, this.memberStatus);
    this.member = '';
    this.messages = [];

    this.messagesCard = new BaseComponent('div', ['overflow-auto', 'h-full']);

    this.textField = createTextField('Type text...', ['py-3', 'px-6', 'bg-white/[.02]'], ['chat-field']);
    this.textField.inputListener('change', () => {
      this.sendMessage();
    });

    this.chat.append(this.memberInfo, this.messagesCard, this.textField);
    this.append(this.chat);

    emitter.on('select-member', (member) => this.drawMemberChat(member));
    emitter.on('get-histiry', (messages) => this.drawHistory(messages));
    emitter.on('get-message', (message) => this.changeHistory(message));
    emitter.on('change-users', (member) => this.checkMember(member));
  }

  private checkMember(member: unknown): void {
    if (isMember(member)) {
      if (this.member === member.login) {
        const { login, isLogined } = member;
        this.redrawMemberInfo(login, isLogined);
      }
    }
  }

  private drawMemberChat(member: unknown): void {
    if (isMember(member)) {
      const { login, isLogined } = member;

      repository.getHistory(login);
      this.redrawMemberInfo(login, isLogined);
    }
  }

  private redrawMemberInfo(login: string, isLogined: boolean): void {
    this.member = login;

    this.memberLogin.setTextContent(login);

    const status = new BaseComponent(
      'p',
      [isLogined ? 'text-sky-400' : 'text-slate-500'],
      {},
      isLogined ? 'online' : 'offline',
    );
    this.memberStatus.replaceChildren(status);
  }

  private sendMessage(): void {
    const message = this.textField.getValue().trim();

    if (message.length > 0) {
      repository.sendMessage(this.member, message);
      this.textField.changeValue('');
    }
  }

  private changeMessages(messages: Message[]): void {
    this.messages = [...this.messages, ...messages];
  }

  private drawHistory(messages: unknown): void {
    if (isMessages(messages)) {
      this.changeMessages(messages);

      const elements: BaseComponent[] = [];

      this.messages.forEach((el) => {
        const msg = createMessage(el);
        elements.push(msg);
      });

      this.messagesCard.replaceChildren(...elements);
    }
  }

  private changeHistory(message: unknown): void {
    if (isMessage(message)) {
      this.changeMessages([message]);

      const msg = createMessage(message);
      this.messagesCard.append(msg);
    }
  }
}
