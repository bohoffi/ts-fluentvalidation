import { Prettify } from './ts-helpers';

type ValueProperty = string | number | boolean | bigint | Date;
type NonFunctionObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
};

/**
 * Represents a property that can be a string, null or undefined.
 */
export type StringProperty = Extract<ValueProperty, string> | null | undefined;
/**
 * Represents a property that can be a number, bigint, null or undefined.
 */
export type NumberProperty = Extract<ValueProperty, number | bigint> | null | undefined;
/**
 * Represents a property that can be a boolean, null or undefined.
 */
export type BooleanProperty = Extract<ValueProperty, boolean> | null | undefined;

/**
 * Represents a property that fulfills the constraint `{ length: number; }`, null or undefined.
 */
export type LengthProperty = { length: number } | null | undefined;
/**
 * Represents a property that can be a non-function object, null or undefined.
 */
export type ComplexProperty = Prettify<NonFunctionObject> | null | undefined;

export function isLengthProperty(value: unknown): value is LengthProperty {
  return typeof value === 'string' || Array.isArray(value);
}