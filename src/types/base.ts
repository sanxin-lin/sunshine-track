export interface IAnyObject {
  [key: string]: any;
}

export type voidFunc = (...args: any[]) => void;

export type Callback = (...args: any[]) => any;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
