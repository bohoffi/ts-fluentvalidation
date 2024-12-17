import { SyncValidation } from '../../types/validations';
import { equals } from '../equals/equals';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';
import { not } from '../not/not';

/**
 * Creates a validation function that checks if the value is not equal to the comparison value.
 *
 * @param comparisonValue - The value to compare against.
 * @param message - The message to display if the validation fails.
 */
export function notEquals<TValue, TModel, TComparison extends TValue>(
  comparisonValue: TComparison,
  message?: string
): SyncValidation<TValue, TModel> {
  return not<TValue, TModel>(equals(comparisonValue, message))
    .withErrorCode(notEquals.name)
    .withPlaceholder(DEFAULT_PLACEHOLDERS.comparisonValue, comparisonValue);
}
