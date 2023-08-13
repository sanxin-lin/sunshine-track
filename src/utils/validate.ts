import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'
import isBoolean from 'lodash/isBoolean'
import isUndefined from 'lodash/isUndefined'
import isArray from 'lodash/isArray'
import { PropType } from '../types'
import { throwError } from './log'

export const isValidString = <T>(target: T) => isString(target) && target !== ''
export const validPhone = (target: string) => {
    const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
    return phoneReg.test(target)
}
export const validEmail = (target: string) => {
    const emailReg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
    return emailReg.test(target)
}
export const validDns = (target: string) => {
    const dnsRegex =
        /^(https?|http):\/\/([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*(?:\.[a-zA-Z]{2,})|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))(?::\d+)?(?:\/\S*)?$/
    return dnsRegex.test(target)
}

interface IValidItem<T = any> {
    field: string
    value: T
    type: PropType
}
const VALID_MAP = {
    [PropType.String]: <T>(v: T) => isValidString(v),
    [PropType.Number]: <T>(V: T) => isNumber(V),
    [PropType.Boolean]: <T>(V: T) => isBoolean(V),
    [PropType.Array]: <T>(V: T) => isArray(V),
    [PropType.Phone]: (v: string) => validPhone(v),
    [PropType.Email]: (v: string) => validEmail(v),
    [PropType.Dns]: (v: string) => validDns(v),
}
const checkValid = async ({ validRes, field, type }: { validRes: boolean; field: string; type: string }) => {
    if (!validRes) {
      throwError(`options validate error: ${field} is not of type ${type}`)
    }
}
export const validTypes = (validItems: IValidItem[] = []) => {
    for (let i = 0; i < validItems.length; i++) {
        const { value, type, field } = validItems[i]
        checkValid({
            validRes: VALID_MAP[type](value),
            field,
            type,
        })
    }

    return true
}

export const unknownToString = (target: unknown) => {
    if (isString(target)) {
      return target as string;
    }
    if (isUndefined(target)) {
      return 'undefined';
    }
    return JSON.stringify(target);
  }