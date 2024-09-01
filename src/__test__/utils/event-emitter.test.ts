import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EventEmitter } from '../../utils/event-emitter';

describe('utils -> event-emitter.ts', () => {
  let eventEmitter = new EventEmitter();
  beforeEach(() => {
    eventEmitter = new EventEmitter();
  });

  it('EventEmitter subscribe emit', () => {
    let count = 0;
    const viFn = vi.fn();
    const listener = (data: number) => {
      count = data;
      viFn();
    };
    eventEmitter.subscribe('key', listener);
    expect(viFn).toHaveBeenCalledTimes(0);
    eventEmitter.emit('key', 3);
    expect(viFn).toHaveBeenCalledTimes(1);
    expect(count).toBe(3);
  });

  it('EventEmitter unsubscribe', () => {
    let count = 0;
    const viFn = vi.fn();
    const listener = (data: number) => {
      count = data;
      viFn();
    };
    eventEmitter.subscribe('key', listener);
    expect(viFn).toHaveBeenCalledTimes(0);
    eventEmitter.unsubscribe('key', listener);
    eventEmitter.emit('key', 3);
    expect(viFn).toHaveBeenCalledTimes(0);
    expect(count).toBe(0);
  });
});
