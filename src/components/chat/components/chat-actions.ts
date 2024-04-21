import BaseComponent from '@/components/shared/base-component';
import BaseButton from '@/components/shared/base-button/base-button';
import type BaseInput from '@/components/shared/base-input/base-input';
import store from '@/store/store';
import * as repository from '@/repositories/front-requests';
import emitter from '@/utils/event-emitter';
import { createTextField } from '../service/chat-service';
import { readMessages } from '../service/helper';

const createSendButton = (): BaseButton => {
  const button = new BaseButton(
    'button',
    'Send',
    [
      'py-3',
      'max-w-16',
      'bg-gray-700',
      'hover:bg-gray-600',
      'focus-visible:outline-bg-gray-600',
      'disabled:text-gray-600',
      'disabled:bg-gray-700/[.02]',
      'disabled:hover:bg-gray-700/[.02]',
      'disabled:focus:bg-gray-700/[.02]',
    ],
    { disabled: '' },
  );

  return button;
};

const createCancelButton = (): BaseButton => {
  const button = new BaseButton('button', 'x', [
    'bg-gray-700',
    'hover:bg-gray-600',
    'focus-visible:outline-bg-gray-600',
    'disabled:text-gray-600',
    'disabled:bg-gray-700/[.02]',
    'disabled:hover:bg-gray-700/[.02]',
    'disabled:focus:bg-gray-700/[.02]',
    'cancel-btn',
    'hide',
  ]);

  return button;
};

export default class ChatActions extends BaseComponent {
  private textField: BaseInput;
  private sendButton: BaseButton;
  private cancelButton: BaseButton;
  private isEdit: boolean;

  constructor() {
    super('div', ['flex', 'max-h-12', 'chat-actions']);
    this.isEdit = false;

    this.textField = createTextField('Type text...', ['py-3', 'px-6', 'bg-white/[.02]'], ['chat-msg-field', 'w-full'], {
      disabled: '',
    });
    this.sendButton = createSendButton();
    this.cancelButton = createCancelButton();

    this.cancelButton.addListener('click', () => this.cancelEdit());

    this.append(this.textField, this.sendButton, this.cancelButton);
    this.addSendListener();
    emitter.on('select-member', () => this.activateActions());
  }

  private addSendListener(): void {
    this.sendButton.addListener('click', () => this.sendMessage());
    document.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && store.user.isAuth()) {
        event.preventDefault();
        this.sendMessage();
      }
    });
  }

  private sendMessage(): void {
    // const message = this.textField.getValue().trim();
    const message = this.textField.getValue();

    if (message.length > 0) {
      if (this.isEdit) {
        repository.editMessage(store.users.getSelectedMessage(), message);
        this.cancelEdit();
      } else {
        repository.sendMessage(store.users.getSelectedMember().login, message);
      }

      readMessages(store.users.getSelectedMember().login);
      this.textField.changeValue('');
    }
  }

  private activateActions(): void {
    this.textField.setDisabled(false);
    this.sendButton.setDisabled(false);
    this.cancelEdit();
  }

  public fill(value: string): void {
    this.textField.changeValue(value);
    this.changeTextButton('Edit');
    this.isEdit = true;
    this.cancelButton.removeClasses(['hide']);
  }

  public changeTextButton(title = 'Send'): void {
    this.sendButton.setTextContent(title);
  }

  private cancelEdit(): void {
    this.textField.changeValue('');
    this.changeTextButton();
    this.cancelButton.setClasses(['hide']);
    this.isEdit = false;
    emitter.emit('finish-edit');
  }
}
