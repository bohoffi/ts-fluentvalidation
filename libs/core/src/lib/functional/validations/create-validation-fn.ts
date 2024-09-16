import { ValidationFn } from '../types/types';

export function createValidationFn<TValue>(fn: (value: TValue | null | undefined) => boolean): ValidationFn<TValue>;
export function createValidationFn<TValue>(fn: (value: TValue | null | undefined) => boolean, message: string): ValidationFn<TValue>;
export function createValidationFn<TValue>(fn: (value: TValue | null | undefined) => boolean, message?: string): ValidationFn<TValue> {
  const validationFn = (value: TValue | null | undefined) => fn(value);
  if (message) {
    validationFn.message = message;
  }
  return validationFn;
}
