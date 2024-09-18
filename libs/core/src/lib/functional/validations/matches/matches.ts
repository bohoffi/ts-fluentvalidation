import { StringProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value matches the specified pattern.
 *
 * @param pattern - The pattern to match against.
 */
export function matches<TModel>(pattern: RegExp): ValidationFn<StringProperty, TModel>;
export function matches<TModel>(pattern: RegExp, message: string): ValidationFn<StringProperty, TModel>;
export function matches<TModel>(pattern: RegExp, message?: string): ValidationFn<StringProperty, TModel> {
  return createValidationFn(value => pattern.test(value || ''), message || 'Value must match pattern.');
}
