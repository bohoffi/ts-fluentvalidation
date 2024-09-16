import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function must<T>(fn: (value: T | null | undefined) => boolean): ValidationFn<T>;
export function must<T>(fn: (value: T | null | undefined) => boolean, message: string): ValidationFn<T>;
export function must<T>(fn: (value: T | null | undefined) => boolean, message?: string): ValidationFn<T> {
  return createValidationFn(fn, message || 'Value must meet the specified criteria');
}
