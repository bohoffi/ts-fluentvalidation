/* eslint-disable @typescript-eslint/ban-types */
export type KeyOf<T> = Extract<keyof T, string> & string;

export type Nullish<T> = T | null | undefined;

export type EmptyObject = {};

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

// TODO merge two rules to expose object containing both rules
