import { BooleanProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { isTrue } from '../is-true/is-true';
import { not } from '../not/not';

/**
 * Creates a validation function that checks if the value is false.
 */
export function isFalse<TModel>(): SyncValidation<BooleanProperty, TModel>;
/**
 * Creates a validation function that checks if the value is false.
 *
 * @param message - The message to display if the validation fails.
 */
export function isFalse<TModel>(message: string): SyncValidation<BooleanProperty, TModel>;
export function isFalse<TModel>(message?: string): SyncValidation<BooleanProperty, TModel> {
  return not(isTrue(message || 'Value must be false.'));
}
