import { ValidationFn } from '../types/types';

export function createValidationFn<TValue>(fn: (value: TValue) => boolean): ValidationFn<TValue>;
export function createValidationFn<TValue>(fn: (value: TValue) => boolean, message: string): ValidationFn<TValue>;
export function createValidationFn<TValue>(fn: (value: TValue) => boolean, message?: string): ValidationFn<TValue> {
  const validationFn = (value: TValue) => fn(value);
  if (message) {
    validationFn.message = message;
  }
  return validationFn;
}
