import BaseComponent from '@/components/shared/base-component';

type ButtonType = 'submit' | 'reset' | 'button' | 'menu';

export default class BaseButton extends BaseComponent {
  constructor(type: ButtonType, text: string, className: (string | undefined)[], attrs: Record<string, string> = {}) {
    super(
      'button',
      [
        'flex',
        'w-full',
        'justify-center',
        'rounded-md',
        'px-3',
        'py-1.5',
        'text-sm',
        'font-semibold',
        'leading-6',
        'text-white',
        'shadow-sm',
        'focus-visible:outline',
        'focus-visible:outline-2',
        'focus-visible:outline-offset-2',
        'disabled:opacity-75',
        ...className,
      ],
      { ...attrs, type } as Record<string, string>,
      text,
    );
  }

  public setDisabled(value: boolean): void {
    const item = this.getElement();
    if (!value) {
      item.removeAttribute('disabled');
    } else {
      item.setAttribute('disabled', '');
    }
  }
}
