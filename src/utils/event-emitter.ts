type EventHandler = (...args: unknown[]) => void;

class EventEmitter {
  private events: Record<string, EventHandler[]>;

  constructor() {
    this.events = {};
  }

  public on(eventName: string, fn: EventHandler): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName]?.push(fn);
  }

  public off(eventName: string, fn: EventHandler): void {
    if (this.events[eventName]) {
      this.events[eventName]?.filter((existFn) => existFn !== fn);
    }
  }

  public emit(eventName: string, ...args: unknown[]): void {
    if (this.events[eventName]) {
      this.events[eventName]?.forEach((fn) => fn(...args));
    }
  }
}

const emitter = new EventEmitter();
export default emitter;
