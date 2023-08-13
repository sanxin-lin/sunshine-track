import { safeExecute } from './log'

type EventHandler<T> = (data: T) => void;

export class EventEmitter<T = any> {
  private eventHandlers: Map<string, EventHandler<T>[]>;

  constructor() {
    this.eventHandlers = new Map();
  }

  subscribe(eventName: string, handler: EventHandler<T>): void {
    const target = this.eventHandlers.get(eventName)
    if (target) {
      target.push(handler);
    } else {
      this.eventHandlers.set(eventName, [handler]);
    }
  }

  unsubscribe(eventName: string, handler: EventHandler<T>): void {
    if (this.eventHandlers.has(eventName)) {
      const handlers = this.eventHandlers.get(eventName)!;
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
        if (handlers.length === 0) {
          this.eventHandlers.delete(eventName);
        }
      }
    }
  }

  emit(eventName: string, data?: T): void {
    if (this.eventHandlers.has(eventName)) {
      const handlers = this.eventHandlers.get(eventName)!;
      handlers.forEach((handler) => safeExecute(() => handler(data!)));
    }
  }
}

export default EventEmitter