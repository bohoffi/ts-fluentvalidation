import { StringProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function matches<TModel>(pattern: RegExp): ValidationFn<StringProperty, TModel>;
export function matches<TModel>(pattern: RegExp, message: string): ValidationFn<StringProperty, TModel>;
export function matches<TModel>(pattern: RegExp, message?: string): ValidationFn<StringProperty, TModel> {
  return createValidationFn(value => pattern.test(value || ''), message || 'Value must match pattern');
}
