import type { IEventParams } from '../../../types';
import {
  TrackStorage,
  TrackIndexedDB,
} from '../../../utils';
import {
  DB_EVENT_STORE_NAME,
  DB_EVENT_STORE_PRIMARY_KEY,
  DB_NAME_SUFFIX,
  DB_VERSION,
  STORAGE_KEY_SUFFIX,
  STORAGE_VERSION,
} from '../../../configs';

export const storage = new TrackStorage({
  suffix: STORAGE_KEY_SUFFIX,
  version: STORAGE_VERSION,
});

export const db = new TrackIndexedDB<IEventParams>({
  dbNamesuffix: DB_NAME_SUFFIX,
  dbVersion: DB_VERSION,
  stores: [{ name: DB_EVENT_STORE_NAME, params: { keyPath: DB_EVENT_STORE_PRIMARY_KEY } }]
})
