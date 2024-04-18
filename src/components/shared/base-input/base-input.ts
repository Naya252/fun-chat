import BaseComponent from '@/components/shared/base-component';

type InputType =
  | 'text'
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'time'
  | 'url'
  | 'week';

const createLabel = (inputId: string, labelText: string): BaseComponent => {
  const label = new BaseComponent<HTMLLabelElement>(
    'label',
    ['block', 'text-sm', 'font-medium', 'leading-6', 'text-gray-400'],
    { for: inputId } as Record<string, string>,
    labelText,
  );

  return label;
};

const createText = (textId: string, subtext: string): BaseComponent => {
  const text = new BaseComponent(
    'div',
    ['form-text', 'text-gray-300', 'text-xs', 'text-rose-300', 'min-h-4', 'mt-1'],
    { id: textId },
    subtext,
  );

  return text;
};

const createInput = (inputId: string, inputType: InputType, attr: Record<string, string>): BaseComponent => {
  const input = new BaseComponent<HTMLInputElement>(
    'input',
    [
      'block',
      'w-full',
      'rounded-md',
      'border-0',
      'py-1.5',
      'px-3',
      'text-slate-200',
      'shadow-sm',
      'ring-1',
      'ring-gray-500',
      'placeholder:text-slate-500',
      'focus:outline-none',
      'focus:ring-inset',
      'focus:ring-2',
      'focus:ring-sky-500',
      'sm:text-sm',
      'sm:leading-6',
      'bg-gray-700',
    ],
    {
      ...attr,
      id: inputId,
      type: inputType,
    },
  );

  return input;
};

export default class BaseInput extends BaseComponent {
  private readonly input: BaseComponent;

  private readonly text: BaseComponent;

  constructor(
    inputId: string,
    labelText: string,
    textId: string,
    subtext: string,
    attr: Record<string, string>,
    inputType: InputType = 'text',
    classes: string[] = [],
    mainClasses: string[] = [],
  ) {
    super('div', ['input-wrapper', ...mainClasses]);

    const label = createLabel(inputId, labelText);
    this.input = createInput(inputId, inputType, attr);
    if (classes.length > 0) {
      this.input.setClasses(classes);
    }
    const inputWrapper = new BaseComponent('div');
    this.text = createText(textId, subtext);
    inputWrapper.append(this.input);
    this.append(label, inputWrapper, this.text);
  }

  public inputListener(eventName: string, listener: EventListenerOrEventListenerObject): void {
    this.input.addListener(eventName, listener);
  }

  public getValue(): string {
    const el = this.input.getElement();

    if (!('value' in el)) {
      throw new Error('not value');
    }
    if (typeof el.value !== 'string') {
      throw new Error('not string');
    }

    return el.value;
  }

  public changeValue(value: string): void {
    const el = this.input.getElement();

    if (!('value' in el)) {
      throw new Error('not value');
    }
    if (typeof value !== 'string') {
      throw new Error('not string');
    }

    el.value = value;
  }

  public changeSubText(): void {
    this.text.setHTML('');
  }

  public setDisabled(value: boolean): void {
    const item = this.input.getElement();
    if (!value) {
      item.removeAttribute('disabled');
    } else {
      item.setAttribute('disabled', '');
    }
  }
}
