import { LengthProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the values length is 0.
 */
export function empty<TModel>(): SyncValidation<LengthProperty, TModel>;
/**
 * Creates a validation function that checks if the values length is 0.
 *
 * @param message - The message to display if the validation fails.
 */
export function empty<TModel>(message: string): SyncValidation<LengthProperty, TModel>;
export function empty<TModel>(message?: string): SyncValidation<LengthProperty, TModel> {
  return createValidation(value => (value?.length || 0) === 0, message || 'Value must be empty.');
}
