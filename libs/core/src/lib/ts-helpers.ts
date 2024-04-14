/* eslint-disable @typescript-eslint/ban-types */
/**
 * Represents a type that extracts the keys of an object type `T`.
 * The resulting keys are narrowed down to string literals.
 *
 * @typeParam T - The object type from which to extract the keys.
 * @returns A union type of string literals representing the keys of `T`.
 */
export type KeyOf<T> = Extract<keyof T, string> & string;

/**
 * Represents a type that can be either `T`, `null`, or `undefined`.
 * @typeParam T - The underlying type.
 */
export type Nullish<T> = T | null | undefined;

/**
 * Represents an empty object.
 */
export type EmptyObject = {};

/**
 * Represents a type that prettifies another type by preserving all its properties.
 *
 * @typeParam T - The type to be prettified.
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
