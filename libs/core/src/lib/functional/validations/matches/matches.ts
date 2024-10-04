import { StringProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value matches the specified pattern.
 *
 * @param pattern - The pattern to match against.
 */
export function matches<TValue extends StringProperty, TModel>(pattern: RegExp): SyncValidation<TValue, TModel>;
export function matches<TValue extends StringProperty, TModel>(pattern: RegExp, message: string): SyncValidation<TValue, TModel>;
export function matches<TValue extends StringProperty, TModel>(pattern: RegExp, message?: string): SyncValidation<TValue, TModel> {
  return createValidation(value => pattern.test(value || ''), {
    message: message || 'Value must match pattern.',
    errorCode: matches.name
  });
}
