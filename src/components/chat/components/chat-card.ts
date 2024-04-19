import BaseComponent from '@/components/shared/base-component';
import type BaseButton from '@/components/shared/base-button/base-button';
import type BaseInput from '@/components/shared/base-input/base-input';
import * as repository from '@/repositories/front-requests';
import store from '@/store/store';
import emitter from '@/utils/event-emitter';
import { isMember, isMessage } from '@/repositories/validation';
import type { Message, Member } from '@/types/api-types';
import {
  createTextField,
  createMessage,
  createChat,
  createMessagesCard,
  createSendButton,
} from '../service/chat-service';
import { scrollTo } from '../service/helper';

export default class Chat extends BaseComponent {
  private chat: BaseComponent;
  private textField: BaseInput;
  private sendButton: BaseButton;
  private memberLogin: BaseComponent;
  private memberStatus: BaseComponent;
  private memberInfo: BaseComponent;
  private messagesCard: BaseComponent;
  private member: string;
  private messages: Message[];
  private divider: BaseComponent | null;

  constructor() {
    super('div', ['flex', 'w-2/3']);

    this.chat = createChat();
    this.memberLogin = new BaseComponent(
      'h2',
      ['font-semibold', 'text-gray-300'],
      {},
      'Select a user to send a message...',
    );
    this.memberStatus = new BaseComponent('p', ['font-semibold', 'text-gray-300']);
    this.memberInfo = new BaseComponent('div', ['flex', 'w-full', 'justify-between', 'px-6', 'mt-6']);
    this.memberInfo.append(this.memberLogin, this.memberStatus);
    this.member = '';

    this.messages = [];
    this.messagesCard = createMessagesCard();

    this.textField = createTextField('Type text...', ['py-3', 'px-6', 'bg-white/[.02]'], ['chat-msg-field', 'w-full'], {
      disabled: '',
    });
    this.sendButton = createSendButton();
    this.sendButton.addListener('click', () => this.sendMessage());
    document.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && store.user.isAuth()) {
        event.preventDefault();
        this.sendMessage();
      }
    });
    const chatActions = new BaseComponent('div', ['flex', 'max-h-12']);
    chatActions.append(this.textField, this.sendButton);

    this.chat.append(this.memberInfo, this.messagesCard, chatActions);
    this.append(this.chat);
    this.addEmitterListeners();

    this.divider = null;
  }

  private addEmitterListeners(): void {
    emitter.on('select-member', (member) => this.drawMemberChat(member));
    emitter.on('get-message', (message) => this.changeHistory(message));
    emitter.on('change-users', (member) => this.checkMember(member));
    emitter.on('add-divider', (element) => this.addDivider(element));
  }

  private addDivider(element: unknown): void {
    if (element instanceof BaseComponent) {
      this.divider = element;
    }
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
    this.divider = null;

    if (isMember(member)) {
      const { login, isLogined } = member;

      const data = store.users.getChatData(login);
      console.log('!!!!!!!!!!', data?.firstNewMessage);
      if (data !== undefined) {
        this.drawHistory(data);
      }

      this.redrawMemberInfo(login, isLogined);
    }
  }

  private redrawMemberInfo(login: string, isLogined: boolean): void {
    this.member = login;
    this.textField.setDisabled(false);
    this.sendButton.setDisabled(false);

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

  private drawHistory(member: Member): void {
    this.messages = [];

    if (member.messages !== undefined && member.firstNewMessage !== undefined) {
      this.changeMessages(member.messages);
      const elements: BaseComponent[] = [];

      const first = member.firstNewMessage;

      if (this.messages.length > 0) {
        this.messages.forEach((el) => {
          const msg = createMessage(el, first);
          elements.push(msg);
        });
      } else {
        const emptyText = new BaseComponent('div', ['my-auto', 'mx-auto'], {}, 'Write your first message...');
        elements.push(emptyText);
      }

      this.messagesCard.replaceChildren(...elements);
      scrollTo(this.divider?.getElement() || this.messagesCard.getLastChild());
    }
  }

  private changeHistory(message: unknown): void {
    if (isMessage(message)) {
      const data = store.users.getChatData(this.member);

      if (
        data !== undefined &&
        'firstNewMessage' in data &&
        data.firstNewMessage !== undefined &&
        data.messages &&
        (data.messages?.length > this.messages.length || this.messages.length === 1)
      ) {
        this.changeMessages([message]);

        const msg = createMessage(message, data.firstNewMessage);
        if (this.messages.length === 1) {
          this.messagesCard.replaceChildren(msg);
        } else {
          this.messagesCard.append(msg);
        }

        scrollTo(this.divider?.getElement() || this.messagesCard.getLastChild());
      }
    }
  }
}
