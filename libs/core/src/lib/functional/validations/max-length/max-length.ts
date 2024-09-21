import { LengthProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the values length is less than or equal to the specified maximum.
 *
 * @param maxLength - The maximum length.
 */
export function maxLength<TModel>(maxLength: number): SyncValidation<LengthProperty, TModel>;
/**
 * Creates a validation function that checks if the values length is less than or equal to the specified maximum.
 *
 * @param maxLength - The maximum length.
 * @param message - The message to display if the validation fails.
 */
export function maxLength<TModel>(maxLength: number, message: string): SyncValidation<LengthProperty, TModel>;
export function maxLength<TModel>(maxLength: number, message?: string): SyncValidation<LengthProperty, TModel> {
  return createValidation(value => (value?.length || 0) <= maxLength, message || `Value must have a maximum length of ${maxLength}.`);
}
