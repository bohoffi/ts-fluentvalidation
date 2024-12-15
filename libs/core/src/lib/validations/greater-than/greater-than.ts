import { NumberProperty } from '../../types/properties';
import { SyncValidation } from '../../types/validations';
import { createValidation } from '../create-validation';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';

/**
 * Creates a validation function that checks if the value is greater than the specified value.
 *
 * @param comparisonValue - The value to compare against.
 * @param message - The message to display if the validation fails.
 */
export function greaterThan<TValue extends NumberProperty, TModel>(
  comparisonValue: number,
  message?: string
): SyncValidation<TValue, TModel> {
  return createValidation<TValue, TModel>(value => (value ?? 0) > comparisonValue, {
    message: message ?? `'{propertyName}' must be greater than {comparisonValue}.`,
    errorCode: greaterThan.name
  }).withPlaceholder(DEFAULT_PLACEHOLDERS.comparisonValue, comparisonValue);
}
