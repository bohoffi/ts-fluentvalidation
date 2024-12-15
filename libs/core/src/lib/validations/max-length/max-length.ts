import { LengthProperty } from '../../types/properties';
import { SyncValidation } from '../../types/validations';
import { createValidation } from '../create-validation';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';

/**
 * Creates a validation function that checks if the values length is less than or equal to the specified maximum.
 *
 * @param maxLength - The maximum length.
 * @param message - The message to display if the validation fails.
 */
export function maxLength<TValue extends LengthProperty, TModel>(maxLength: number, message?: string): SyncValidation<TValue, TModel> {
  return createValidation<TValue, TModel>(value => (value?.length ?? 0) <= maxLength, {
    message: message ?? `'{propertyName}' must have a maximum length of {maxLength}.`,
    errorCode: 'maxLength'
  }).withPlaceholder(DEFAULT_PLACEHOLDERS.maxLength, maxLength);
}
