import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function must<T>(fn: (value: T) => boolean): ValidationFn<T>;
export function must<T>(fn: (value: T) => boolean, message: string): ValidationFn<T>;
export function must<T>(fn: (value: T) => boolean, message?: string): ValidationFn<T> {
  return createValidationFn(fn, message || 'Value must meet the specified criteria');
}
