import { describe, expect, test } from 'vitest';
import {
  isValidString,
  unknownToString,
  validDns,
  validEmail,
  validPhone,
  validTypes,
} from '../../utils/validate';
import { PropType } from '../../types';

describe('utils -> validate.ts', () => {
  test('isValidString', () => {
    expect(isValidString('')).toBeFalsy();
    expect(isValidString('string')).toBeTruthy();
    expect(isValidString(1)).toBeFalsy();
  });

  test('validTypes', () => {
    expect(validPhone('15332332321')).toBeTruthy();
    expect(validPhone('05332332321')).toBeFalsy();

    expect(validEmail('888@qq.com')).toBeTruthy();
    expect(validEmail('888qq.com')).toBeFalsy();

    expect(validDns('https://www.aa.com')).toBeTruthy();
    expect(validDns('http://www.aa.com')).toBeTruthy();
    expect(validDns('ws://www.aa.com')).toBeFalsy();

    expect(
      validTypes([
        {
          field: 'field1',
          value: 'aaa',
          type: PropType.String,
        },
        {
          field: 'field2',
          value: '15332332321',
          type: PropType.Phone,
        },
      ]),
    ).toBeTruthy();

    expect(() =>
      validTypes([
        {
          field: 'field1',
          value: 'aaa',
          type: PropType.String,
        },
        {
          field: 'field2',
          value: '05332332321',
          type: PropType.Phone,
        },
      ]),
    ).toThrowError('[sunshine-track] options validate error: field2 is not of type phone');
  });

  test('unknownToString', () => {
    expect(unknownToString(undefined)).toBe('undefined');
    expect(unknownToString(null)).toBe('null');
    expect(unknownToString(1)).toBe('1');
    expect(unknownToString(true)).toBe('true');
    expect(unknownToString('string')).toBe('string');
    expect(unknownToString([1, 2])).toBe(JSON.stringify([1, 2]));
    expect(unknownToString({ a: 1, b: 2 })).toBe(JSON.stringify({ a: 1, b: 2 }));
  });
});
