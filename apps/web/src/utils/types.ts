import { EmojisQuery } from "@apollo/queries";

export type Fn<TArgs, TReturn> = TArgs extends unknown[]
    ? (...args: TArgs) => TReturn
    : TArgs extends void
    ? () => TReturn
    : (args: TArgs) => TReturn;

export type AsyncFn<TArgs, TReturn> = TArgs extends unknown[]
    ? (...args: TArgs) => Promise<TReturn>
    : TArgs extends void
    ? () => Promise<TReturn>
    : (args: TArgs) => Promise<TReturn>;

export type Nullable<T> = T | null | undefined;
export type Resolved<T> = T extends Promise<infer U> ? U : T;

export type CustomEmojiItem = EmojisQuery["emojis"][0]["emojis"][0];
