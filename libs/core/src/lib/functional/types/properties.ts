import { Prettify } from './ts-helpers';

type ValueProperty = string | number | boolean | bigint | Date;
type NonFunctionObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
};

export type StringProperty = Extract<ValueProperty, string> | null | undefined;
export type NumberProperty = Extract<ValueProperty, number | bigint> | null | undefined;
export type BooleanProperty = Extract<ValueProperty, boolean> | null | undefined;

export type Property = StringProperty | NumberProperty | BooleanProperty;
export type LengthProperty = StringProperty | ArrayLike<unknown> | null | undefined;
export type ComplexProperty = Prettify<NonFunctionObject> | null | undefined;

export function isStringProperty(value: unknown): value is StringProperty {
  return typeof value === 'string';
}
export function isNumberProperty(value: unknown): value is NumberProperty {
  return typeof value === 'number' || typeof value === 'bigint';
}
export function isBooleanProperty(value: unknown): value is BooleanProperty {
  return typeof value === 'boolean';
}
export function isLengthProperty(value: unknown): value is LengthProperty {
  return typeof value === 'string' || Array.isArray(value);
}
