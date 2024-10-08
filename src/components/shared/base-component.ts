const formatClasses = (classNames: (string | undefined)[]): string[] => {
  let classes: string[] = [];

  if (classNames.length > 0) {
    classNames.forEach((el) => {
      const splitClass = el?.split(' ');
      splitClass?.forEach((cl) => classes.push(cl));
    });

    classes = classes.filter((el): el is string => typeof el === 'string');
  }

  return classes;
};

export default class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected readonly element: T;
  protected children: (BaseComponent | HTMLElement)[] = [];

  constructor(
    tag: keyof HTMLElementTagNameMap,
    classNames: (string | undefined)[] = [],
    attributes: Partial<T> = {},
    textContent = '',
  ) {
    this.element = document.createElement(tag) as T;

    const classes = classNames.filter((el): el is string => typeof el === 'string');
    this.setClasses(classes);
    this.setAttributes(attributes);
    this.setTextContent(textContent);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public setClasses(classNames: (string | undefined)[]): void {
    if (classNames.length > 0) {
      const classes = formatClasses(classNames);

      classes.forEach((className) => {
        this.element.classList.add(className);
      });
    }
  }

  public removeClasses(classNames: (string | undefined)[]): void {
    if (classNames.length > 0) {
      const classes = formatClasses(classNames);

      classes.forEach((className) => {
        this.element.classList.remove(className);
      });
    }
  }

  public setTextContent(text: string): void {
    if (typeof text === 'string') {
      this.element.textContent = text;
    }
  }

  public setHTML(string: string): void {
    this.element.innerHTML = string;
  }

  public setAttributes(attrs: Partial<T>): void {
    Object.entries(attrs).forEach(([attrName, attrValue]) => {
      if (typeof attrValue === 'string') {
        this.element.setAttribute(attrName, attrValue);
      }
    });
  }

  public addListener(eventName: string, listener: EventListenerOrEventListenerObject): void {
    this.element.addEventListener(eventName, listener);
  }

  public removeListener(eventName: string, listener: VoidFunction): void {
    this.element.removeEventListener(eventName, listener);
  }

  public appendToParent(parent: HTMLElement | BaseComponent): void {
    if (parent instanceof HTMLElement || parent instanceof BaseComponent) {
      parent.append(this.element);
    }
  }

  public append(...children: Array<HTMLElement | BaseComponent>): void {
    children.forEach((child) => {
      this.children.push(child);

      if (child instanceof HTMLElement) {
        this.element.append(child);
      } else if (child instanceof BaseComponent) {
        this.element.append(child.element);
      }
    });
  }

  public getChildrenComponents(): (BaseComponent | HTMLElement)[] {
    return this.children;
  }

  public getChildren(): NodeListOf<ChildNode> {
    const el = this.getElement();
    const children = el.childNodes;
    return children;
  }

  public getFirstChild(): ChildNode {
    const el = this.getElement();
    const child = el.firstChild;
    if (child === null) {
      throw new Error('Without child');
    }
    return child;
  }

  public getLastChild(): ChildNode {
    const el = this.getElement();
    const child = el.lastChild;
    if (child === null) {
      throw new Error('Without child');
    }
    return child;
  }

  public getParent(): ParentNode {
    const el = this.getElement();
    const parent = el.parentNode;

    if (parent === null) {
      throw new Error('not parent');
    }

    return parent;
  }

  public getId(): string {
    const el = this.getElement();
    const id = el.getAttribute('id');

    if (id === null) {
      throw new Error('not parent');
    }

    return id;
  }

  public replaceChildren(...children: Array<HTMLElement | BaseComponent>): void {
    this.children = [];
    const elements = children.map((child) => {
      this.children.push(child);

      if (child instanceof BaseComponent) {
        return child.element;
      }
      return child;
    });
    this.element.replaceChildren(...elements);
  }

  public removeChildren(): void {
    this.children.forEach((child) => {
      child.remove();
    });
  }

  public remove(): void {
    this.removeChildren();
    this.element.remove();
  }
}
