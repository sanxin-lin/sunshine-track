import ErrorStackParser from 'error-stack-parser';
import {
  IRouteParams,
  EventType,
  type IErrorTarget,
  HttpData,
  StatusType,
} from '../../types';
import eventTrack from './event';
import {
  getTargetDomByPointerEvent,
  getTimestamp,
  htmlElementAsString,
  parseUrlToObj,
  unknownToString,
} from '../../utils';
import { openWhiteScreen } from '../setup/whiteScreen';
import options from '../options';
import report from '../report';
import { httpTransform, resourceTransform } from '../transform';
import takeRight from 'lodash/takeRight'

const hashCallback = () => {
  let urls: any[] = []
  return (data: HashChangeEvent) => {
    const { historyUrlsNum } = options.get()
    const { oldURL, newURL } = data;
    const { relative: from } = parseUrlToObj(oldURL);
    const { relative: to } = parseUrlToObj(newURL);
    if (to) {
      urls.push(to)
    }
    urls = takeRight(urls, historyUrlsNum)
    eventTrack.add({
      type: EventType.HashChange,
      data: {
        from,
        to,
        urls
      },
      status: StatusType.Ok,
      time: getTimestamp(),
    });
  }
}

const historyCallback = () => {
  let urls: any[] = []
  return (data: IRouteParams) => {
    const { historyUrlsNum } = options.get()
    const { from, to } = data;
    const { relative: currentFrom } = parseUrlToObj(from);
    const { relative: currentTo } = parseUrlToObj(to);
    const isSame = currentFrom === currentTo
    if (!isSame) {
      urls.push(to)
      urls = takeRight(urls, historyUrlsNum)
      eventTrack.add({
        type: EventType.History,
        data: {
          from: currentFrom || '/',
          to: currentTo || '/',
          urls
        },
        status: StatusType.Ok,
        time: getTimestamp(),
      });
    }
  }
}

const EventCollection = {
  [EventType.Click]: (e: PointerEvent) => {
    const globalClickListeners = options.getGlobalClickListeners();
    const el = getTargetDomByPointerEvent(e);
    if (!el) return;

    if (globalClickListeners.length) {
      globalClickListeners.forEach(({ selector, elementText, data = '' }) => {
        if (selector) {
          const els = document.querySelectorAll(selector);
          const isIncludes = [...(els as unknown as any[])].includes(el);
          isIncludes &&
            eventTrack.add({
              type: EventType.Click,
              data: data,
              status: StatusType.Ok,
              time: getTimestamp(),
            });
        } else if (el.textContent === elementText) {
          eventTrack.add({
            type: EventType.Click,
            data: data,
            status: StatusType.Ok,
            time: getTimestamp(),
          });
        }
      });
      return;
    }

    const htmlString = htmlElementAsString(el);
    if (htmlString) {
      eventTrack.add({
        type: EventType.Click,
        data: htmlString,
        status: StatusType.Ok,
        time: getTimestamp(),
      });
    }
  },
  [EventType.HashChange]: hashCallback(),
  [EventType.History]: historyCallback(),
  [EventType.WhiteScreen]: () => {
    const { whiteBoxElements, skeletonProject } = options.get();
    openWhiteScreen(
      status => {
        report.send({
          status: StatusType.Ok,
          type: EventType.WhiteScreen,
          time: getTimestamp(),
          data: status,
        });
      },
      {
        whiteBoxElements,
        skeletonProject,
      },
    );
  },
  [EventType.UnhandledRejection]: (e: PromiseRejectionEvent) => {
    const stackFrame = ErrorStackParser.parse(e.reason)[0];
    const { fileName, columnNumber: column, lineNumber: line } = stackFrame;
    const message = unknownToString(e.reason.message || e.reason.stack);
    const data = {
      message,
      fileName,
      line,
      column,
      type: EventType.UnhandledRejection,
    };
    // eventTrack.add({
    //   time: getTimestamp(),
    //   data,
    //   status: StatusType.Error,
    // });
    report.send({
      type: EventType.UnhandledRejection,
      time: getTimestamp(),
      data,
      status: StatusType.Error,
    });
  },
  [EventType.Error]: (e: IErrorTarget) => {
    const { target, error, message } = e;
    if (!target?.localName) {
      const stackFrame = ErrorStackParser.parse(!target ? e : error)[0];
      const { fileName, columnNumber: column, lineNumber: line } = stackFrame;
      const errorData = {
        type: EventType.Error,
        message,
        fileName,
        line,
        column,
      };
      // eventTrack.add({
      //   data: errorData,
      //   time: getTimestamp(),
      //   status: StatusType.Error,
      // });
      report.send({
        type: EventType.Error,
        data: errorData,
        time: getTimestamp(),
        status: StatusType.Error,
      });
    }

    // 资源加载报错
    if (target?.localName) {
      // 提取资源加载的信息
      const data = resourceTransform(target);
      // eventTrack.add({
      //   type: EventType.Resource,
      //   status: StatusType.Error,
      //   time: getTimestamp(),
      //   data,
      // });
      report.send({
        type: EventType.Resource,
        status: StatusType.Error,
        time: getTimestamp(),
        data,
      });
    }
  },
  [EventType.Http]: (data: HttpData, type: EventType.Fetch | EventType.XHR) => {
    const result = httpTransform(data);
    const { url } = options.getReport();

    if (result.status === StatusType.Error) {
      // 上报接口错误
      report.send({
        type,
        data: result,
        status: StatusType.Error,
        time: data.time,
      });
      return;
    }

    // 添加用户行为，去掉自身上报的接口行为
    if (!data.url.includes(url)) {
      eventTrack.add({
        type,
        data: result,
        status: StatusType.Ok,
        time: data.time,
      });
    }
  },
};

export default EventCollection;
