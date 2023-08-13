import { EventType, ICustomEventParams, StatusType } from "../types";
import { install, errorBoundary, init } from "./init";
import { default as reportData } from "./report";
import { getTimestamp } from "../utils";
import eventTrack from "./event/event";

// const use = (plugin: any, option?: any) => {
//   const instance = new plugin(option || {});

//   instance.init({ report: reportData });
// }

const add = (params: ICustomEventParams) => {
  const { type, time, data } = params
  eventTrack.add({
    type: type || EventType.Click,
    time: time || getTimestamp(),
    data,
    status: StatusType.Ok
  })
}

const report = (params: ICustomEventParams) => {
  const { type, time, data } = params
  reportData.send({
    type: type || EventType.Click,
    time: time || getTimestamp(),
    data,
    status: StatusType.Ok
  })
}

const sunshineTrack = {
  install,
  errorBoundary,
  init,
  // use,
  add,
  report
}

export default sunshineTrack