import { LengthProperty } from '../../types/properties';
import { SyncValidation } from '../../types/validations';
import { createValidation } from '../create-validation';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';

/**
 * Creates a validation function that checks if the values length is between (inclusive) the specified minimum and maximum.
 *
 * @param minLength - The minimum length.
 * @param maxLength - The maximum length.
 * @param message - The message to display if the validation fails.
 */
export function length<TValue extends LengthProperty, TModel>(
  minLength: number,
  maxLength: number,
  message?: string
): SyncValidation<TValue, TModel> {
  return createValidation<TValue, TModel>(
    value => {
      const valueLength = value?.length ?? 0;
      return valueLength >= minLength && valueLength <= maxLength;
    },
    {
      message: message ?? `'{propertyName}' must have a length between (inclusive) {minLength} and {maxLength}.`,
      errorCode: length.name
    }
  )
    .withPlaceholder(DEFAULT_PLACEHOLDERS.minLength, minLength)
    .withPlaceholder(DEFAULT_PLACEHOLDERS.maxLength, maxLength);
}
