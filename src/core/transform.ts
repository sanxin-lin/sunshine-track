import { HttpCode, HttpData, IResouceError, IResourceTarget, SpanStatus, StatusType } from '../types';
import { getTimestamp } from '../utils';
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import options from './options';

export function interceptStr(str: string, interceptLength: number): string {
  if (isString(str)) {
    return (
      str.slice(0, interceptLength) +
      (str.length > interceptLength ? `:截取前${interceptLength}个字符` : '')
    );
  }
  return '';
}

export function fromHttpStatus(httpStatus: any) {
  if (httpStatus < 400) {
    return SpanStatus.Ok;
  }
  if (httpStatus >= 400 && httpStatus < 500) {
    switch (httpStatus) {
      case 401:
        return SpanStatus.Unauthenticated;
      case 403:
        return SpanStatus.PermissionDenied;
      case 404:
        return SpanStatus.NotFound;
      case 409:
        return SpanStatus.AlreadyExists;
      case 413:
        return SpanStatus.FailedPrecondition;
      case 429:
        return SpanStatus.ResourceExhausted;
      default:
        return SpanStatus.InvalidArgument;
    }
  }
  if (httpStatus >= 500 && httpStatus < 600) {
    switch (httpStatus) {
      case 501:
        return SpanStatus.Unimplemented;
      case 503:
        return SpanStatus.Unavailable;
      case 504:
        return SpanStatus.DeadlineExceeded;
      default:
        return SpanStatus.InternalError;
    }
  }
  return SpanStatus.UnknownError;
}

// 处理接口的状态
export function httpTransform(data: HttpData): HttpData {
  const { checkHttpStatus } = options.get()
  let message: any = '';
  const { elapsedTime, time, method = '', type, Status = 200, response, requestData } = data;
  let status: StatusType;
  if (Status === 0) {
    status = StatusType.Error;
    // message =
    //   elapsedTime <= options.overTime * 1000
    //     ? `请求失败，Status值为:${Status}`
    //     : '请求失败，接口超时';
  } else if ((Status as number) < HttpCode.BAD_REQUEST) {
    status = StatusType.Ok;
    if (isFunction(checkHttpStatus)) {
      if (checkHttpStatus(data)) {
        status = StatusType.Ok;
      } else {
        status = StatusType.Error;
        message = `接口报错，报错信息为：${
          isObject(response) ? JSON.stringify(response) : response
        }`;
      }
    }
  } else {
    status = StatusType.Error;
    message = `请求失败，Status值为:${Status}，${fromHttpStatus(Status as number)}`;
  }
  message = `${data.url}; ${message}`;
  return {
    url: data.url,
    time,
    status,
    elapsedTime,
    message,
    requestData: {
      httpType: type as string,
      method,
      data: requestData || '',
    },
    response: {
      Status,
      data: status == StatusType.Error ? response : null,
    },
  };
}

export function resourceTransform(target: IResourceTarget): IResouceError {
  return {
    time: getTimestamp(),
    message:
      (interceptStr(target.src as string, 120) || interceptStr(target.href as string, 120)) +
      '; 资源加载失败',
    name: target.localName as string,
  };
}
