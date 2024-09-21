import { LengthProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { empty } from '../empty/empty';
import { not } from '../not/not';

/**
 * Creates a validation function that checks if the value is not empty.
 */
export function notEmpty<TModel>(): SyncValidation<LengthProperty, TModel>;
/**
 * Creates a validation function that checks if the value is not empty.
 *
 * @param message - The message to display if the validation fails.
 */
export function notEmpty<TModel>(message: string): SyncValidation<LengthProperty, TModel>;
export function notEmpty<TModel>(message?: string): SyncValidation<LengthProperty, TModel> {
  return not(empty(message || 'Value must not be empty.'));
}
