import { warning } from '../log'

export * from './db'

export const checkIsIndexedDBSupported = () => {
  if ('indexedDB' in window) {
      // 浏览器支持 IndexedDB
      return true
  }
  // 浏览器不支持 IndexedDB
  warning('IndexedDB is not supported in this browser.')
  return false
}