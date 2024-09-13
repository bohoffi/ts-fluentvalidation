import { ValidationFn } from './types';

export function createValidationFn<T>(fn: (value: T | null | undefined) => boolean, message?: string): ValidationFn<T> {
  const validationFn = (value: T | null | undefined) => fn(value);
  if (message) {
    validationFn.message = message;
  }
  return validationFn;
}
