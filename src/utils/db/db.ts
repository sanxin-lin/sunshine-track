import { type IStoreParameter, type IDBOptions, TransactionType } from '../../types';

export class TrackIndexedDB<T> {
  private dbNamesuffix: string
  private _dbName: string = '';
  private dbName: string = ''
  private dbVersion: number;
  private db!: IDBDatabase;
  private stores: IStoreParameter[] = [];

  constructor(options: Pick<IDBOptions, 'dbNamesuffix' | 'stores' | 'dbVersion'>) {
    const { dbVersion, dbNamesuffix, stores } = options
    this.dbVersion = dbVersion
    this.dbNamesuffix = dbNamesuffix
    this.stores = stores || []
  }

  init(options: Pick<IDBOptions, 'dbName'>): Promise<void> {
    const { dbName } = options;
    this._dbName = dbName;
    this.dbName = `${this._dbName}${this.dbNamesuffix}`
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.stores.forEach(({ name, params }) => this.createStore(name, params));
        resolve();
      };

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event: Event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  createStore(storeName: string, options?: IDBObjectStoreParameters) {
    const { objectStoreNames } = this.db;
    if (!objectStoreNames.contains(storeName)) {
      this.db.createObjectStore(storeName, options);
    }
  }

  getTransaction(storeName: string, transactionType?: TransactionType) {
    return this.db.transaction(storeName, transactionType);
  }

  getObjectStore(storeName: string, transactionType?: TransactionType) {
    const transaction = this.getTransaction(storeName, transactionType);
    const objectStore = transaction.objectStore(storeName);

    return objectStore;
  }

  add(storeName: string, item: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction(storeName, TransactionType.Readwrite);
      const objectStore = transaction.objectStore(storeName);
      objectStore.add(item);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (event: Event) => {
        reject((event.target as IDBTransaction).error);
      };
    });
  }

  // 主键取数据
  get(storeName: string, primaryKey: string): Promise<T[] | undefined> {
    return new Promise((resolve, reject) => {
      const objectStore = this.getObjectStore(storeName, TransactionType.Readonly);
      const request = objectStore.get(primaryKey);

      request.onsuccess = (event: Event) => {
        const { result } = event.target as IDBRequest;
        resolve(result);
      };

      request.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject(error);
      };
    });
  }

  getAll(storeName: string): Promise<T[] | undefined> {
    return new Promise((resolve, reject) => {
      const objectStore = this.getObjectStore(storeName, TransactionType.Readonly);
      const request = objectStore.getAll();

      request.onsuccess = (event: Event) => {
        const { result } = event.target as IDBRequest;
        resolve(result);
      };

      request.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject(error);
      };
    });
  }

  update(storeName: string, item: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction(storeName, TransactionType.Readwrite);
      const objectStore = transaction.objectStore(storeName);
      objectStore.put(item);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject(error);
      };
    });
  }

  remove(storeName: string, primaryKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction(storeName, TransactionType.Readwrite);
      const objectStore = this.getObjectStore(storeName, TransactionType.Readwrite);
      objectStore.delete(primaryKey);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject(error);
      };
    });
  }

  getCount(storeName: string) {
    return new Promise((resolve, reject) => {
      const objectStore = this.getObjectStore(storeName, TransactionType.Readonly);
      const request = objectStore.count();

      request.onsuccess = (event: Event) => {
        const { result } = event.target as IDBRequest;
        resolve(result);
      };

      request.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject(error);
      };
    });
  }

  clear(storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction(storeName, TransactionType.Readwrite);
      const objectStore = this.getObjectStore(storeName, TransactionType.Readwrite);
      objectStore.clear();

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject(error);
      };
    });
  }
}

export default TrackIndexedDB;
