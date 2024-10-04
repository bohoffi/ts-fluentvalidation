import { LengthProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the values length is less than or equal to the specified maximum.
 *
 * @param maxLength - The maximum length.
 */
export function maxLength<TValue extends LengthProperty, TModel>(maxLength: number): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the values length is less than or equal to the specified maximum.
 *
 * @param maxLength - The maximum length.
 * @param message - The message to display if the validation fails.
 */
export function maxLength<TValue extends LengthProperty, TModel>(maxLength: number, message: string): SyncValidation<TValue, TModel>;
export function maxLength<TValue extends LengthProperty, TModel>(maxLength: number, message?: string): SyncValidation<TValue, TModel> {
  return createValidation<TValue, TModel>(value => (value?.length || 0) <= maxLength, {
    message: message || `Value must have a maximum length of ${maxLength}.`,
    errorCode: 'maxLength'
  });
}
