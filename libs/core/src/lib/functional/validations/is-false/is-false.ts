import { BooleanProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { isTrue } from '../is-true/is-true';
import { not } from '../not/not';

/**
 * Creates a validation function that checks if the value is false.
 */
export function isFalse<TValue extends BooleanProperty, TModel>(): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the value is false.
 *
 * @param message - The message to display if the validation fails.
 */
export function isFalse<TValue extends BooleanProperty, TModel>(message: string): SyncValidation<TValue, TModel>;
export function isFalse<TValue extends BooleanProperty, TModel>(message?: string): SyncValidation<TValue, TModel> {
  return not(isTrue(message || 'Value must be false.')).withErrorCode(isFalse.name);
}
