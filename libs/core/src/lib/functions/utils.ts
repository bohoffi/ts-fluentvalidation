import { i18n } from '../i18n/i18n';
import { ValidationFailure } from '../result/validation-failure';
import { Validation } from '../types';
import { ValidationContext } from '../validation-context';
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
 * @param propertyNameFromModel - The key being validated.
 * @param propertyValue - The value of the property being validated.
 * @param validation - The validation that failed.
 * @returns The created validation failure.
 */
export function failureForValidation<TModel, TValue>(
  validationContext: ValidationContext<TModel>,
  propertyNameFromModel: string,
  propertyValue: TValue,
  validation: Validation<TValue, TModel>,
  index?: number
): ValidationFailure {
  const propertyNameForFailure = appendIndexIfSet(validation.metadata.propertyNameOverride ?? propertyNameFromModel, index);
  const computedPropertyName = validationContext.parentPropertyName
    ? `${validationContext.parentPropertyName}.${propertyNameForFailure}`
    : propertyNameForFailure;
  return {
    propertyName: computedPropertyName,
    message: formatMessage(validation.metadata.message ?? i18n.getMessage(validation.metadata.errorCode ?? 'default'), {
      ...validation.metadata.placeholders,
      [DEFAULT_PLACEHOLDERS.propertyName]: validation.metadata.propertyName ?? computedPropertyName,
      [DEFAULT_PLACEHOLDERS.propertyValue]: propertyValue
    }),
    errorCode: validation.metadata.errorCode,
    attemptedValue: propertyValue,
    severity: validation.metadata.severityProvider
      ? validation.metadata.severityProvider(validationContext.modelToValidate, propertyValue)
      : 'Error',
    customState: validation.metadata.customStateProvider
      ? validation.metadata.customStateProvider(validationContext.modelToValidate, propertyValue)
      : undefined
  };
}

function appendIndexIfSet(propertyName: string, index?: number): string {
  return index !== undefined ? `${propertyName}[${index}]` : propertyName;
}
