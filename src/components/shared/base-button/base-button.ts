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
        'bg-sky-600',
        'px-3',
        'py-1.5',
        'text-sm',
        'font-semibold',
        'leading-6',
        'text-white',
        'shadow-sm',
        'hover:bg-sky-500',
        'focus-visible:outline',
        'focus-visible:outline-2',
        'focus-visible:outline-offset-2',
        'focus-visible:outline-sky-600',
        ...className,
      ],
      { ...attrs, type } as Record<string, string>,
      text,
    );
  }
}
