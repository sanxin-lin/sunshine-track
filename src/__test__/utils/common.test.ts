import { describe, expect, it } from 'vitest';
import { parseUrlToObj } from '../../utils/common';

describe('utils -> common.ts', () => {
  // it('htmlElementAsString', () => {
  //   const div = document.createElement('div');
  //   div.classList.add('sunshine-track-class-name1', 'sunshine-track-class-name2');
  //   div.innerText = 'TEST_TEXT';
  //   expect(htmlElementAsString(div)).toBe(
  //     `<div class='sunshine-track-class-name1 sunshine-track-class-name2'>TEST_TEXT</div>`,
  //   );
  // });

  it('parseUrlToObj', () => {
    expect(parseUrlToObj('https://www.aa.com/page#hash?name=sunshine')).toStrictEqual({
      host: 'www.aa.com',
      path: '/page',
      protocol: 'https',
      relative: '/page#hash?name=sunshine',
    });
  });
});
