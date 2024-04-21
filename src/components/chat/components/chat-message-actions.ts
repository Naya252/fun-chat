import BaseComponent from '@/components/shared/base-component';
import BaseButton from '@/components/shared/base-button/base-button';
import emitter from '@/utils/event-emitter';

const createButton = (title: string, className: string): BaseButton => {
  const button = new BaseButton('button', title, [
    'py-2',
    'max-full',
    'bg-gray-900',
    'hover:bg-white/[.07]',
    'focus:outline-none',
    'focus-visible:bg-white/[.05]',
    className,
  ]);

  return button;
};

export default class ChatMessageActions extends BaseComponent {
  constructor() {
    super('div', [
      'w-32',
      'h-20',
      'text-gray-200',
      'bg-gray-900',
      'action-card',
      'hide',
      'rounded-md',
      'actions',
      'shadow-md',
    ]);

    const editBtn = createButton('Edit', 'edit-message');
    const removeBtn = createButton('Remove', 'remove-message');

    this.append(editBtn, removeBtn);
    emitter.on('click-document', (event) => this.checkActions(event));
  }

  public checkActions(event: unknown): void {
    if (!(event instanceof Event)) {
      return;
    }

    const { target } = event;
    if (target instanceof HTMLElement) {
      const actions = target.closest('.actions');

      if (!actions) {
        this.setClasses(['hide']);
      }
    }
  }

  public changePosition({ left, right, top, bottom }: Record<string, string>): void {
    this.getElement().style.cssText = `top: ${top}; left: ${left}; right: ${right}; bottom: ${bottom}`;
  }
}
