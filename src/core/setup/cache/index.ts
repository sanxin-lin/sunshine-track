import type { IOptions } from '../../../types';
import { isArray } from 'lodash-es';
import { checkIsIndexedDBSupported, warning } from '../../../utils';
import options from '../../options';
import { db, storage } from './cache';

const setupStorage = (projectKey: string) => {
  const v = storage.getItem(projectKey);
  if (!isArray(v)) {
    storage.setItem(`${projectKey}`, []);
  }
};

const setupDB = async (projectKey: string) => {
  try {
    if (!checkIsIndexedDBSupported()) {
      throw new Error('IndexedDB is not supported in this browser.');
    }
    await db.init({
      dbName: projectKey,
    });
  } catch (e) {
    warning('db is close');
    // indexedDB 报错则关闭
    options.set({ cacheType: 'normal' });
  }
};

export const setupCache = async (options: IOptions) => {
  const { cacheType, projectKey } = options;
  // 根据 cacheType 去初始化
  switch (cacheType) {
    case 'storage':
      setupStorage(projectKey);
      break;
    case 'db':
      await setupDB(projectKey);
      break;
    default:
      break;
  }
};

export default setupCache;
