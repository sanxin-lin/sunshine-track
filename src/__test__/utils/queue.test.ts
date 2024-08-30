import { describe, expect, test, vi } from 'vitest';
import { Queue } from '../../utils/queue';
import { wait } from '../test-utils';

describe('utils -> queue.ts', () => {
  test('queue addFn async', () => {
    const fn = vi.fn();
    const queue = new Queue();
    queue.addFn(fn);
    queue.addFn(fn);

    expect(fn).toHaveBeenCalledTimes(0);
  });

  test('queue addFn async wait', async () => {
    const fn = vi.fn();
    const queue = new Queue();
    queue.addFn(fn);
    queue.addFn(fn);

    await wait();

    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('queue getStack', async () => {
    const fn = vi.fn();
    const queue = new Queue();
    queue.addFn(fn);
    queue.addFn(fn);

    expect(queue.getStack()).toStrictEqual([fn, fn]);
  });

  test('queue clear', async () => {
    const fn = vi.fn();
    const queue = new Queue();
    queue.addFn(fn);
    queue.addFn(fn);

    queue.clear();

    expect(queue.getStack()).toStrictEqual([]);

    await wait();

    expect(fn).toHaveBeenCalledTimes(0);
  });
});
