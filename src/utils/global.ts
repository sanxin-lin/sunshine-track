import { type Global, type ISunshineTrack } from "../types";
import { UAParser } from "ua-parser-js";

const ua = new UAParser().getResult();

export const _global = window as unknown as Global;
export const _document = document as unknown as Document

export const getGlobalTrack = () => {
  _global.__sunshine_track__ =
    _global.__sunshine_track__ || ({} as ISunshineTrack);
  return _global.__sunshine_track__;
};

export const __sunshine_track__ = getGlobalTrack();

export const UNKNOWN = "Unknown";

__sunshine_track__.deviceInfo = {
  browserVendor: ua.browser.name ?? UNKNOWN,
  browserVersion: ua.browser.version ?? UNKNOWN,
  os: ua.os.name ?? UNKNOWN,
  osVersion: ua.os.version ?? UNKNOWN,
  device: ua.device.model ?? UNKNOWN,
  deviceType: ua.device.type ?? UNKNOWN,
  deviceVendor: ua.device.vendor ?? UNKNOWN,
};


export const isSupportFetch = () => {
  return 'fetch' in _global
}