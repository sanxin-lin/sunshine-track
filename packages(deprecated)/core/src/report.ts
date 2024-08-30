import {
  ICommonReportParams,
  IEventParams,
  IReportParams,
  IReportOptions,
} from '@sunshine-track/types';
import {
  __sunshine_track__,
  getCurrentDomain,
  getCurrentHref,
  getUUID,
  getUserAgent,
  Queue,
  log,
} from '@sunshine-track/utils';
import { isFunction, isArray } from 'lodash-es';

export class Report {
  private queue = new Queue();
  private options!: IReportOptions;
  recordScreenEnable!: boolean;
  private uuid: string;

  constructor() {
    this.uuid = getUUID();
  }

  setOptions(options: IReportOptions) {
    this.options = options;
  }

  getCommonReportData(): ICommonReportParams {
    return {
      uuid: this.uuid,
      domain: getCurrentDomain(),
      href: getCurrentHref(),
      userAgent: getUserAgent(),
      deviceInfo: __sunshine_track__.deviceInfo,
    };
  }

  getReportData(data: IEventParams): IReportParams {
    return {
      ...data,
      ...this.getCommonReportData(),
    };
  }

  async send(data: IEventParams | IEventParams[]) {
    const currentData = isArray(data) ? data : [data];

    const { url, format, customReport, reportType = 'http' } = this.options;

    let result = currentData.map(item => this.getReportData(item));

    // 开启录屏，由@sunshine-track/recordScreen 插件控制 （暂不做）
    // if (this.recordScreenEnable) {
    //   if (options.recordScreenTypeList.includes(data.type)) {
    //     // 修改hasError
    //     _support.hasError = true;
    //     data.recordScreenId = _support.recordScreenId;
    //   }
    // }
    result = isFunction(format) ? format(result) : result;

    log('Report data：', result);

    if (isFunction(customReport)) {
      customReport(result);
      return;
    }

    if (result) {
      switch (reportType) {
        case 'beacon':
          this.beaconReport(url, result);
          break;
        case 'img':
          this.imgReport(url, result);
          break;
        default:
          this.httpReport(url, result);
          break;
      }
    }
  }

  beaconReport(url: string, data: IReportParams[]): boolean {
    return navigator.sendBeacon(url, JSON.stringify(data));
  }

  async httpReport(url: string, data: IReportParams[]): Promise<void> {
    const requestFun = () => {
      fetch(`${url}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    };
    this.queue.addFn(requestFun);
  }

  imgReport(url: string, data: IReportParams[]): void {
    const requestFun = () => {
      const img = new Image();
      const spliceStr = url.indexOf('?') === -1 ? '?' : '&';
      img.src = `${url}${spliceStr}data=${encodeURIComponent(JSON.stringify(data))}`;
    };
    this.queue.addFn(requestFun);
  }
}

const report = new Report();

__sunshine_track__.report = report;

export default report;
