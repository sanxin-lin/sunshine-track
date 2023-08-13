import isElement from 'lodash/isElement'
import isPlainObject from 'lodash/isPlainObject'
import isUndefined from 'lodash/isUndefined'
// import isString from 'lodash/isString'
// import isNumber from 'lodash/isNumber'
// import { warning } from '@sunshine-track/utils'
import { IEventParams, StatusType } from '@sunshine-track/types'
import { eventListener, getTimestamp } from '@sunshine-track/utils'
import eventTrack from '../event/event'

export const validateEventParams = (params: IEventParams | undefined) => {
  if (!isPlainObject(params)) return false
  const { type, data } = params as IEventParams
  if (isUndefined(type) || isUndefined(data)) return false
  return true
}


const handleReport = (el: HTMLElement, bind: any, isMounted?: boolean) => {
    if (!isElement(el)) return
    const { modifiers, value } = bind
    const validateValueRes = validateEventParams(value)
    if (!validateValueRes) {
        return
    }
    const eventNames = Object.keys(modifiers)
    const doing = () => {
      const { type, data } = value as IEventParams
      eventTrack.add({
        type,
        data,
        status: StatusType.Ok,
        time: getTimestamp(),
      }) 
    }
    // 没有事件，则只执行一次
    if (!eventNames.length) {
        if (isMounted) {
            doing()
        }
        return
    }
    eventListener.batchOn({
        el,
        eventNames,
        event: doing,
    })
}

const directive: any = {
    mounted(el: HTMLElement, bind: any) {
        handleReport(el, bind, true)
    },
    updated(el: HTMLElement, bind: any) {
        eventListener.removeAllWithEl(el)
        handleReport(el, bind)
    },
    unmounted(el: HTMLElement) {
        eventListener.removeAllWithEl(el)
    },
}

export default directive
