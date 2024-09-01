import { beforeEach, describe, expect, it } from 'vitest';
import { INIT_OPTIONS, getInitOptions, Options } from '../../core/options';

describe('core -> options.ts', () => {
  it('getInitOptions', () => {
    expect(getInitOptions()).toEqual(INIT_OPTIONS);
  });

  let options = null as unknown as Options;
  beforeEach(() => {
    options = new Options({
      projectKey: 'sunshine-test-project',
      userId: 'sunshineLin',
      report: {
        headers: {
          token: 'sunshine_test_token',
        },
        url: 'https://www.sunshineLin.test.com/report',
      },
    });
  });

  it('Options validate', () => {
    expect(() =>
      options.set({
        projectKey: 123 as unknown as string,
      }),
    ).toThrowError('[sunshine-track] options validate error: projectKey is not of type string');
    options.reset();
    expect(() =>
      options.set({
        report: {
          url: 'sunshine/report',
        },
      }),
    ).toThrowError('[sunshine-track] options validate error: url is not of type dns');
  });

  it('Options get', () => {
    expect(options.get()).toEqual({
      projectKey: 'sunshine-test-project',
      userId: 'sunshineLin',
      log: false,
      cacheType: 'normal',
      whiteBoxElements: [],
      skeletonProject: false,
      report: {
        headers: { token: 'sunshine_test_token' },
        url: 'https://www.sunshineLin.test.com/report',
      },
      globalClickListeners: [],
      maxEvents: 10,
      filterHttpUrl: undefined,
      checkHttpStatus: undefined,
      historyUrlsNum: undefined,
    });
  });

  it('Options switchs', () => {
    expect(options.getSwitchs()).toEqual({
      error: false,
      fetch: false,
      hashchange: false,
      history: false,
      performance: false,
      recordScreen: false,
      whitescreen: false,
      xhr: false,
    });
    options.set({
      switchs: {
        history: true,
        xhr: true,
      },
    });
    expect(options.getSwitchs()).toEqual({
      error: false,
      fetch: false,
      hashchange: false,
      history: true,
      performance: false,
      recordScreen: false,
      whitescreen: false,
      xhr: true,
    });
  });

  it('Options headers', () => {
    expect(options.getHeaders()).toEqual({ token: 'sunshine_test_token' });
    options.set({
      report: {
        headers: {
          'sunshine-locale': 'zh-CN',
        },
      },
    });
    expect(options.getHeaders()).toEqual({
      token: 'sunshine_test_token',
      'sunshine-locale': 'zh-CN',
    });
  });

  it('Options headers', () => {
    expect(options.getHeaders()).toEqual({ token: 'sunshine_test_token' });
    options.set({
      report: {
        headers: {
          'sunshine-locale': 'zh-CN',
        },
      },
    });
    expect(options.getHeaders()).toEqual({
      token: 'sunshine_test_token',
      'sunshine-locale': 'zh-CN',
    });
  });

  it('Options userId', () => {
    expect(options.getUserId()).toBe('sunshineLin');
    options.set({ userId: () => 'sanxin-lin' });
    expect(options.getUserId()).toBe('sanxin-lin');
  });

  it('Options globalClickListeners', () => {
    expect(options.getGlobalClickListeners()).toEqual([]);
    options.set({
      globalClickListeners: [
        {
          selector: '.sunshine-test-class',
          elementText: 'SUNSHINE_TEST_TEXT',
          data: 'SUNSHINE',
        },
      ],
    });
    expect(options.getGlobalClickListeners()).toEqual([
      {
        selector: '.sunshine-test-class',
        elementText: 'SUNSHINE_TEST_TEXT',
        data: 'SUNSHINE',
      },
    ]);
  });

  it('Options report', () => {
    expect(options.getReport()).toEqual({
      headers: { token: 'sunshine_test_token' },
      url: 'https://www.sunshineLin.test.com/report',
    });
    options.set({
      report: {
        reportType: 'http',
      },
    });
    expect(options.getReport()).toEqual({
      headers: { token: 'sunshine_test_token' },
      url: 'https://www.sunshineLin.test.com/report',
      reportType: 'http',
    });
  });

  it('Options reset', () => {
    options.set({
      log: true,
      cacheType: 'db',
      maxEvents: 20,
    });
    expect(options.get()).toEqual({
      projectKey: 'sunshine-test-project',
      userId: 'sunshineLin',
      log: true,
      cacheType: 'db',
      whiteBoxElements: [],
      skeletonProject: false,
      report: {
        headers: { token: 'sunshine_test_token' },
        url: 'https://www.sunshineLin.test.com/report',
      },
      globalClickListeners: [],
      maxEvents: 20,
      filterHttpUrl: undefined,
      checkHttpStatus: undefined,
      historyUrlsNum: undefined,
    });
    options.reset();
    expect(options.get()).toEqual({
      projectKey: 'sunshine-test-project',
      userId: 'sunshineLin',
      log: false,
      cacheType: 'normal',
      whiteBoxElements: [],
      skeletonProject: false,
      report: {
        headers: { token: 'sunshine_test_token' },
        url: 'https://www.sunshineLin.test.com/report',
      },
      globalClickListeners: [],
      maxEvents: 10,
      filterHttpUrl: undefined,
      checkHttpStatus: undefined,
      historyUrlsNum: undefined,
    });
  });
});
