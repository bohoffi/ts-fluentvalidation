import { StringProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value matches the specified pattern.
 *
 * @param pattern - The pattern to match against.
 */
export function matches<TModel>(pattern: RegExp): SyncValidation<StringProperty, TModel>;
export function matches<TModel>(pattern: RegExp, message: string): SyncValidation<StringProperty, TModel>;
export function matches<TModel>(pattern: RegExp, message?: string): SyncValidation<StringProperty, TModel> {
  return createValidation(value => pattern.test(value || ''), message || 'Value must match pattern.');
}
