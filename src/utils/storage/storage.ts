import isArray from 'lodash/isArray'
import isPlainObject from 'lodash/isPlainObject'
import { type IStorageOptions } from '../../types'

export class TrackStorage {
    private storage: Storage
    private suffix: string
    private version: number

    constructor(options: IStorageOptions) {
        const { storage = localStorage, suffix, version } = options
        this.storage = storage
        this.suffix = suffix
        this.version = version
    }

    getKey(key: string) {
        return `${key}${this.suffix}_v${this.version}`
    }

    setItem(key: string, value: any): void {
        let v = value
        try {
            v = JSON.stringify(value)
        } catch (e) {
            v = value
        }
        this.storage.setItem(this.getKey(key), v)
    }

    getItem<T>(key: string): T | null {
        const item = this.storage.getItem(this.getKey(key))
        if (!item) return null
        try {
            return JSON.parse(item) as T
        } catch (e) {
            return item as T
        }
    }

    putItem<T>(key: string, v: T) {
        let value = this.getItem<T>(key) || [] as T
        if (isArray(value) && isPlainObject(v)) {
            value = [...(value as any[]), v] as T
            this.setItem(key, value)
        }
    }

    removeItem(key: string): void {
        this.storage.removeItem(this.getKey(key))
    }

    clear(): void {
        this.storage.clear()
    }

    getAllKeys(): string[] {
        return Object.keys(this.storage)
    }
}

export default TrackStorage
