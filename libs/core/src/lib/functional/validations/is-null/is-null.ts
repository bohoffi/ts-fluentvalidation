import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function isNull<TValue, TModel>(): ValidationFn<TValue, TModel>;
export function isNull<TValue, TModel>(message: string): ValidationFn<TValue, TModel>;
export function isNull<TValue, TModel>(message?: string): ValidationFn<TValue, TModel> {
  return createValidationFn(value => value === null, message || 'Value must be null.');
}
