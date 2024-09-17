import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function must<TValue = unknown, TModel = unknown>(fn: (value: TValue) => boolean): ValidationFn<TValue, TModel>;
export function must<TValue = unknown, TModel = unknown>(fn: (value: TValue) => boolean, message: string): ValidationFn<TValue, TModel>;
export function must<TValue = unknown, TModel = unknown>(fn: (value: TValue) => boolean, message?: string): ValidationFn<TValue, TModel> {
  return createValidationFn(fn, message || 'Value must meet the specified criteria');
}
