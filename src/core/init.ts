import { EventType, type IOptions, type ViewModel } from '../types'
import { setupOptions } from './options'
import { setupCache, setupReplace } from './setup'
import EventCollection from './event'
import { setupDirective } from './directive'



export const init = async (options: IOptions) => {
  setupOptions(options)
  setupReplace()
  await setupCache(options)
}

export const install = (Vue: any, options: IOptions) => {
  init(options)
  setupDirective(Vue)
  const handler = Vue.config.errorHandler;
  Vue.config.errorHandler = function (err: Error, vm: ViewModel, info: string): void {
    EventCollection[EventType.Error](err);
    if (handler) handler.apply(null, [err, vm, info]);
  };
}

// react项目在ErrorBoundary中上报错误
export const errorBoundary = (err: Error): void => {
  EventCollection[EventType.Error](err);
}