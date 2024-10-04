import { ValidationFailure } from '../result/validation-failure';
import { Validation } from '../types';
import { DEFAULT_PLACEHOLDERS, formatMessage } from '../validations/message-formatter';

/**
 * Wraps a value as an array if it is not already an array.
 *
 * @param value - The value to wrap as an array.
 * @returns The value as an array.
 */
export function wrapAsArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

/**
 * Creates a validation failure for the given validation.
 *
 * @param model - The model being validated.
 * @param propertyName - The key being validated.
 * @param propertyValue - The value of the property being validated.
 * @param validation - The validation that failed.
 * @returns The created validation failure.
 */
export function failureForValidation<TModel, TValue>(
  model: TModel,
  propertyName: string,
  propertyValue: TValue,
  validation: Validation<TValue, TModel>
): ValidationFailure {
  return {
    propertyName: propertyName,
    message: formatMessage(validation.metadata.message || 'Validation failed', {
      ...validation.metadata.placeholders,
      [DEFAULT_PLACEHOLDERS.propertyName]: validation.metadata.propertyName || propertyName,
      [DEFAULT_PLACEHOLDERS.propertyValue]: propertyValue
    }),
    errorCode: validation.metadata.errorCode,
    attemptedValue: propertyValue,
    severity: validation.metadata.severityProvider ? validation.metadata.severityProvider(model, propertyValue) : 'Error'
  };
}
