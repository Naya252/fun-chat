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

export default class ChatActions extends BaseComponent {
  private textField: BaseInput;
  private sendButton: BaseButton;

  constructor() {
    super('div', ['flex', 'max-h-12']);

    this.textField = createTextField('Type text...', ['py-3', 'px-6', 'bg-white/[.02]'], ['chat-msg-field', 'w-full'], {
      disabled: '',
    });
    this.sendButton = createSendButton();

    this.append(this.textField, this.sendButton);
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
    const message = this.textField.getValue().trim();

    if (message.length > 0) {
      repository.sendMessage(store.users.getSelectedMember().login, message);
      readMessages(store.users.getSelectedMember().login);
      this.textField.changeValue('');
    }
  }

  private activateActions(): void {
    this.textField.setDisabled(false);
    this.sendButton.setDisabled(false);
  }
}
