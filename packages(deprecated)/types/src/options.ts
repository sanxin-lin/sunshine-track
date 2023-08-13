import { EventType, IReportParams } from './event';

type ICustomReport = (data: IReportParams[]) => any

// type ReportType = 'poll' | 'realtime';
export interface IReportOptions {
  headers?: any;
  url: string;
  reportType?: 'img' | 'http' | 'beacon'
  format?: (data: any[]) => any;
  customReport?: ICustomReport
}

export type CacheType = 'normal' | 'storage' | 'db';

export interface IGlobalClickListenerItem {
  selector?: string;
  elementText?: string;
  data?: string;
}

type UserIdType = string | (() => string);

export interface ISwitch {
  xhr: boolean;
  fetch: boolean;
  error: boolean;
  whitescreen: boolean;
  hashchange: boolean;
  history: boolean;
  recordScreen: boolean;
}

export type SwitchMap = Record<EventType, boolean>;

export interface IOptions {
  projectKey: string;
  userId: UserIdType;
  report: IReportOptions;
  cacheType?: CacheType;
  globalClickListeners?: IGlobalClickListenerItem[];
  log?: boolean;
  whiteBoxElements?: string[];
  skeletonProject?: boolean;
  switchs?: Partial<ISwitch>;
  maxEvents?: number;
  checkHttpStatus?: (data: any) => boolean;
  filterHttpUrl?: (url: string, method: string) => boolean
}

export type PartialOptions = Partial<IOptions>;
