export interface IDeviceInfo {
  browserVendor: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  deviceType: string;
  deviceVendor: string;
}

export interface ISunshineTrack {
  deviceInfo: IDeviceInfo;
  eventTrack: any;
  options: any;
  _loopTimer: any;
  report: any;
  hasError: boolean;
  recordScreenId: any
}

export interface Global extends Window {
  chrome: any;
  performance: Performance;
  history: History;
  __sunshine_track__: ISunshineTrack;
}
