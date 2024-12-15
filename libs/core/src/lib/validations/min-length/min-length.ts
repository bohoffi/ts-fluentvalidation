import { LengthProperty } from '../../types/properties';
import { SyncValidation } from '../../types/validations';
import { createValidation } from '../create-validation';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';

/**
 * Creates a validation function that checks if the values length is greater than or equal to the specified minimum.
 *
 * @param minLength - The minimum length.
 * @param message - The message to display if the validation fails.
 */
export function minLength<TValue extends LengthProperty, TModel>(minLength: number, message?: string): SyncValidation<TValue, TModel> {
  return createValidation<TValue, TModel>(value => (value?.length ?? 0) >= minLength, {
    message: message,
    errorCode: 'minLength'
  }).withPlaceholder(DEFAULT_PLACEHOLDERS.minLength, minLength);
}
