import BaseComponent from '@/components/shared/base-component';
import type { Message } from '@/types/api-types';
import store from '@/store/store';
import emitter from '@/utils/event-emitter';
import { formatDate } from '../service/helper';

const setStatusText = (msg: Message): string => {
  const deliveredStatus = msg.status.isDelivered ? 'delivered' : 'sent';
  const readedStatus = msg.status.isReaded ? 'read' : '';

  return readedStatus || deliveredStatus;
};

const setEditedText = (msg: Message): string => {
  const editedStatus = msg.status.isEdited ? 'edited' : '';

  return editedStatus;
};

export default class ChatMessage extends BaseComponent {
  private message: BaseComponent;
  private content: BaseComponent;
  private status: BaseComponent;
  private edited: BaseComponent;

  constructor(msg: Message, firstNewMessage: string) {
    super('div', ['pt-4', 'pb-1', 'flex'], { id: msg.id });

    this.message = new BaseComponent('div', ['px-3', 'py-2', 'rounded-md', 'message', 'flex', 'flex-col', 'gap-2'], {});
    this.append(this.message);

    this.changeDivider(msg.id, firstNewMessage);
    const header = new BaseComponent('div', ['flex', 'justify-between', 'gap-2', 'text-xs']);
    const author = new BaseComponent(
      'div',
      ['member-login'],
      {},
      msg.from === store.user.getLogin() ? 'you' : msg.from,
    );
    const msgDate = formatDate(msg.datetime);
    const date = new BaseComponent('div', [], {}, msgDate.toString());
    header.append(author, date);

    this.content = new BaseComponent('div', ['text-gray-300', 'content-msg'], {}, msg.text);
    const footer = new BaseComponent('div', ['text-xs', 'flex', 'justify-between', 'gap-2']);
    this.status = new BaseComponent('p');
    this.edited = new BaseComponent('p');
    footer.append(this.edited, this.status);

    this.changeClasses(msg);
    this.setEdited(msg);

    this.message.append(header, this.content, footer);
    emitter.on('finish-edit', () => this.cancelEdit());
  }

  public changeDivider(id: string, firstNewMessage: string): void {
    if (id === firstNewMessage) {
      this.setClasses(['divider']);
      emitter.emit('add-divider', this);
    }
  }

  public addDivider(): void {
    this.setClasses(['divider']);
    emitter.emit('add-divider', this);
  }

  private changeClasses(msg: Message): void {
    if (msg.from === store.user.getLogin()) {
      this.message.setClasses(['ml-auto', 'bg-gray-700']);

      this.setStatus(msg);
    } else {
      this.message.setClasses(['mr-auto', 'bg-gray-800']);
    }
  }

  public setStatus(msg: Message): void {
    this.status.setTextContent(setStatusText(msg));
  }

  public setEdited(msg: Message): void {
    this.edited.setTextContent(setEditedText(msg));
  }

  public setText(text: string): void {
    this.content.setTextContent(text);
  }

  public addClassFirstMsg(): void {
    this.setClasses(['mt-auto']);
  }

  public setClassMessage(classes: string[]): void {
    this.message.setClasses([...classes]);
  }

  public getContent(): string {
    const element = this.content.getElement();
    return element.textContent || '';
  }

  public cancelEdit(): void {
    this.message.removeClasses(['border-2', 'border-sky-500']);
  }

  public startEdit(): void {
    this.message.setClasses(['border-2', 'border-sky-500']);
  }
}
