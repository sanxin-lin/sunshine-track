import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EventListener } from '../../utils/event-listener';

describe('utils -> event-listener.ts', () => {
  let eventListener = new EventListener();
  beforeEach(() => {
    eventListener = new EventListener();
  });
  it('event-listener on ', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const fn = vi.fn();
    eventListener.on({
      el: div,
      eventName: 'click',
      event: fn,
    });
    expect(fn).toHaveBeenCalledTimes(0);
    div.click();
    expect(fn).toHaveBeenCalledTimes(1);
    document.body.removeChild(div);
  });

  it('event-listener batchOn', () => {
    const div = document.createElement('div');
    const input = document.createElement('input');
    document.body.appendChild(div);
    document.body.appendChild(input);
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    eventListener.batchOn([
      {
        el: div,
        eventName: 'click',
        event: () => {
          fn1();
        },
      },
      {
        el: div,
        eventName: 'click',
        event: () => {
          fn1();
        },
      },
      {
        el: input,
        eventName: 'focus',
        event: fn2,
      },
    ]);
    expect(fn1).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(0);
    div.click();
    expect(fn1).toHaveBeenCalledTimes(2);
    input.focus();
    expect(fn2).toHaveBeenCalledTimes(1);
    document.body.removeChild(div);
    document.body.removeChild(input);
  });

  it('event-listener remove', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const fn = vi.fn();
    eventListener.batchOn([
      {
        el: div,
        eventName: 'click',
        event: fn,
      },
      {
        el: div,
        eventName: 'dblclick',
        event: fn,
      },
    ]);
    eventListener.remove({ el: div, eventName: 'click' });
    div.click();
    expect(fn).toHaveBeenCalledTimes(0);
    div.dispatchEvent(new MouseEvent('dblclick'));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('event-listener removeAllWithEl', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const fn = vi.fn();
    eventListener.batchOn([
      {
        el: div,
        eventName: 'click',
        event: fn,
      },
      {
        el: div,
        eventName: 'dblclick',
        event: fn,
      },
    ]);
    eventListener.removeAllWithEl(div);
    div.click();
    div.dispatchEvent(new MouseEvent('dblclick'));
    expect(fn).toHaveBeenCalledTimes(0);
  });

  it('event-listener reset', () => {
    const div = document.createElement('div');
    const input = document.createElement('input');
    document.body.appendChild(div);
    document.body.appendChild(input);
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    eventListener.batchOn([
      {
        el: div,
        eventName: 'click',
        event: fn1,
      },
      {
        el: input,
        eventName: 'focus',
        event: fn2,
      },
    ]);
    eventListener.reset();
    div.click();
    input.focus();
    expect(fn1).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(0);

    document.body.removeChild(div);
    document.body.removeChild(input);
  });
});
