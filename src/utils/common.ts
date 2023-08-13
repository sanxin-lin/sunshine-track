import { _global } from './global';

// 获取当前时间戳
export const getTimestamp = () => Date.now();

// 获取当前href
export const getHref = () => _global.location.href;

// 获取当前域名
export const getCurrentDomain = () => window.location.host

// 获取当前页面路径
export const getCurrentHref = () => window.location.href

// 获取uuid
export const getUUID = (): string => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

// 获取user-agent
export const getUserAgent = () => navigator.userAgent

export function htmlElementAsString(target: HTMLElement): string {
  const tagName = target.tagName.toLowerCase();
  if (tagName === 'body') {
    return '';
  }
  let classNames = target.classList.value;

  classNames = classNames !== '' ? ` class='${classNames}'` : '';
  const id = target.id ? ` id="${target.id}"` : '';
  const innerText = target.innerText;
  return `<${tagName}${id}${classNames !== '' ? classNames : ''}>${innerText}</${tagName}>`;
}

export const getTargetDomByPointerEvent = (e: PointerEvent) => {
  const el = document.elementFromPoint(e.pageX, e.pageY);
  if (el) {
    return el as HTMLElement;
  }

  return null;
};

export const parseUrlToObj = (url: string) => {
  if (!url) {
    return {};
  }
  const match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
  if (!match) {
    return {};
  }
  const query = match[6] || '';
  const fragment = match[8] || '';
  return {
    host: match[4],
    path: match[5],
    protocol: match[2],
    relative: match[5] + query + fragment,
  };
};

