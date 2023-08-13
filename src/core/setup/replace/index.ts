import { HttpData, EventType } from '../../../types';
import { addListenOrReplace } from './replace';
import EventCollection from '../../event';
import options from '../../options';
import WebPerformance from '../../../performance'
import report from '../../report';

export const setupReplace = () => {
  const siwtchMap = options.getSwitchMap();
  const globalClickListeners = options.getGlobalClickListeners();
  globalClickListeners.length &&
    addListenOrReplace({
      type: EventType.Click,
      callback: EventCollection[EventType.Click],
    });
  siwtchMap[EventType.Error] &&
    addListenOrReplace({
      type: EventType.Error,
      callback: EventCollection[EventType.Error],
    });
  siwtchMap[EventType.HashChange] &&
    addListenOrReplace({
      type: EventType.HashChange,
      callback: EventCollection[EventType.HashChange],
    });
  siwtchMap[EventType.History] &&
    addListenOrReplace({
      type: EventType.History,
      callback: EventCollection[EventType.History],
    });
  siwtchMap[EventType.XHR] &&
    addListenOrReplace({
      type: EventType.XHR,
      callback: (data: HttpData) => {
        EventCollection[EventType.Http](data, EventType.XHR);
      },
    });
  siwtchMap[EventType.Fetch] &&
    addListenOrReplace({
      type: EventType.Fetch,
      callback: (data: HttpData) => {
        EventCollection[EventType.Http](data, EventType.Fetch);
      },
    });
  siwtchMap[EventType.UnhandledRejection] &&
    addListenOrReplace({
      type: EventType.UnhandledRejection,
      callback: EventCollection[EventType.UnhandledRejection],
    });
  siwtchMap[EventType.WhiteScreen] &&
    addListenOrReplace({
      type: EventType.WhiteScreen,
      callback: EventCollection[EventType.WhiteScreen],
    });
  if (siwtchMap[EventType.Performance]) {
    new WebPerformance({ report })
  }
};
