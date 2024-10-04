import { LengthProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { empty } from '../empty/empty';
import { not } from '../not/not';

/**
 * Creates a validation function that checks if the value is not empty.
 */
export function notEmpty<TValue extends LengthProperty, TModel>(): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the value is not empty.
 *
 * @param message - The message to display if the validation fails.
 */
export function notEmpty<TValue extends LengthProperty, TModel>(message: string): SyncValidation<TValue, TModel>;
export function notEmpty<TValue extends LengthProperty, TModel>(message?: string): SyncValidation<TValue, TModel> {
  return not(empty(message || 'Value must not be empty.')).withErrorCode(notEmpty.name);
}
