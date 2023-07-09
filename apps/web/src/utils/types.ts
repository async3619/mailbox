export type Fn<TArgs, TReturn> = TArgs extends unknown[]
    ? (...args: TArgs) => TReturn
    : TArgs extends void
    ? () => TReturn
    : (args: TArgs) => TReturn;

export type Nullable<T> = T | null | undefined;
export type KeyOf<T> = Exclude<keyof T, number | symbol>;
