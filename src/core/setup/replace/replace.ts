import throttle from 'lodash/throttle';
import isFunction from 'lodash/isFunction';
import { Callback, IReplaceParams, RequestMethod, voidFunc, EventType } from '../../../types';
import { on, _global, getHref, getTimestamp, EventEmitter, isSupportFetch } from '../../../utils';
import options from '../../options';

const eventEmitter = new EventEmitter();

const emit = (type: EventType, data?: any) => {
  eventEmitter.emit(type, data)
}

const subscribe = (type: EventType, callback: Callback) => {
  eventEmitter.subscribe(type, callback)
}

// 判断请求的 url 需不需要过滤
const checkIsDisabledUrl = (url: string, method: string) => {
  const { filterHttpUrl, report } = options.get()
  const { url: reportUrl } = report
  const isReportUrl = reportUrl === url && method === RequestMethod.POST
  const isFilterHttpUrl = isFunction(filterHttpUrl) && filterHttpUrl(url, method)
  return isReportUrl || isFilterHttpUrl
}


const listenWindowClick = () => {
  on({
    el: _global,
    eventName: 'click',
    event: throttle(function (e: PointerEvent) {
      emit(EventType.Click, e);
    }, 300),
    capture: true,
  });
};

const listenHashChange = () => {
  on({
    el: _global,
    eventName: 'hashchange',
    event: (e: HashChangeEvent) => {
      emit(EventType.HashChange, e);
    },
  });
};

const listenError = () => {
  on({
    el: _global,
    eventName: 'error',
    event: (e: ErrorEvent) => {
      emit(EventType.Error, e);
    },
  });
};

const listenUnhandledRejection = () => {
  on({
    el: _global,
    eventName: 'unhandledrejection',
    event: (e: PromiseRejectionEvent) => {
      emit(EventType.UnhandledRejection, e);
    },
  });
};

const whiteScreen = () => {
  emit(EventType.WhiteScreen);
};

const replaceXhr = () => {
  const xhrProto = XMLHttpRequest.prototype;
  replaceAop(xhrProto, 'open', (originalOpen: voidFunc) => {
    return function (this: any, ...args: any[]): void {
      const [method, url] = args;
      this.trackParams = {
        method: (method as string).toUpperCase(),
        url,
        time: getTimestamp(),
        type: EventType.XHR,
      };
      originalOpen.apply(this, args);
    };
  });
  replaceAop(xhrProto, 'send', (originalSend: voidFunc) => {
    return function (this: any, ...args: any[]): void {
      const [requestData] = args;
      const { method, url } = this.trackParams
      on({
        el: this,
        eventName: 'loadend',
        event(this: any) {
          if (checkIsDisabledUrl(url, method)) return

          const { responseType, response, status } = this;
          this.trackParams.requestData = requestData;
          this.trackParams.Status = status;
          this.trackParams.elapsedTime = getTimestamp() - this.trackParams.time;
          if (['', 'json', 'text'].includes(responseType)) {
            const { checkHttpStatus } = options.get()
            // 用户设置handleHttpStatus函数来判断接口是否正确，只有接口报错时才保留response
            if (isFunction(checkHttpStatus)) {
              this.trackParams.response = response && JSON.parse(response);
            }
          }
          emit(EventType.XHR, this.trackParams);
        },
      });
      originalSend.apply(this, args);
    };
  });
};

function replaceFetch(): void {
  if (!isSupportFetch()) {
    return;
  }
  replaceAop(_global, 'fetch', originalFetch => {
    return function (url: any, config: Partial<Request> = {}): void {
      const sTime = getTimestamp();
      const method = (config && config.method) || 'GET';
      let fetchData = {
        type: EventType.Fetch,
        method: (method as string).toUpperCase(),
        requestData: config && config.body,
        url,
        response: '',
      };
      const headers = new Headers(config.headers || {});
      Object.assign(headers, {
        setRequestHeader: headers.set,
      });
      config = Object.assign({}, config, headers);
      return originalFetch.apply(_global, [url, config]).then(
        (res: any) => {
          const tempRes = res.clone();
          const eTime = getTimestamp();
          fetchData = Object.assign({}, fetchData, {
            elapsedTime: eTime - sTime,
            Status: tempRes.status,
            time: sTime,
          });
          tempRes.text().then((data: any) => {
            if (checkIsDisabledUrl(url, method)) return
            const { checkHttpStatus } = options.get()
            // 用户设置handleHttpStatus函数来判断接口是否正确，只有接口报错时才保留response
            if (isFunction(checkHttpStatus)) {
              fetchData.response = data;
            }
            emit(EventType.Fetch, fetchData);
          });
          return res;
        },
        // 接口报错
        (err: any) => {
          if (checkIsDisabledUrl(url, method)) return
          const eTime = getTimestamp();
          fetchData = Object.assign({}, fetchData, {
            elapsedTime: eTime - sTime,
            status: 0,
            time: sTime,
          });
          emit(EventType.Fetch, fetchData);
          throw err;
        },
      );
    };
  });
}

let preHref: string = getHref();
const replaceHistory = () => {
  const onPopstate = _global.onpopstate;
  _global.onpopstate = function (this: any, ...args: any) {
    const to = getHref();
    const from = preHref;
    preHref = to;
    emit(EventType.History, {
      from,
      to,
    });
    onPopstate?.apply(this, args);
  };
  const replaceFn = (originalFn: voidFunc): voidFunc => {
    return function (this: any, ...args: any[]) {
      const url = args?.[2];
      if (url) {
        const from = preHref;
        const to = url;
        preHref = to;
        emit(EventType.History, {
          from,
          to,
        });
      }
      return originalFn.apply(this, args);
    };
  };
  replaceAop(_global.history, 'pushState', replaceFn);
  replaceAop(_global.history, 'replaceState', replaceFn);
};

const listenOrReplace = (type: EventType) => {
  switch (type) {
    case EventType.Click:
      listenWindowClick();
      break;
    case EventType.HashChange:
      listenHashChange();
      break;
    case EventType.Error:
      listenError();
      break;
    case EventType.UnhandledRejection:
      listenUnhandledRejection();
      break;
    case EventType.History:
      replaceHistory();
      break;
    case EventType.XHR:
      replaceXhr();
      break;
    case EventType.Fetch:
      replaceFetch();
      break;
    case EventType.WhiteScreen:
      whiteScreen();
      break;
  }
};

export const addListenOrReplace = (replaceParams: IReplaceParams) => {
  const { type, callback } = replaceParams;
  subscribe(type, callback);
  listenOrReplace(type);
};

export function replaceAop(
  source: { [key: string]: any },
  name: string,
  replacement: voidFunc,
  isForced = false,
) {
  if (source === undefined) return;
  if (name in source || isForced) {
    const original = source[name];
    const wrapped = replacement(original);
    if (typeof wrapped === 'function') {
      source[name] = wrapped;
    }
  }
}
