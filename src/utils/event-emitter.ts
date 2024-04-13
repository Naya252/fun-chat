type EventHandler = (...args: unknown[]) => void;

class EventEmitter {
  events: Record<string, EventHandler[]>;

  constructor() {
    this.events = {};
  }

  on(eventName: string, fn: EventHandler) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName]?.push(fn);
  }

  off(eventName: string, fn: EventHandler) {
    if (this.events[eventName]) {
      this.events[eventName]?.filter((existFn) => existFn !== fn);
    }
  }

  emit(eventName: string, ...args: unknown[]) {
    if (this.events[eventName]) {
      this.events[eventName]?.forEach((fn) => fn(...args));
    }
  }
}

export const emitter = new EventEmitter();
