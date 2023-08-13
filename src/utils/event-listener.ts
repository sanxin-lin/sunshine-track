import isElement from 'lodash/isElement'
import isFunction from 'lodash/isFunction'
import isUndefined from 'lodash/isUndefined'
import { NATIVE_EVENTS } from '../configs'

type Event = (e?: any) => void

interface IEventMap {
    [key: string]: Event
}

interface IParams {
    el: HTMLElement | Document | Window | XMLHttpRequest
    eventName: string
    event: Event,
    capture?: boolean
}

type ElMap = Map<IParams['el'], IEventMap>

const validEvent = ({ el, eventName, event }: IParams) => {
    const isEl = isElement(el) || [window, document].includes(el as any) || el instanceof XMLHttpRequest
    const isAllowEventName = NATIVE_EVENTS.includes(eventName)
    const isEventFn = isFunction(event)

    return isEl && isAllowEventName && isEventFn
}

export class EventListener {
    private map: ElMap

    constructor() {
        this.map = new Map()
    }

    on({ el, eventName, event }: IParams) {
        const validate = validEvent({
            el,
            eventName,
            event,
        })
        if (!validate) return
        let eventMap = this.map.get(el)
        if (isUndefined(eventMap)) {
            eventMap = {}
        }
        el.addEventListener(eventName, event)
        eventMap[eventName] = event
        this.map.set(el, eventMap)
    }

    batchOn({ el, eventNames = [], event }: Pick<IParams, 'el' | 'event'> & { eventNames: string[] }) {
        eventNames.forEach(eventName =>
            this.on({
                el,
                eventName,
                event,
            })
        )
    }

    remove({ el, eventName }: Pick<IParams, 'el' | 'eventName'>) {
        const eventMap = this.map.get(el)
        if (!isUndefined(eventMap)) {
            const event = eventMap[eventName]
            el.removeEventListener(eventName, event)
            delete eventMap[eventName]
        }
    }

    removeAllWithEl(el: IParams['el']) {
        const eventMap = this.map.get(el)
        if (!isUndefined(eventMap)) {
            const eventNames = Object.keys(eventMap)
            eventNames.forEach(eventName => this.remove({ el, eventName }))
            this.map.delete(el)
        }
    }

    reset() {
        const els = [...this.map.keys()]
        els.forEach(el => this.removeAllWithEl(el))
    }
}

export const eventListener = new EventListener()

export const on = ({ el, eventName, event, capture = false }: IParams) => {
    const validate = validEvent({
        el,
        eventName,
        event,
    })
    if (!validate) return
    el.addEventListener(eventName, event, capture)
}

export default EventListener
