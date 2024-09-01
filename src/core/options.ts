import { __sunshine_track__, setLogFlag, validTypes } from '../utils';
import type { IOptions, ISwitch, PartialOptions, SwitchMap } from '../types';
import { PropType, EventType } from '../types';
import eventTrack from './event/event';
import { merge, isArray, uniqBy, isFunction, cloneDeep } from 'lodash-es';
import report from './report';

export const INIT_OPTIONS: IOptions = {
  projectKey: '',
  userId: '',
  report: {
    url: '',
    headers: {},
    reportType: 'http',
  },
  log: false,
  cacheType: 'normal',
  whiteBoxElements: ['html', 'body', '#app', '#root'],
  skeletonProject: false,
  maxEvents: 10,
  historyUrlsNum: 3,
};

export const getInitOptions = (): IOptions => cloneDeep(INIT_OPTIONS);

export class Options {
  // 用来记录构造函数传进来的配置，可用于重置
  private initOptions = getInitOptions();
  private options = getInitOptions();
  private switchMap = {} as SwitchMap;

  constructor(options?: IOptions) {
    if (options) {
      this.initOptions = cloneDeep(options);
      this.options = cloneDeep(options);
    }
  }

  get() {
    const {
      projectKey,
      userId = '',
      log = false,
      cacheType = 'normal',
      whiteBoxElements = [],
      skeletonProject = false,
      maxEvents = 10,
      filterHttpUrl,
      checkHttpStatus,
      historyUrlsNum,
    } = this.options;
    return {
      projectKey,
      userId,
      log,
      cacheType,
      whiteBoxElements,
      skeletonProject,
      report: this.getReport(),
      globalClickListeners: this.getGlobalClickListeners(),
      maxEvents,
      filterHttpUrl,
      checkHttpStatus,
      historyUrlsNum,
    };
  }

  set(o: PartialOptions = {}) {
    const { options } = this;
    this.options = merge(options, o);
    this.setSwitchMap();
    this.validate();
  }

  private setSwitchMap() {
    const {
      xhr,
      fetch,
      error,
      whitescreen,
      hashchange,
      history,
      performance,
      // recordScreen,
    } = this.getSwitchs();
    this.switchMap[EventType.XHR] = xhr;
    this.switchMap[EventType.Fetch] = fetch;
    this.switchMap[EventType.Error] = error;
    this.switchMap[EventType.WhiteScreen] = whitescreen;
    this.switchMap[EventType.HashChange] = hashchange;
    this.switchMap[EventType.History] = history;
    this.switchMap[EventType.Performance] = performance;
  }

  getSwitchMap() {
    return this.switchMap;
  }

  getReport() {
    const { report } = this.options;
    return report;
  }

  getGlobalClickListeners() {
    const { globalClickListeners } = this.options;
    if (!isArray(globalClickListeners)) return [];
    return uniqBy(globalClickListeners, o => `${o.selector}${o.elementText}${o.data}`);
  }

  getSwitchs(): ISwitch {
    const { switchs = {} } = this.options;
    const {
      xhr = false,
      fetch = false,
      error = false,
      whitescreen = false,
      hashchange = false,
      history = false,
      recordScreen = false,
      performance = false,
    } = switchs;

    return {
      xhr,
      fetch,
      error,
      whitescreen,
      hashchange,
      history,
      recordScreen,
      performance,
    };
  }

  getHeaders() {
    const { headers = {} } = this.getReport();

    return isFunction(headers) ? headers() : headers;
  }

  getUserId() {
    const { userId } = this.options;

    return isFunction(userId) ? userId() : userId;
  }

  // getCustomReportFn() {
  //     const { customReport } = this.options
  //     return customReport
  // }

  validate() {
    const { report, projectKey } = this.options;
    const { url } = report || {};
    // 校验必填项
    validTypes([
      { field: 'projectKey', type: PropType.String, value: projectKey },
      { field: 'url', type: PropType.Dns, value: url },
    ]);
  }

  reset() {
    this.options = cloneDeep(this.initOptions);
  }
}

const options = new Options();

__sunshine_track__.options = options;

export const setupOptions = (o: IOptions) => {
  options.set(o);
  const { report: reportOptions, cacheType, maxEvents, projectKey, log, userId } = options.get();
  eventTrack.setOptions({
    cacheType,
    projectKey,
    maxEvents,
  });
  report.setOptions({
    ...reportOptions,
    userId,
  });
  setLogFlag(log);
};

export default options;
