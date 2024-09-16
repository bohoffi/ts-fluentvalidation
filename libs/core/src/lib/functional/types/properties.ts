type ValueProperty = string | number | boolean | bigint | Date;

export type StringProperty = Extract<ValueProperty, string>;
export type NumberProperty = Extract<ValueProperty, number | bigint>;
export type BooleanProperty = Extract<ValueProperty, boolean>;
export type DateProperty = Extract<ValueProperty, Date>;

export type Property = StringProperty | NumberProperty | BooleanProperty | DateProperty;
export type LengthProperty = StringProperty | ArrayLike<unknown>;

export function isStringProperty(value: unknown): value is StringProperty {
  return typeof value === 'string';
}
export function isNumberProperty(value: unknown): value is NumberProperty {
  return typeof value === 'number' || typeof value === 'bigint';
}
export function isBooleanProperty(value: unknown): value is BooleanProperty {
  return typeof value === 'boolean';
}
export function isDateProperty(value: unknown): value is DateProperty {
  return value instanceof Date;
}
export function isLengthProperty(value: unknown): value is LengthProperty {
  return typeof value === 'string' || Array.isArray(value);
}
