import { PACKAGES_NAME } from '../configs'

let logFlag = false

export const setLogFlag = (flag: boolean) => {
    logFlag = flag
}

export const log = (...args: any[]) => {
    if (!logFlag) return
    console.log(`[${PACKAGES_NAME}]`, ...args)
}

export const warning = (msg: string) => {
    console.warn(`[${PACKAGES_NAME}] ${msg}`)
}

export const throwError = (msg: string) => {
    throw new Error(`[${PACKAGES_NAME}] ${msg}`)
}

export const safeExecute = (executor: any, errorHandler?: any) => {
    try {
        return executor()
    } catch (e) {
        warning(e as string)
        return errorHandler?.()
    }
}