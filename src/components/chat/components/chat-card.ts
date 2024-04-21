import BaseComponent from '@/components/shared/base-component';
import * as repository from '@/repositories/front-requests';
import store from '@/store/store';
import emitter from '@/utils/event-emitter';
import { isMessage } from '@/repositories/validation';
import type { Message, Member } from '@/types/api-types';
import { createChat, createMessagesCard } from '../service/chat-service';
import ChatActions from './chat-actions';
import ChatMemberInfo from './chat-member-info';
import ChatMessageActions from './chat-message-actions';
import ChatMessage from './chat-message';
import { scrollTo, readMessages, calculateActionsPosition } from '../service/helper';

export default class Chat extends BaseComponent {
  private chat: BaseComponent;
  private chatActions: ChatActions;
  private memberInfo: ChatMemberInfo;
  private messageActions: ChatMessageActions;
  private messagesCard: BaseComponent;
  private messagesComponents: ChatMessage[];
  private emptyText: BaseComponent;

  private messages: Message[];
  private divider: BaseComponent | null;

  constructor() {
    super('div', ['flex', 'w-2/3']);

    this.messageActions = new ChatMessageActions();
    this.messageActions.addListener('click', (event: Event) => this.setMessage(event));

    this.memberInfo = new ChatMemberInfo();
    this.emptyText = new BaseComponent('div', ['my-auto', 'mx-auto'], {}, 'Write your first message...');

    this.messages = [];
    this.messagesComponents = [];
    this.messagesCard = createMessagesCard();
    this.messagesCard.addListener('wheel', () => readMessages(store.users.getSelectedMember().login));
    this.messagesCard.addListener('click', () => readMessages(store.users.getSelectedMember().login));
    this.messagesCard.addListener('contextmenu', (event: Event) => this.showMsgActions(event));

    this.chatActions = new ChatActions();

    this.chat = createChat();
    this.chat.append(this.memberInfo, this.messagesCard, this.chatActions);
    this.append(this.chat);
    this.addEmitterListeners();

    this.divider = null;
  }

  private addEmitterListeners(): void {
    emitter.on('select-member', () => this.drawMemberChat());
    emitter.on('get-message', (message) => this.addNewMessageToChat(message));
    emitter.on('add-divider', (element) => this.addDivider(element));
    emitter.on('clean-divider', (data) => this.removeDivider(data));
    emitter.on('change-status', (element) => this.changeStatus(element));
  }

  private setMessage(event: Event): void {
    const { target } = event;
    if (target instanceof HTMLElement) {
      const edit = target.closest('.edit-message');
      const remove = target.closest('.remove-message');
      if (edit) {
        this.editMessage();
      }
      if (remove) {
        repository.deleteMessage(store.users.getSelectedMessage());
      }
    }

    this.messageActions.setClasses(['hide']);
  }

  private editMessage(): void {
    const messageComponent = this.messagesComponents.find((el) => el.getId() === store.users.getSelectedMessage());
    if (messageComponent === undefined) {
      return;
    }

    messageComponent.startEdit();
    const content = messageComponent.getContent();
    this.chatActions.fill(content);
  }

  private showMsgActions(event: Event): void {
    event.preventDefault();

    const { target } = event;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const msg = target.closest('.message.bg-gray-700');

    if (msg) {
      emitter.emit('show-msg-actions');

      const position = calculateActionsPosition(event, this.messagesCard.getElement());
      this.messageActions.changePosition(position);
      this.messageActions.removeClasses(['hide']);

      const parent = msg.parentElement;
      if (parent === null) {
        return;
      }
      const id = parent.getAttribute('id');
      if (typeof id === 'string') {
        store.users.setSelectedMessage(id);
      }

      msg.append(this.messageActions.getElement());
    } else {
      this.messageActions.setClasses(['hide']);
      store.users.setSelectedMessage('');
    }
  }

  private changeStatus(data: unknown): void {
    if (
      data !== null &&
      typeof data === 'object' &&
      'member' in data &&
      typeof data.member === 'string' &&
      'msg' in data &&
      typeof data.msg === 'object' &&
      isMessage(data.msg)
    ) {
      const { msg } = data;
      const messageComponent = this.messagesComponents.find((m) => m.getElement().id === msg.id);
      if (messageComponent === undefined) {
        return;
      }

      if (store.users.getSelectedMember().login === data.member && data.msg.from === store.user.getLogin()) {
        if (msg.status.isDeleted) {
          this.deleteMsgFromHistory(msg, messageComponent, data.msg.to);
          return;
        }
        messageComponent.setStatus(data.msg);
      }

      if (store.users.getSelectedMember().login === data.member && data.msg.to === store.user.getLogin()) {
        if (msg.status.isDeleted) {
          this.deleteMsgFromHistory(msg, messageComponent, data.msg.from, true);
        }
      }

      messageComponent.setEdited(data.msg);
      messageComponent.setText(data.msg.text);
    }
  }

  private deleteMsgFromHistory(msg: Message, messageComponent: ChatMessage, login: string, hasDivider = false): void {
    messageComponent.remove();

    this.messages = this.messages.filter((el) => el.id !== msg.id);
    this.messagesComponents = this.messagesComponents.filter((el) => el.getId() !== msg.id);
    store.users.removeMessages(login, msg.id);

    if (this.messages.length === 0) {
      this.messagesCard.replaceChildren(this.emptyText);
    }

    if (this.messagesComponents.length > 0 && this.messagesComponents[0] !== undefined) {
      this.messagesComponents[0].addClassFirstMsg();
      emitter.emit('change-counter', login);

      if (!msg.status.isReaded && hasDivider) {
        const data = store.users.getChatData(login);

        if (data !== null && data !== undefined && data.firstNewMessage) {
          const firstNewMsg = this.messagesComponents.find((el) => el.getId() === data.firstNewMessage);

          if (firstNewMsg === undefined) {
            return;
          }

          firstNewMsg.addDivider();
        }
      }
    }
  }

  private addDivider(element: unknown): void {
    if (element instanceof BaseComponent) {
      this.divider = element;
    }
  }

  private removeDivider(data: unknown): void {
    if (
      data !== null &&
      typeof data === 'object' &&
      'member' in data &&
      typeof data.member === 'string' &&
      'idMsg' in data &&
      typeof data.idMsg === 'string'
    ) {
      if (store.users.getSelectedMember().login === data.member && this.divider?.getId() === data.idMsg) {
        this.divider.removeClasses(['divider']);
        this.divider = null;
      }
    }
  }

  private drawMemberChat(): void {
    this.divider = null;

    const member = store.users.getSelectedMember();
    const data = store.users.getChatData(member.login);

    if (data !== undefined) {
      this.drawHistory(data);
      emitter.emit('change-member-info');
    }
  }

  private changeMessages(messages: Message[]): void {
    this.messages = [...this.messages, ...messages];
  }

  private drawHistory(member: Member): void {
    this.messages = [];

    if (member.messages !== undefined && member.firstNewMessage !== undefined) {
      this.changeMessages(member.messages);

      this.messagesComponents = [];
      const first = member.firstNewMessage;

      if (this.messages.length > 0) {
        this.messages.forEach((el, i) => {
          const msg = new ChatMessage(el, first);
          if (i === 0) {
            msg.addClassFirstMsg();
          }
          this.messagesComponents.push(msg);
          this.messagesCard.replaceChildren(...this.messagesComponents);
        });
      } else {
        this.messagesCard.replaceChildren(this.emptyText);
      }

      scrollTo(this.divider?.getElement() || this.messagesCard.getLastChild());
    }
  }

  private addNewMessageToChat(message: unknown): void {
    if (isMessage(message)) {
      const data = store.users.getChatData(store.users.getSelectedMember().login);

      if (
        data !== undefined &&
        'firstNewMessage' in data &&
        data.firstNewMessage !== undefined &&
        data.messages &&
        (data.messages?.length > this.messages.length || this.messages.length === 1)
      ) {
        this.changeMessages([message]);

        const msg = new ChatMessage(message, data.firstNewMessage);
        if (this.messages.length === 1) {
          msg.addClassFirstMsg();
          this.messagesCard.replaceChildren(msg);
        } else {
          this.messagesCard.append(msg);
        }

        this.messagesComponents.push(msg);

        if (message.from !== store.users.getSelectedMember().login) {
          scrollTo(msg.getElement());
        } else {
          scrollTo(this.divider?.getElement() || this.messagesCard.getLastChild());
        }
      }
    }
  }
}
