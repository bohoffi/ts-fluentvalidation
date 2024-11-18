import { SyncValidation } from '../../types/validations';
import { createValidation } from '../create-validation';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';

/**
 * Creates a validation function that checks if the value is equal to the comparison value.
 *
 * @param comparisonValue - The value to compare against.
 * @param message - The message to display if the validation fails.
 */
export function equals<TValue, TModel, TComparison extends TValue>(
  comparisonValue: TComparison,
  message?: string
): SyncValidation<TValue, TModel> {
  return createValidation<TValue, TModel>(value => value === comparisonValue, {
    message: message ?? `'{propertyName}' must equal {comparisonValue}.`,
    errorCode: equals.name
  }).withPlaceholder(DEFAULT_PLACEHOLDERS.comparisonValue, comparisonValue);
}
