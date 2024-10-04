/**
 * Wraps a value as an array if it is not already an array.
 *
 * @param value - The value to wrap as an array.
 * @returns The value as an array.
 */
export function wrapAsArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
