import { StringProperty } from '../../types/properties';
import { SyncValidation } from '../../types/validations';
import { createValidation } from '../create-validation';

/**
 * Creates a validation function that checks if the value matches the specified pattern.
 *
 * @param pattern - The pattern to match against.
 * @param message - The message to display if the validation fails.
 */
export function matches<TValue extends StringProperty, TModel>(pattern: RegExp, message?: string): SyncValidation<TValue, TModel> {
  return createValidation(value => pattern.test(value ?? ''), {
    message: message,
    errorCode: matches.name
  });
}
