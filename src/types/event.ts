import { Callback } from './base';
import { IDeviceInfo } from './global';
import { CacheType } from './options';

// export const enum EventType {
//     Login = 'login', // 登录
//     EnterPage = 'enter_page', // 进入页面
//     LeavePage = 'leave_page', // 离开页面
//     HidePage = 'hide_page', // 隐藏页面
//     ShowPage = 'show_page', // 显示页面
//     PushPage = 'push_page', // 页面跳转
//     Click = 'click', // 点击
//     Input = 'input', // 输入框
//     Select = 'select', // 选择
//     Xhr = 'xhr', // xhr请求
//     Fetch = 'fetch', // fetch请求
//     Request = 'request', // 不区分 xhr/fetch 的请求
//     Download = 'download', // 下载
//     Search = 'search', // 搜索
// }

// export type EventType = 'click' | 'dblclick' | 'input' | 'resource' | 'white_screen' | 'performance' | 'recordscreen';
// export type EventCategory =
//   | 'click'
//   | 'request'
//   | 'xhr'
//   | 'fetch'
//   | 'download'
//   | 'request'
//   | 'enter_page'
//   | 'error'
//   | 'leave_page'
//   | 'hide_page'
//   | 'show_page'
//   | 'push_page'
//   | 'performance'
//   | 'recordscreen';

export const enum StatusType {
  Ok = 'ok',
  Error = 'error',
}

export const enum EventType {
  WhiteScreen = 'white_screen',
  Performance = 'performance',
  XHR = 'xhr',
  Fetch = 'fetch',
  Error = 'error',
  History = 'history',
  UnhandledRejection = 'unhandled_rejection',
  Click = 'click',
  HashChange = 'hash_change',
  Http = 'http',
  Resource = 'resource'
}

export interface IEventParams {
  type: EventType;
  // category: EventCategory;
  time?: number;
  data: any;
  status: StatusType;
}

export interface ICustomEventParams {
  type: any;
  time?: number;
  data: any;
}

export interface IReplaceParams {
  type: EventType;
  callback: Callback;
}

export interface IRouteParams {
  from: string;
  to: string;
}

export interface IErrorTarget {
  target?: {
    localName?: string;
  };
  error?: any;
  message?: string;
}

export interface IResourceTarget {
  src?: string;
  href?: string;
  localName?: string;
}

/**
 * 资源加载失败
 */
export interface IResouceError {
  time: number;
  message: string; // 加载失败的信息
  name: string; // 脚本类型：js脚本
}

export interface ICommonReportParams {
  userId: string;
  domain: string;
  href: string;
  uuid: string;
  userAgent: string;
  deviceInfo: IDeviceInfo;
}

export type IReportParams = IEventParams & ICommonReportParams;

export interface IEventOptions {
  cacheType: CacheType;
  projectKey: string;
  maxEvents: number
}